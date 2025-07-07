from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from azure.ai.projects import AIProjectClient
from azure.identity import DefaultAzureCredential
from azure.ai.agents.models import ListSortOrder
import os
import time
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder="./client", static_url_path="/")
CORS(app)

endpoint = os.getenv("AGENT_PROJECT_URL")
agent_id = os.getenv("AGENT_ID")

client = AIProjectClient(credential=DefaultAzureCredential(), endpoint=endpoint)

@app.route("/api/ask", methods=["POST"])
def ask():
    data = request.get_json()
    user_input = data.get("message", "")
    if not user_input:
        return jsonify({"reply": "❌ ไม่มีข้อความ"}), 400

    try:
        thread = client.agents.threads.create()
        client.agents.messages.create(thread_id=thread.id, role="user", content=user_input)
        run = client.agents.runs.create_and_process(thread_id=thread.id, agent_id=agent_id)

        while run.status in ("queued", "in_progress"):
            time.sleep(1)
            run = client.agents.runs.get(thread_id=thread.id, run_id=run.id)

        messages = client.agents.messages.list(thread_id=thread.id, order=ListSortOrder.ASCENDING)

        for m in messages:
            if m.text_messages:
                return jsonify({"reply": m.text_messages[-1].text.value})

        return jsonify({"reply": "⚠️ ไม่มีข้อความตอบกลับ"}), 500
    except Exception as e:
        print("❌", e)
        return jsonify({"reply": "❌ เกิดข้อผิดพลาดจาก Agent"}), 500

# เสิร์ฟ HTML หน้าแรก
@app.route("/")
def index():
    return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(port=3000, debug=True)

@app.route("/loginpage/login.html")
def serve_login():
    return send_from_directory(os.path.join(app.static_folder, "../loginpage"), "login.html")
