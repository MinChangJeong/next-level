# ====== Build Stage ======
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 파일 먼저 복사 (레이어 캐싱)
COPY package*.json ./
RUN npm install

# 소스 복사 및 빌드
COPY . .
RUN npm run build

# ====== Production Stage ======
FROM nginx:alpine AS production

# React 빌드 결과물 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# SPA nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
