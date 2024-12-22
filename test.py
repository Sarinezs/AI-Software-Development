import MetaTrader5 as mt5

# ข้อมูลบัญชี MetaQuotes-Demo
login_id = 88960295  # หมายเลขบัญชี (เปลี่ยนเป็นของคุณ)
password = "*f4bZmMj"  # รหัสผ่าน (เปลี่ยนเป็นของคุณ)
server = "MetaQuotes-Demo"  # เซิร์ฟเวอร์สำหรับบัญชี Demo

# เริ่มต้นการเชื่อมต่อ
if not mt5.initialize(login=login_id, password=password, server=server):
    print(f"Failed to connect to MetaQuotes-Demo: {mt5.last_error()}")
    quit()

# ตรวจสอบสถานะการเชื่อมต่อ
account_info = mt5.account_info()
if account_info is not None:
    print("Connected to MetaQuotes-Demo successfully!")
    print(f"Account ID: {account_info.login}")
    print(f"Balance: {account_info.balance} {account_info.currency}")
    print(f"Name: {account_info.name}")
else:
    print("Failed to get account information.")

# ปิดการเชื่อมต่อ
mt5.shutdown()
