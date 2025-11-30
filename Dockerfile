# Nginx’ni bazaviy image sifatida ishlatamiz
FROM nginx:alpine

# bb_loyiha papkadagi barcha fayllarni konteyner ichidagi web serverga nusxalash
COPY . /usr/share/nginx/html

# Port 80 ochiq bo‘lsin
EXPOSE 80