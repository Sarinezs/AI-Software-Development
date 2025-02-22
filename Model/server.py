from stable_baselines3 import PPO
import zmq
import json
import pandas as pd
import ta  # ใช้ pandas-ta

# โหลดโมเดล AI
best_model = PPO.load('./best5_model_XAU/best_model.zip')

def main():
    context = zmq.Context()
    socket = context.socket(zmq.REP)
    socket.bind("tcp://*:5555")
    
    print("Python Server: Waiting for messages...")

    while True:
        message = socket.recv()
        message_str = message.decode()

        try:
            # รองรับ JSON Array
            data_list = json.loads(message_str)

            # แปลงข้อมูลเข้า DataFrame ชั่วคราว (Temporary DataFrame)
            df = pd.DataFrame(data_list)

            # แปลงคอลัมน์ Time เป็น datetime
            df.set_index('Datetime', inplace=True)

            # คำนวณ Indicator
            df["SMA"] = ta.trend.sma_indicator(df["Close"], window=12)
            df["RSI"] = ta.momentum.rsi(df["Close"])
            df["OBV"] = ta.volume.on_balance_volume(df["Close"], df["Volume"])
            df["EMA_9"] = ta.trend.ema_indicator(df["Close"], window=9)
            df["EMA_21"] = ta.trend.ema_indicator(df["Close"], window=21)

            # แทนค่า NaN ด้วย 0
            df.fillna(0, inplace=True)

            # ใช้ข้อมูลล่าสุด 24 แท่งเท่านั้น
            df_latest = df.tail(24)

            # ทำ Prediction
            prediction, _ = best_model.predict(df_latest)

        except json.JSONDecodeError:
            print("Error: Invalid JSON format")
            prediction = "Error"
        except KeyError as e:
            print(f"KeyError: {e}")
            prediction = "Error"
        except Exception as e:
            print(f"Unexpected error: {e}")
            prediction = "Error"

        # ตอบกลับไปยัง MT5
        socket.send_string(str(prediction))

        # ✅ ไม่ต้องเก็บข้อมูลไว้ใน DataFrame หลัก → ลบข้อมูลอัตโนมัติหลังพยากรณ์เสร็จ

if __name__ == "__main__":
    main()
