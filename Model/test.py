import zmq

# สร้าง ZeroMQ Context
context = zmq.Context()
socket = context.socket(zmq.REP)  # ตั้งค่าเป็น REP (Response)
socket.bind("tcp://127.0.0.1:5555")  # เปิดเซิร์ฟเวอร์

print("✅ ZeroMQ Server Started...")

while True:
    message = socket.recv_string()  # รับข้อความจาก MT5
    print(f"📩 Message from MT5: {message}")
    
    response = "Received: " + message  # ส่งกลับ
    socket.send_string(response)
