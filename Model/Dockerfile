FROM python:3.9-slim

# ตั้งค่า Working Directory
WORKDIR /app

# คัดลอกไฟล์ requirements.txt ก่อน เพื่อใช้ Docker Cache
COPY requirements.txt /app/

# ติดตั้ง Dependencies ก่อนคัดลอกไฟล์อื่นๆ
RUN pip install --no-cache-dir -r requirements.txt

# คัดลอกไฟล์ที่เหลือ
COPY . /app

EXPOSE 5555

CMD ["python", "server.py"]
