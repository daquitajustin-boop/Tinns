import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const answers = [];

app.use(express.json());
app.use(express.static("public"));

// Gmail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

app.post("/submit", async (req, res) => {
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ error: "Question and answer required" });
  }

  answers.push({ question, answer, date: new Date() });

  try {
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

app.get("/answers", (req, res) => res.json(answers));

// ES module imports
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Required for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

 app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// API route
 answers = [{ id: 1, text: "Answer 1" }];
app.get("/answers", (req, res) => res.json(answers));

// Serve index.html for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
