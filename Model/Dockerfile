FROM python:3.9

# ตั้งค่า Working Directory
WORKDIR /app

# คัดลอกไฟล์ทั้งหมดไปยัง Container
COPY . /app

# ติดตั้ง Dependencies
RUN pip install -r requirements.txt

EXPOSE 5555

CMD ["python", "server.py"]
