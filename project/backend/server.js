import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

// ✅ ต้องโหลด dotenv ก่อนใช้ process.env
dotenv.config();

const app = express();
const PORT = 3000;

// ✅ ตรวจสอบ env
if (!process.env.AGENT_PROJECT_URL || !process.env.AGENT_ID) {
  console.error("❌ Missing AGENT_PROJECT_URL or AGENT_ID in .env");
  process.exit(1);
}
console.log("🔎 AGENT_PROJECT_URL =", process.env.AGENT_PROJECT_URL);
console.log("🔎 AGENT_ID =", process.env.AGENT_ID);

// ✅ Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const homePath = path.resolve(__dirname, "../client/home");
const loginPath = path.resolve(__dirname, "../client/loginpage");
const assetsPath = path.resolve(__dirname, "../client/assets");

console.log("💡 homePath =", homePath);

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use("/assets", express.static(assetsPath));
app.use("/loginpage", express.static(loginPath));
app.use(express.static(homePath));

// ✅ Route: login page
app.get("/loginpage/login.html", (req, res) => {
  res.sendFile(path.join(loginPath, "login.html"));
});

// ✅ Agent API route
const client = new AIProjectClient(
  process.env.AGENT_PROJECT_URL,
  new DefaultAzureCredential()
);

app.post("/api/ask", async (req, res) => {
  const userInput = req.body.message;
  if (!userInput) return res.status(400).json({ reply: "❌ ไม่มีข้อความ" });

  try {
    const thread = await client.agents.threads.create();
    await client.agents.messages.create(thread.id, "user", userInput);
    let run = await client.agents.runs.create(thread.id, process.env.AGENT_ID);

    while (run.status === "queued" || run.status === "in_progress") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      run = await client.agents.runs.get(thread.id, run.id);
    }

    const messages = await client.agents.messages.list(thread.id, { order: "asc" });
    for await (const m of messages) {
      const content = m.content.find((c) => c.type === "text" && "text" in c);
      if (content) return res.json({ reply: content.text.value });
    }

    res.status(500).json({ reply: "⚠️ ไม่มีข้อความตอบกลับจาก Agent" });
  } catch (err) {
    console.error("❌ Agent error:", err);
    res.status(500).json({ reply: "❌ เกิดข้อผิดพลาดจาก Agent" });
  }
});

// ✅ Fallback route: สำหรับ SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(homePath, "index.html"));
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Server ready at http://localhost:${PORT}`);
});
