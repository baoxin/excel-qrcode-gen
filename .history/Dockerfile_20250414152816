FROM node:20-alpine as builder

WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM python:3.9-alpine

WORKDIR /app
COPY --from=builder /app/dist /app

EXPOSE 8000

CMD ["python3", "-m", "http.server", "8000"] 