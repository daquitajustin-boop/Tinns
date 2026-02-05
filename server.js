import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Example answers array (in-memory, resets per serverless invocation)
let answers = [{ id: 1, text: "Answer 1" }];

// POST /submit → send email
app.post("/submit", async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer required" });
  }

  answers.push({ question, answer, date: new Date() });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `"Test Server" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: "New Answer Submitted",
      text: `Question: ${question}\nAnswer: ${answer}`
    });

    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email", details: err.message });
  }
});

// GET /answers → returns JSON
app.get("/answers", (req, res) => {
  res.json(answers);
});

// Export Express app for Vercel serverless
export default app;
