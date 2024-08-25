FROM node:18-alpine

WORKDIR /app

RUN yarn set version 3.6.1

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build

EXPOSE 3000

# 启动应用
CMD ["yarn", "serve"]
