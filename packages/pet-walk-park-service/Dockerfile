# 基于node:18基础镜像
FROM node:18

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制 monorepo 根目录下的 package.json 和 pnpm-lock.yaml 文件到工作目录
COPY ../../package.json ../../pnpm-lock.yaml ./

# 复制 pet-walk-park-service 目录下的 package.json 到工作目录
COPY ./package.json ./packages/pet-walk-park-service/package.json

# 安装 monorepo 根目录下的依赖
RUN pnpm install --frozen-lockfile

# 复制 pet-walk-park-service 目录下的所有文件到工作目录
COPY . .

# 设置工作目录为 pet-walk-park-service
WORKDIR /app/packages/pet-walk-park-service

# 安装 pet-walk-park-service 目录下的依赖
RUN pnpm install --prod

# 安装 pm2
RUN pnpm add -g pm2@5.3.1

# 定义对外暴露的端口
EXPOSE 3000

# CMD为程序启动命令，我们使用了pm2启动服务
CMD ["pm2-runtime", "start", "pm2.json", "--env", "production"]

