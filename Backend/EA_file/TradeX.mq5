#include <Zmq/Zmq.mqh>  // ZeroMQ Library
#include <Trade\Trade.mqh> //Instatiate Trades Execution Library
#include <Trade\OrderInfo.mqh> //Instatiate Library for Orders Information
#include <Trade\PositionInfo.mqh> //Instatiate Library for Positions Information
//---
CTrade         m_trade; // Trades Info and Executions library
COrderInfo     m_order; //Library for Orders information
CPositionInfo  m_position; // Library for all position features and information
input string zmq_server_address = "tcp://127.0.0.1:5555";  // ที่อยู่เซิร์ฟเวอร์ Python
input string token = ""; // ใส่ Token ที่นี่ตอนโหลด
Context context("AccountSender");
Socket socket(context, ZMQ_REQ);

bool VerifyToken(string token, string action)
{
   string url = "http://127.0.0.1:8000/MT5/connect"; //"http://192.168.1.36:3000/api/verify-token"
   string headers = "Content-Type: application/json\r\n";
   uchar postData[];
   uchar result[];
   string resultHeaders;
   int timeout = 5000;
   long mt5_id = AccountInfoInteger(ACCOUNT_LOGIN);
   double balance = AccountInfoDouble(ACCOUNT_BALANCE);

   // สร้าง JSON Body พร้อม action
   string body = "{ \"token\": \"" + token + 
              "\", \"mt5id\": " + IntegerToString(mt5_id) + 
              ", \"action\": \"" + action + 
              "\", \"balance\": " + DoubleToString(balance, 2) + " }";
   //Print("JSON Body: ", body);

   // แปลง JSON Body เป็น UTF-8
   StringToCharArray(body, postData, 0, StringLen(body), CP_UTF8);

   // ส่งคำขอ HTTP POST
   ResetLastError();
   int res = WebRequest("POST", url, headers, timeout, postData, result, resultHeaders);

   if (res == -1)
   {
      int errorCode = GetLastError();
      Print("WebRequest failed with error code: ", errorCode);
      return false;
   }

   // แปลงผลลัพธ์ที่ได้จากคำขอ
   string response = CharArrayToString(result);
   //Print("Raw server response: ", response);

   return true;
}

string GetSelectedModel()
{
    string url = "http://127.0.0.1:8000/api/get-selected-model?mt5_id=" + IntegerToString(AccountInfoInteger(ACCOUNT_LOGIN)) + "&api_token=" + token;
    char result[];
    string resultHeaders;
    string headers = "Content-Type: application/json\r\n";
    uchar response_data[];
    int timeout = 5000; // 5 วินาที

    ResetLastError();
    int res = WebRequest("GET", url, headers, timeout, response_data, result,resultHeaders);
    if (res != 200)
    {
        Print("Error fetching model from API. HTTP Code: ", res, " | Error: ", GetLastError());
        return "";
    }

    string response = CharArrayToString(result);
    
    return response;
}


void SendTradeHistory(string jsonData)
{
    string url = "http://127.0.0.1:8000/get-history";
    char result[]; // เก็บผลลัพธ์จาก HTTP request
    string resultHeaders; // เก็บ headers ที่ได้รับ
    string headers = "Content-Type: application/json\r\n";

    // กำหนดขนาดของ postData ตามความยาวของ JSON string ที่รับมา
    char postData[];
    StringToCharArray(jsonData, postData, 0, StringLen(jsonData), CP_UTF8);

    int timeout = 5000; // ตั้งค่า timeout เป็น 5 วินาที
    ResetLastError();

    // ส่ง HTTP POST request
    int res = WebRequest("POST", url, headers, timeout, postData, result, resultHeaders);

    if (res == 200)
    {
        Print("✅ Trade history successfully sent to server!");
        Print("🔹 Response: ", CharArrayToString(result)); // แสดงผลลัพธ์จากเซิร์ฟเวอร์
    }
    else
    {
        Print("❌ Failed to send trade history. HTTP Code: ", res, " | Error: ", GetLastError());
    }
}

string FormatDateTime(datetime time_value)
{
   MqlDateTime t;
   TimeToStruct(time_value, t);
   //Print("===================== ",time_value);
   return StringFormat("%04d-%02d-%02d %02d:%02d:%02d", t.year, t.mon, t.day, t.hour, t.min, t.sec);
}



string GetTradeHistoryAsJSON()
{
    MqlDateTime currentTime;
    TimeCurrent(currentTime);
    
    currentTime.day = 1;  // กำหนดให้เป็นวันที่ 1
    currentTime.hour = 0;
    currentTime.min = 0;
    currentTime.sec = 0;
    //currentTime.mon = 4;
    
    Print("Current_Time : ", currentTime.hour);
    
    datetime endOfMonth = StructToTime(currentTime) - 1;  // ลบด้วย 1 วินาที
    
    currentTime.mon -= 1; // ลดเดือนลง 1 เดือน
    if (currentTime.mon == 0) // ถ้าเดือนเป็น 0 หมายถึงมกราคม ต้องย้อนกลับไปธันวาคมปีที่แล้ว
    {
       currentTime.mon = 12;
       currentTime.year -= 1;
    }
   
    datetime startOfMonth = StructToTime(currentTime);
    
    Print("History Of The Date : ", startOfMonth, " - ", endOfMonth);
    
    string json = "{\"StartMonth\":\"" + FormatDateTime(startOfMonth) + "\",\"EndMonth\":\"" + FormatDateTime(endOfMonth) + "\",\"token\":\"" + token + "\",\"deals\":[";  // เพิ่ม token ที่นี่
    bool firstDeal = true;
    
    // โหลดประวัติ 30 วันย้อนหลัง
    bool historyLoaded = HistorySelect(startOfMonth, endOfMonth);
    
    if (!historyLoaded)
    {
        return "{\"error\":\"Failed to load history data\"}";
    }
    
    // สร้าง map เก็บ positions
    long positionMap[];  // เก็บ position IDs ที่เจอแล้ว
    int positionCount = 0;
    
    for (int i = 0; i < HistoryDealsTotal(); i++)
    {
        ulong dealTicket = HistoryDealGetTicket(i);
        if (dealTicket == 0) continue;
        
        // เช็คว่าเป็น deal ที่ปิด position
        ENUM_DEAL_ENTRY dealEntry = (ENUM_DEAL_ENTRY)HistoryDealGetInteger(dealTicket, DEAL_ENTRY);
        if (dealEntry != DEAL_ENTRY_OUT) continue;  // สนใจแค่ exit deals
        long magicNumber = HistoryDealGetInteger(dealTicket, DEAL_MAGIC);
        //if (magicNumber != 123456) continue;  // ข้ามดีลที่ไม่ใช่ Magic Number 123456
        
        double dealProfit = HistoryDealGetDouble(dealTicket, DEAL_PROFIT);
        long positionId = HistoryDealGetInteger(dealTicket, DEAL_POSITION_ID);
        
        // เช็คว่าเคยเจอ position นี้หรือยัง
        bool found = false;
        for (int j = 0; j < positionCount; j++)
        {
            if (positionMap[j] == positionId)
            {
                found = true;
                break;
            }
        }
        if (found) continue;  // ข้าม position ที่เคยเจอแล้ว
        
        // เพิ่ม position ID ใหม่
        ArrayResize(positionMap, positionCount + 1);
        positionMap[positionCount++] = positionId;
        
        string dealSymbol = HistoryDealGetString(dealTicket, DEAL_SYMBOL);
        double dealVolume = HistoryDealGetDouble(dealTicket, DEAL_VOLUME);
        double dealPrice = HistoryDealGetDouble(dealTicket, DEAL_PRICE);
        datetime dealTime = (datetime)HistoryDealGetInteger(dealTicket, DEAL_TIME);
        
        if (!firstDeal) json += ",";
        json += StringFormat(
            "{\"dealTicket\":%I64d,\"symbol\":\"%s\",\"volume\":%.2f,\"price\":%.2f,\"profit\":%.2f,\"time\":%I64d}",
            dealTicket, dealSymbol, dealVolume, dealPrice, dealProfit, dealTime
        );
        firstDeal = false;
    }
    
    json += "]}";
    Print("Generated JSON: ", json);
    return json;
}







int OnInit()
{
    // เชื่อมต่อกับ Python Server
    if (!socket.connect(zmq_server_address))
    {
        Print("Failed to connect to server: ", GetLastError());
        return INIT_FAILED;
    }
    Print("Connected to ZeroMQ server: ", zmq_server_address);
    
    
    EventSetTimer(5);  
    if (StringLen(token) == 0)
    {
         Print("Error: Token is not provided!");
         return INIT_FAILED;
    }
   
    Print("Token provided: ", token);
   
    if (VerifyToken(token, "disconnect"))
    {
         Print("Token is valid!");
    }
    else
    {
         Print("Token is invalid!");
         return INIT_FAILED;
    }
    
    // --- ดึงโมเดลที่เลือกจาก Database ผ่าน Next.js API ---
    string model_name = GetSelectedModel();
    if (model_name == "")
    {
        Print("Failed to retrieve model from database! please choose model in website");
    }
    
    Print("Selected Model: ", model_name);
    string jsonData = GetTradeHistoryAsJSON();
    Print(jsonData);
    SendTradeHistory(jsonData);
    
    
    socket.connect("tcp://127.0.0.1:5555");
    Print("Connected to Python server...");
    return INIT_SUCCEEDED;
}

bool lastTradeAllowed = false;  // เก็บสถานะก่อนหน้า


void OnTimer() {
    bool tradeAllowed = TerminalInfoInteger(TERMINAL_TRADE_ALLOWED); // เช็คสถานะปัจจุบัน
    
    if (tradeAllowed != lastTradeAllowed) { // ถ้าสถานะเปลี่ยนแปลง ค่อยอัปเดต API
        if (tradeAllowed) {
            VerifyToken(token, "connect");
           Print("Automated Trading Enabled: Sent 'connect'");
        } else {
            VerifyToken(token, "disconnect");
          Print("Automated Trading Disabled: Sent 'disconnect'");
            
        }
        lastTradeAllowed = tradeAllowed; // อัปเดตสถานะล่าสุด
    }
}

void OnTick()
{
    static datetime lastBarTime = 0;
    datetime currentBarTime = iTime(Symbol(), PERIOD_H4, 0);

    // ส่งข้อมูลเมื่อเกิดแท่งเทียนใหม่
    if (currentBarTime != lastBarTime)
    {
        lastBarTime = currentBarTime;

        
        string message = "[";
        for (int i = 48; i >= 1; i--)
        {
            datetime time = iTime(Symbol(), PERIOD_H4, i);
            double open = iOpen(Symbol(), PERIOD_H4, i);
            double high = iHigh(Symbol(), PERIOD_H4, i);
            double low = iLow(Symbol(), PERIOD_H4, i);
            double close = iClose(Symbol(), PERIOD_H4, i);
            long volume = iVolume(Symbol(), PERIOD_H4, i);
            int spread = iSpread(Symbol(), PERIOD_H4, i);  // Spread ในหน่วย Points

            // เพิ่มข้อมูลลงใน JSON
            string candle = StringFormat("{ \"Datetime\": \"%s\", \"Open\": %.5f, \"High\": %.5f, \"Low\": %.5f, \"Close\": %.5f, \"Volume\": %d, \"Spread\": %d }",
                                         TimeToString(time, TIME_DATE | TIME_MINUTES), open, high, low, close, volume, spread);

            message += candle;
            if (i > 1) message += ",";  // เพิ่มเครื่องหมาย , เว้นแค่ตัวสุดท้าย
        }
        message += "]";  // ปิด JSON Array
        // ส่งข้อมูลไปยัง Python Server
        
        bool tradeAllowed = TerminalInfoInteger(TERMINAL_TRADE_ALLOWED);
        if (tradeAllowed) {
           ZmqMsg request(message);
           if (!socket.send(request))
           {
               Print("Failed to send data: ", GetLastError());
               return;
           }
           Print("OHLC data sent: ", message);
        

        // รับการตอบกลับจาก Python Server
       
        ZmqMsg reply;
         if (socket.recv(reply))
         {
             string replyMessage = reply.getData();  // ดึงข้อมูลข้อความตอบกลับ
             Print("Reply from server: ", replyMessage);
             
             int action = StringToInteger(replyMessage);  // แปลงข้อความเป็นตัวเลข
             MqlTradeRequest request;
             MqlTradeResult result;
             ZeroMemory(request);  // รีเซ็ตค่า request ก่อนใช้
             ZeroMemory(result);   // รีเซ็ตค่า result ก่อนใช้
             double deviation = 10;
             ulong magic = 123456;
         
             switch (action)
             {
                 case 0:
                     // คำสั่งซื้อ (Buy)
                     Print("Action: Buy");
                     request.action   = TRADE_ACTION_DEAL;
                     request.symbol   = Symbol();
                     request.volume   = 0.1;
                     request.price    = SymbolInfoDouble(Symbol(), SYMBOL_ASK);
                     request.type     = ORDER_TYPE_BUY;
                     request.deviation = deviation;
                     request.magic    = magic;
                     request.comment  = "Buy Order";
                     
                     if (!OrderSend(request, result)) {
                         Print("Error opening buy order: ", result.comment);
                     } else {
                         Print("Buy order opened successfully. Ticket: ", result.order);
                     }
                     break;
         
                 case 1:
                     // คำสั่งขาย (Sell)
                     Print("Action: Sell");
                     request.action   = TRADE_ACTION_DEAL;
                     request.symbol   = Symbol();
                     request.volume   = 0.1;
                     request.price    = SymbolInfoDouble(Symbol(), SYMBOL_BID);
                     request.type     = ORDER_TYPE_SELL;
                     request.deviation = deviation;
                     request.magic    = magic;
                     request.comment  = "Sell Order";
                     
                     if (!OrderSend(request, result)) {
                         Print("Error opening sell order: ", result.comment);
                     } else {
                         Print("Sell order opened successfully. Ticket: ", result.order);
                     }
                     break;
         
               case 2:
                      Print("Action: Close All Buy");
                      for (int i = PositionsTotal() - 1; i >= 0; i--) {
                          if (m_position.SelectByIndex(i)) {
                              if (m_position.PositionType() == POSITION_TYPE_BUY) {
                                  ulong ticket = m_position.Ticket();
                                  Print("Closing Buy Position: ", ticket);
                                  
                                  // พยายามปิดครั้งแรก
                                  if (!m_trade.PositionClose(ticket)) {
                                      Print("First attempt failed (Buy): ", GetLastError());
                                      
                                      // หากปิดไม่สำเร็จ ลองใช้ OrderSend() แทน
                                      MqlTradeRequest request;
                                      MqlTradeResult result;
                                      ZeroMemory(request);
                                      ZeroMemory(result);
                  
                                      request.action = TRADE_ACTION_DEAL;
                                      request.symbol = Symbol();
                                      request.volume = m_position.Volume();
                                      request.type = ORDER_TYPE_SELL;  // ปิด Buy ต้อง Sell กลับ
                                      request.price = SymbolInfoDouble(Symbol(), SYMBOL_BID);
                                      request.deviation = 20;  // เพิ่มความยืดหยุ่น
                                      request.position = ticket;
                                      request.magic = 123456;
                                      request.comment = "Retry Close Buy";
                  
                                      if (OrderSend(request, result)) {
                                          Print("Successfully closed Buy position with retry. Ticket: ", result.order);
                                      } else {
                                          Print("Failed to close Buy position after retry: ", result.comment);
                                      }
                                  } else {
                                      Print("Buy position closed successfully.");
                                  }
                              }
                          }
                      }
                      break;
                  
                  case 3:
                      Print("Action: Close All Sell");
                      for (int i = PositionsTotal() - 1; i >= 0; i--) {
                          if (m_position.SelectByIndex(i)) {
                              if (m_position.PositionType() == POSITION_TYPE_SELL) {
                                  ulong ticket = m_position.Ticket();
                                  Print("Closing Sell Position: ", ticket);
                                  
                                  // พยายามปิดครั้งแรก
                                  if (!m_trade.PositionClose(ticket)) {
                                      Print("First attempt failed (Sell): ", GetLastError());
                                      
                                      // หากปิดไม่สำเร็จ ลองใช้ OrderSend() แทน
                                      MqlTradeRequest request;
                                      MqlTradeResult result;
                                      ZeroMemory(request);
                                      ZeroMemory(result);
                  
                                      request.action = TRADE_ACTION_DEAL;
                                      request.symbol = Symbol();
                                      request.volume = m_position.Volume();
                                      request.type = ORDER_TYPE_BUY;  // ปิด Sell ต้อง Buy กลับ
                                      request.price = SymbolInfoDouble(Symbol(), SYMBOL_ASK);
                                      request.deviation = 20;  // เพิ่มความยืดหยุ่น
                                      request.position = ticket;
                                      request.magic = 123456;
                                      request.comment = "Retry Close Sell";
                  
                                      if (OrderSend(request, result)) {
                                          Print("Successfully closed Sell position with retry. Ticket: ", result.order);
                                      } else {
                                          Print("Failed to close Sell position after retry: ", result.comment);
                                      }
                                  } else {
                                      Print("Sell position closed successfully.");
                                  }
                              }
                          }
                      }
                      break;

         
                 case 4:
                     // ถือ (Hold)
                     Print("Action: Hold");
                     break;
         
                 default:
                     Print("Invalid action");
                     break;
             }
         }
         else
         {
             Print("Failed to receive reply: ", GetLastError());
         }
         }
    }
}



void OnDeinit(const int reason)
{
    VerifyToken(token, "disconnect");  // ส่งคำสั่ง disconnect เมื่อโปรแกรมปิด
    Print("Sent 'disconnect' to API.");
    socket.disconnect("close");  // ปิดการเชื่อมต่อ ZeroMQ
    Print("Disconnected from ZeroMQ server.");
}



