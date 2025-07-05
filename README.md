# XO_GAME (React)

ระบบเกม XO ที่พัฒนาด้วย React + Vite สำหรับ Frontend และ Node.js (Express) สำหรับ Backend โดยเชื่อมต่อกับฐานข้อมูล MySQL ผ่าน XAMPP รองรับฟีเจอร์หลักดังนี้:

🧠 เล่นกับบอทอัตโนมัติ (AI) บอทสามารถบล็อกและพยายามชนะผู้เล่น
🔢 กำหนดขนาดตารางได้เอง ตั้งแต่ 3x3 ถึง 11x11
    - โดยมีกติกาการชนะคือ แนวนอน แนวตั้ง แนวทแยง ตามตารางต่อไปนี้
        ตาราง 3x3 : เรียงติดกัน 3 ตัว
        ตาราง 4x4 : เรียงติดกัน 4 ตัว
        ตาราง 5x5 : เรียงติดกัน 4 ตัว
        ตาราง 6x6 ถึง 11x11 : เรียงติดกัน 5 ตัว
    - เลือกสุ่มตำแหน่งที่ยังว่าง
💾 บันทึกประวัติการเล่น ลงฐานข้อมูลอัตโนมัติ
⏪ ดู Replay เกมย้อนหลัง ได้แบบ step-by-step

# 1.Check Winner (Victory Detection)  
ใช้การวนลูปทุกตำแหน่งในกระดาน และตรวจสอบ 4 ทิศทาง:
- แนวนอน (→)
- แนวตั้ง (↓)
- แนวทแยงซ้าย-ขวา (↘)
- แนวทแยงขวา-ซ้าย (↙)

# 2.วิธีการ Setup และ Run
- ติดตั้ง Dependencies โดยใช้คำสั่ง
    npm install
- เริ่มต้น Frontend โดยใช้คำสั่ง
    npm run dev
- คลิกเปิดในเบราว์เซอร์ที่ `http://localhost:3000`

# 3. วิธีการติดตั้งระบบ ส่วน Back-end

- ติดตั้ง XAMPP Control Panel   
    https://www.apachefriends.org/download.html
- สร้างฐานข้อมูลโดย
    CREATE DATABASE tic_tac_toe_base CHARACTER SET utf8       
    COLLATE utf8_general_ci;

    CREATE TABLE `game_round` (
    `id` int(11) NOT NULL,
    `timeround` datetime DEFAULT current_timestamp()
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 
    COLLATE=utf8_general_ci;

    CREATE TABLE `history_game` (
    `id` int(11) NOT NULL,
    `idgameround` int(11) DEFAULT NULL,
    `timehistory` datetime DEFAULT current_timestamp(),
    `position` varchar(999) DEFAULT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 
    COLLATE=utf8_general_ci;

    
# Technologies Used

- Frontend: React.js + Vite
- Backend: Node.js + Express
- Database: XAMPP (SQL)
- UI: CSS (custom)

