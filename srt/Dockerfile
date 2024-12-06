# 阶段 1：构建依赖和安装 Python 包
FROM python:3.10-alpine AS builder

# 安装构建所需依赖
RUN apk add --no-cache \
    ffmpeg \
    bash \
    git \
    build-base \
    musl-dev \
    gcc \
    gfortran \
    openssl-dev \
    ca-certificates \
    && update-ca-certificates

# 设置工作目录
WORKDIR /app

# 复制项目文件和依赖清单
COPY requirements.txt .
COPY . .

# 安装 Python 依赖到一个独立目录
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# 阶段 2：创建最终精简镜像
FROM python:3.10-alpine

# 安装运行时依赖
RUN apk add --no-cache \
    ffmpeg \
    bash \
    openssl-dev \
    ca-certificates \
    && update-ca-certificates

# 设置工作目录
WORKDIR /app

# 复制构建好的依赖
COPY --from=builder /install /usr/local

# 复制项目文件
COPY . .

# 暴露 Flask 服务的端口
EXPOSE 5000

# 启动 Flask 应用
CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:5000", "--timeout", "600", "app:app"]
