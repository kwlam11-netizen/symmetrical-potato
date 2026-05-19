import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { GoogleGenAI } from '@google/generative-ai';

const app = express();
app.use(cors());
app.use(express.json());

// Set up the AI client securely
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    // Convert the conversation history into the format the AI expects
    const contents = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    // Add the newest message from your iPhone to the conversation
    contents.push({ role: 'user', parts: [{ text: message }] });

    // Request a response from the AI model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: "You are a helpful, brilliant, and articulate AI assistant named MyClaude. Give concise, insightful answers."
      }
    });

    // Send the response text back to your iPhone app interface
    res.json({ reply: response.text });
  } catch (error) {
    console.error('Server error encountered:', error);
    res.status(500).json({ error: 'Failed to process AI response' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running perfectly on port ${PORT}`));
