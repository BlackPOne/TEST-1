# THE NAME — GitHub Pages & Codex

ชุดซอร์สสำหรับ GitHub Pages ปรับปรุงจากเวอร์ชัน 3a92beed0069
มีหน้า Home, Insight, Ikigai, Wellness และ Contact & Shop ทั้งไทยและอังกฤษ
ใช้ HTML, CSS และ JavaScript พร้อมรูป ฟอนต์ เสียง และโมเดล 3D ภายใน assets

## นำขึ้น GitHub Pages

1. แตก ZIP แล้วนำไฟล์และโฟลเดอร์ทั้งหมดใน ZIP ไปไว้ที่ root ของ repository
   ตรวจว่า index.html, assets/, en/ และ .nojekyll อยู่ระดับเดียวกัน
2. ไปที่ Settings → Pages → Deploy from a branch แล้วเลือก main และ /(root)
3. เปิด URL จากหน้า Pages หลัง deploy เสร็จ

การนำไฟล์ขึ้น repository หรือ Pages แบบสาธารณะจะเปิดให้คนอื่นเข้าถึงไฟล์รูปและเสียงในชุดนี้ได้

## เปิดใน ChatGPT Coding / Codex

แตก ZIP และเปิดโฟลเดอร์ที่มี index.html เป็นโปรเจกต์ หรือเชื่อม GitHub repository ที่อัปโหลดชุดนี้
ใช้ข้อความใน CODEX-HANDOFF.md เป็นคำสั่งเริ่มงาน

## ทดสอบในเครื่อง

รัน `python3 -m http.server 8000` จากโฟลเดอร์ที่มี index.html
เปิด http://localhost:8000/ สำหรับภาษาไทย และ http://localhost:8000/en/ สำหรับภาษาอังกฤษ
ให้ทดสอบผ่าน HTTP เพื่อให้เบราว์เซอร์โหลดไฟล์เสียงและโมเดลได้ตามปกติ

แก้ลิงก์ LINE, Instagram และ YouTube ใน assets/config.js

## โครงสร้างไฟล์ฉบับ GitHub Pages

CSS และ JavaScript ที่ใช้ในแต่ละหน้ารวมอยู่ในไฟล์ตามชื่อหน้าใน assets/ โดยมีคอมเมนต์ระบุชื่อไฟล์ต้นทาง ลำดับกฎ CSS และลำดับสคริปต์ของแต่ละหน้ายังคงเดิม ส่วนโมดูล 3D และ assets/config.js แยกเป็นไฟล์ของตัวเอง
