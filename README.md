# Prototype Alat Monitoring Detak Jantung dan Suhu Tubuh Berbasis IoT

## 📌 Deskripsi Proyek
Proyek ini merupakan sebuah **prototype sistem monitoring kesehatan berbasis Internet of Things (IoT)** yang digunakan untuk memantau **detak jantung (Heart Rate)** dan **suhu tubuh (Body Temperature)** manusia secara **realtime**.

Data hasil pembacaan sensor dikirim oleh perangkat IoT ke **Firebase Realtime Database**, kemudian ditampilkan pada **dashboard web** yang responsif (desktop & mobile).

Proyek ini dibuat sebagai **media pendukung tugas akhir / sidang skripsi** untuk menampilkan hasil monitoring secara visual dan mudah dipahami.

---

## 🧠 Arsitektur Sistem
1. **Sensor**
   - Pulse Sensor (Detak Jantung)
   - DS18B20 (Suhu Tubuh)

2. **Perangkat IoT**
   - ESP8266
   - Mengirim data ke Firebase Realtime Database

3. **Backend**
   - Firebase Realtime Database

4. **Frontend**
   - React + Vite
   - Tailwind CSS
   - Recharts (Grafik realtime)

5. **Deployment**
   - Vercel

---

## 📊 Fitur Dashboard
- Menampilkan **detak jantung (BPM)** secara realtime
- Menampilkan **suhu tubuh (°C)** secara realtime
- Grafik realtime BPM dan suhu tubuh
- Indikator status:
  - Detak jantung: Normal / Tidak Normal
  - Suhu tubuh: Normal / Tidak Normal
- Tampilan **responsif (mobile & desktop)**

---

## ⚙️ Instalasi & Menjalankan Project

### 1️⃣ Clone / Download Project
Pastikan **Node.js** sudah terinstall.

### 2️⃣ Install Dependency
Buka terminal di folder project, lalu jalankan:
```bash
npm install
npm run dev