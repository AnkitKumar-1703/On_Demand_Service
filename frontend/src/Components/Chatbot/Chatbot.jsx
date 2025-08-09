import './Chatbot.css';
import { useEffect, useState } from 'react';

import { GoogleGenerativeAI } from '@google/generative-ai';
const GEMINI_KEY = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
import myinfo from './myinfo';

const Chatbot = () => {
        const [question, setQuestion] = useState('');
        const [answer, setAnswer] = useState('');
        const [typingIntervalId, setTypingIntervalId] = useState(null);

        const genAI = new GoogleGenerativeAI(GEMINI_KEY);
        const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: myinfo.myinfo
        });
        const generationConfig = {
                temperature: 1,
                topP: 0.95,
                topK: 64,
                maxOutputTokens: 8192,
                responseMimeType: "text/plain",
        };        const run = async (userInput) => {
                if (question === '') return;
                const chatContainer = document.querySelector('.chatbotchats');
                const userMessage = document.createElement('div');
                userMessage.classList.add('message', 'user');
                userMessage.textContent = question;
                chatContainer.appendChild(userMessage);
                setQuestion('');

                const chatSession = model.startChat({
                        generationConfig,
                        history: [
                                {
                                        role: "user",
                                        parts: [
                                                { text: "tell me about aaditva" },
                                        ],
                                },
                                {
                                        role: "model",
                                        parts: [
                                                { text: "Hi there! I'm Aaditva Vijay Vats, a passionate B.Tech student specializing in Computer Science and Engineering with a focus on Artificial Intelligence. It's great to have you here! \n" },
                                        ],
                                },
                        ],
                });

                const result = await chatSession.sendMessage(userInput);
                setAnswer(result.response.text());
                typeEffect(result.response.text());
        };        const typeEffect = (text) => {
                const chatContainer = document.querySelector('.chatbotchats');
                const botMessage = document.createElement('div');
                botMessage.classList.add('message', 'bot');
                chatContainer.appendChild(botMessage);

                if (typingIntervalId) {
                        clearInterval(typingIntervalId);
                }

                let index = 0;
                const intervalId = setInterval(() => {
                        if (index < text.length) {
                                botMessage.innerHTML += text.charAt(index);
                                index++;
                        } else {
                                clearInterval(intervalId);
                        }
                }, 50);

                setTypingIntervalId(intervalId);
        };

        const generateResponse = () => {
                run(question);
        };

        return (
                <>
                        <div className="chatbot-box">
                                <div className="chatbotchats">
                                        <div className="message bot">
                                                Hi There! How may I help you?
                                        </div>
                                </div>
                                <div className="input-container">
                                        <input
                                                type="text"
                                                className="question"
                                                placeholder="Enter Your Question Here....."
                                                value={question}
                                                onChange={(e) => setQuestion(e.target.value)}
                                        />
                                        <button className="send" onClick={generateResponse}>Send</button>
                                </div>
                        </div>
                </>
        );
};

export default Chatbot;
