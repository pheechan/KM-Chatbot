const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

// ✅ โหลด .env จาก root
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// ✅ Log สำหรับตรวจสอบ ENV โหลดถูกไหม
console.log("✔️ Loaded endpoint:", process.env.AGENT_ENDPOINT);
console.log("🔐 Loaded key:", process.env.AGENT_KEY?.substring(0, 20) + "...");

app.post("/api/ask", async (req, res) => {
  const userMessage = req.body.message;
  console.log("🟦 User said:", userMessage);

  try {
    const response = await axios.post(process.env.AGENT_ENDPOINT, {
      inputs: {
        messages: [{ role: "user", content: userMessage }]
      }
    }, {
      headers: {
        Authorization: process.env.AGENT_KEY,
        "Content-Type": "application/json"
      }
    });

    const reply = response.data.outputs?.text || "⚠️ No response from Agent";
    console.log("🟩 Bot replied:", reply);
    res.json({ reply });

  } catch (error) {
    // ✅ แสดง error แบบละเอียด
    if (error.response) {
      console.error("❌ AXIOS ERROR:", error.response.status, error.response.statusText);
      console.error("❌ RESPONSE DATA:", error.response.data);
    } else {
      console.error("❌ ERROR:", error.message);
    }

    res.status(500).json({ reply: "❌ เกิดข้อผิดพลาดในการเชื่อมต่อ Agent" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
