from flask import Flask, render_template, request, jsonify, Response, send_from_directory
import os
import ffmpeg
import openai

app = Flask(__name__)

# 文件存储路径
UPLOAD_DIR = os.environ.get('UPLOAD_DIR')
OUTPUT_DIR = os.environ.get('OUTPUT_DIR')
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

openai.api_key = os.environ.get('OPENAI_API_KEY')
# 初始化 OpenAI 客户端
client = openai.OpenAI()

# 设置访问密码
ACCESS_PASSWORD = os.environ.get('ACCESS_PASSWORD')

def format_time(seconds):
    """将秒转换为 SRT 时间格式 (hh:mm:ss,ms)"""
    millis = int((seconds % 1) * 1000)
    seconds = int(seconds)
    minutes = seconds // 60
    hours = minutes // 60
    return f"{hours:02}:{minutes % 60:02}:{seconds % 60:02},{millis:03}"

@app.route('/')
def index():
    """返回主页面"""
    return render_template('index.html')

@app.route('/process', methods=['POST'])
def process_file():
    # 验证密码
    password = request.form.get("password")
    if password != ACCESS_PASSWORD:
        return jsonify({"error": "Invalid password"}), 403
    """上传文件、裁剪并生成字幕，同时流式返回进度"""
    def generate_progress(file_path, split_length):
        try:
            # 判断文件类型并处理
            is_audio, converted_file = check_and_convert_to_audio(file_path)

            # 获取文件总时长
            duration = get_video_length(converted_file)
            total_segments = (int(duration) + split_length - 1) // split_length  # 总片段数

            # 发送总片段数给前端
            yield f"data: {{\"total_segments\": {total_segments}}}\n\n"

            output_files = []

            # 开始裁剪和生成字幕
            for i in range(0, int(duration), split_length):
                part_number = i // split_length + 1
                offset = i
                output_file = os.path.join(OUTPUT_DIR, f"{os.path.basename(file_path)}_part{part_number}.mp3")
                subtitle_file = os.path.join(OUTPUT_DIR, f"{os.path.basename(file_path)}_part{part_number}.srt")

                # 裁剪音频
                ffmpeg.input(converted_file, ss=i, t=split_length).output(output_file).overwrite_output().run()
                output_files.append(os.path.basename(output_file))

                # 生成字幕
                with open(output_file, "rb") as audio_file:
                    try:
                        transcript = client.audio.transcriptions.create(
                            file=audio_file,
                            model="whisper-1",
                            language="zh",
                            timeout=600,  # 设置 10 分钟超时
                            response_format="verbose_json"
                        )
                    except Exception as e:
                        raise
                    with open(subtitle_file, "w", encoding="utf-8") as f:
                        for seg in transcript.segments:
                            start_time = format_time(seg.start + offset)
                            end_time = format_time(seg.end + offset)
                            f.write(f"{seg.id}\n{start_time} --> {end_time}\n{seg.text}\n\n")

                # 返回裁剪和字幕生成进度
                yield f"data: {{\"file\": \"{output_files[-1]}\", \"subtitle\": \"{os.path.basename(subtitle_file)}\"}}\n\n"
                try:
                    os.remove(output_file)
                except Exception as e:
                    print("failed to delete splitted file", e)
                    pass

            # 结束标志
            yield "data: COMPLETE\n\n"
            try:
                os.remove(file_path)
            except Exception as e:
                print("failed to delete uploaded file", e)
                pass
        except Exception as e:
            raise
            # 捕获异常并发送错误消息
            yield f"data: {{\"error\": \"{str(e)}\"}}\n\n"

    # 提取文件和裁剪时长
    file = request.files['file']
    split_length = int(request.form['split_length'])

    # 保存文件到磁盘
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    file.save(file_path)

    # 调用生成器函数并返回响应
    return Response(generate_progress(file_path, split_length), mimetype='text/event-stream')

@app.route('/download/<path:filename>', methods=['GET'])
def download_file(filename):
    """下载文件"""
    return send_from_directory(OUTPUT_DIR, filename)

def check_and_convert_to_audio(file_path):
    """检查文件类型，如果是视频则提取音频"""
    probe = ffmpeg.probe(file_path)
    is_audio = any(stream['codec_type'] == 'audio' for stream in probe['streams'])

    if is_audio:
        # 如果是音频文件，直接返回
        return True, file_path

    # 如果是视频文件，提取音频
    audio_file = os.path.splitext(file_path)[0] + ".mp3"
    ffmpeg.input(file_path).output(audio_file, acodec='mp3').run()
    return False, audio_file

def get_video_length(file_path):
    """获取视频/音频的长度（秒）"""
    probe = ffmpeg.probe(file_path)
    duration = float(probe['format']['duration'])
    return duration

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
