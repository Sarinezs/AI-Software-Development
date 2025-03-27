FROM python:3.9

# ตั้งค่า Working Directory
WORKDIR /app

COPY requirements.txt .

# ติดตั้ง Dependencies
RUN pip install -r requirements.txt

# คัดลอกไฟล์ทั้งหมดไปยัง Container
COPY . /app


EXPOSE 5555

CMD ["python", "server.py"]
