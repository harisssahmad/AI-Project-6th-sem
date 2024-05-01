const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

const Groq = require("groq-sdk");
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.use(express.json());

app.post("/api/single-code-plag-check", async (req, res) => {
  const { task, code } = req.body;

  const chatCompletion = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that evaluates code samples and detects plagiarism. Give answer as a JSON object",
      },
      {
        role: "user",
        content: `You've been presented with a code sample (Code) that aims to solve a specific problem, which is to ${task}. My task is to thoroughly evaluate the code and provide feedback on the following aspects:

              1. **Code Understanding**: Can the code correctly solve the problem as stated?
              2. **Code Quality**: Is the code well-structured, readable, and maintainable?
              3. **Originality**: Does the code demonstrate unique and original thinking, or does it show signs of plagiarism?
              4. **Task Achievement**: Does the code successfully achieve the desired outcome?
              
              You will score the code sample out of 5 points for each aspect, providing feedback on its strengths and weaknesses. Additionally, You will investigate potential plagiarism by comparing the code sample against known sources, checking for similarities in syntax, structure, and functionality.
              
              **Code**:
              
              ${code}
              
              Give response in the form:
              {
                "code": {
                  "code_understanding": number,
                  "code_quality": number,
                  "originality": number,
                  "task_achievement": number,
                  "feedback": small feedback
                },
                "plagiarism": {
                  small comment
                }
              }`,
      },
    ],
  });

  const jsonResponse = JSON.parse(chatCompletion.choices[0]?.message?.content);

  res.send(chatCompletion.choices[0]?.message?.content);
});

app.post("/api/two-code-plag-check", async (req, res) => {
  const { task, codeA, codeB } = req.body;

  const chatCompletion = await groq.chat.completions.create({
    model: "mixtral-8x7b-32768",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that evaluates code samples and detects plagiarism. Give answer as a JSON object",
      },
      {
        role: "user",
        content: `You've been presented with two code samples (Code A and Code B) that aim to solve the same problem, which is to ${task}. My task is to thoroughly evaluate both codes and provide feedback on the following aspects:

                1. **Code Understanding**: Can the code correctly solve the problem as stated?
                2. **Code Quality**: Is the code well-structured, readable, and maintainable?
                3. **Originality**: Does the code demonstrate unique and original thinking, or does it show signs of plagiarism?
                4. **Task Achievement**: Does the code successfully achieve the desired outcome?
                
                You will score each code sample out of 5 points for each aspect, providing feedback on the strengths and weaknesses of each code. Additionally, You will investigate potential plagiarism by comparing the two code samples, checking for similarities in syntax, structure, and functionality.
                
                **Code A**:
                
                ${codeA}
                
                **Code B**:
                
                ${codeB}
                
                Give response in the form:
                {
                  "code_a": {
                    "code_understanding": number,
                    "code_quality": number,
                    "originality": number,
                    "task_achievement": number,
                    "feedback": small feedback
                  },
                  "code_b": {
                    "code_understanding": number,
                    "code_quality": number,
                    "originality": number,
                    "task_achievement": number,
                    "feedback": small feedback
                  },
                  "plagiarism": {
                    small comment
                  }
                }`,
      },
    ],
  });

  const jsonResponse = JSON.parse(chatCompletion.choices[0]?.message?.content);

  res.send(chatCompletion.choices[0]?.message?.content);
});

app.post("/", (req, res) => {
  console.log(req.body);
  res.json({ success: true });
});

app.listen(port, () => console.log(`app listening at http://localhost:3000`));
