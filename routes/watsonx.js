const axios = require('axios');
const express = require('express');
const router = express.Router();

require('dotenv').config();

const assistantId = process.env.WATSON_ASSISTANT_ID || '';
const apiKey = process.env.WATSON_API_KEY || '';
const auth = apiKey;

router.get('/session', async (req, res) => {
    try {
        const sessionRes = await axios.post(
            `https://api.us-south.assistant.watson.cloud.ibm.com/v2/assistants/${assistantId}/sessions?version=2025-04-14`,
            {},
            {
                headers: {
                    'Authorization': `Basic ${auth}`
                }
            }
        );

        const sessionId = sessionRes?.data?.session_id;
        if (!sessionId) {
            return res.status(500).json({ error: 'No session_id returned from Watson' });
        }

        console.log('[Watson] Session criada com sucesso:', sessionId);

        res.json({ sessionId });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
}
);

router.post('/message', async (req, res) => {
    const { sessionId, message } = req.body;

    if (typeof sessionId !== 'string' || typeof message !== 'string') {
        return res.status(400).json({ error: 'Session ID and message must be strings' });
    }

    try {
        const response = await axios.post(
            `https://api.us-south.assistant.watson.cloud.ibm.com/v2/assistants/${assistantId}/sessions/${sessionId}/message?version=2025-04-14`,
            {
                input: { text: message, message_type: 'text' },
                context: {
                    global: {
                        system: {
                            user_id: 'user-id-123',
                        }
                    },
                    skills: {
                        'main skill': {
                            user_defined: {
                                nome: 'Teste',
                            }
                        }
                    }
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${auth}`
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
}
);

module.exports = router;