import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

// ✅ โหลด environment variables จาก .env
dotenv.config();

// ✅ ตรวจสอบว่าค่าจำเป็นมีครบ
if (!process.env.AGENT_PROJECT_URL || !process.env.AGENT_ID) {
  console.error("❌ Missing AGENT_PROJECT_URL or AGENT_ID in .env");
  process.exit(1);
}

// ✅ แสดงค่าใน console เพื่อเช็ค
console.log("🔎 AGENT_PROJECT_URL =", process.env.AGENT_PROJECT_URL);
console.log("🔎 AGENT_ID =", process.env.AGENT_ID);

// ✅ สร้าง express app
const app = express();
const PORT = 3000;

// ✅ ตั้งค่า path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const homePath = path.resolve(__dirname, "../../client/home");
const loginPath = path.resolve(__dirname, "../../client/loginpage");
const assetsPath = path.resolve(__dirname, "../../client/assets");

console.log("💡 Static HTML path =", homePath);

// ✅ Middleware
app.use(cors());
app.use(express.json()); // รองรับ JSON body

// ✅ Static Files
app.use("/assets", express.static(assetsPath));
app.use("/loginpage", express.static(loginPath));
app.use("/", express.static(homePath)); // หน้า index.html

// ✅ Route สำหรับ login page (เช่น /loginpage/login.html)
app.get("/loginpage/login.html", (req, res) => {
  res.sendFile(path.join(loginPath, "login.html"));
});

// ✅ เชื่อมต่อ Azure Agent Foundry
const client = new AIProjectClient(
  process.env.AGENT_PROJECT_URL,
  new DefaultAzureCredential()
);

// ✅ API รับข้อความจาก chatbot
app.post("/api/ask", async (req, res) => {
  const userInput = req.body.message;
  if (!userInput) return res.status(400).json({ reply: "❌ ไม่มีข้อความ" });

  console.log("📨 ได้รับข้อความจากผู้ใช้:", userInput);

  try {
    // 1. สร้าง thread
    const thread = await client.agents.threads.create();

    // 2. เพิ่มข้อความของ user
    await client.agents.messages.create(thread.id, "user", userInput);

    // 3. เรียกใช้ Agent ให้ตอบกลับ
    let run = await client.agents.runs.create(thread.id, process.env.AGENT_ID);

    // 4. รอให้ Agent ทำงานเสร็จ
    while (run.status === "queued" || run.status === "in_progress") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      run = await client.agents.runs.get(thread.id, run.id);
    }

    // 5. ดึงข้อความที่ตอบกลับ
    const messages = await client.agents.messages.list(thread.id, { order: "asc" });
    for await (const m of messages) {
      const content = m.content.find(c => c.type === "text" && "text" in c);
      if (content) {
        console.log("✅ Agent ตอบกลับ:", content.text.value);
        return res.json({ reply: content.text.value });
      }
    }

    res.status(500).json({ reply: "⚠️ ไม่มีข้อความตอบกลับจาก Agent" });

  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดจาก Agent:", err.message || err);
    res.status(500).json({ reply: "❌ เกิดข้อผิดพลาดจาก Agent" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server ready at http://localhost:${PORT}`);
});
