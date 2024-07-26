const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const key = 'AIzaSyCNaSTJ_maibZ7hKW_RzbVnB2rpe0JjrYg'; // Better to use an environment variable
const genAI = new GoogleGenerativeAI(key);

async function run(val) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = val.toString();
        const result = await model.generateContent(prompt);
        const response = result.response;
        return response.text();
    } catch (error) {
        console.error('Error generating content:', error);
        throw error;
    }
}

app.post('/gemini', async (req, res) => {
    try {
        const { prompt } = req.body;
        const responseText = await run(prompt);
        res.status(200).json({ response: responseText });
    } catch (error) {
        res.status(500).json({ error: 'Error generating content' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
