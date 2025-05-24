FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
ENV TZ=Etc/UTC \
    NODE_ENV=production
CMD ["node","index.js"]
