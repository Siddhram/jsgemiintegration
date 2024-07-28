const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const fs=require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

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

async function run2(val, imageUrl) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = val;

        // Fetch the image from the URL provided by the user
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const image = {
            inlineData: {
                data: Buffer.from(response.data).toString("base64"),
                mimeType: response.headers['content-type'],
            },
        };

        const result = await model.generateContent([prompt, image]);
        console.log(result.response.text());
        return result.response.text();
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

app.post('/image', async (req, res) => {
    try {
        const { prompt,imageUrl } = req.body;
        const responseText = await run2(prompt,imageUrl);
        res.status(200).json({ response: responseText });
    } catch (error) {
        res.status(500).json({ error: 'Error generating content' });
    }
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

