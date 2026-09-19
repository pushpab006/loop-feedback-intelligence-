require("dotenv").config();

const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_TOKEN);

async function askLoop(question, feedbackContext) {
    const response = await client.chatCompletion({
        model: "openai/gpt-oss-120b:fastest",
        messages: [
            {
                role: "user",
                content: `
You are LOOP, a customer feedback intelligence assistant.

Answer the user's question using ONLY the customer feedback provided below.

Customer feedback:
${feedbackContext}

User question:
${question}

Give a clear and useful answer.
If the feedback does not contain enough information, say:
"Not enough information in the available feedback."
`
            }
        ],
        max_tokens: 500
    });

    return response.choices[0].message.content;
}

module.exports = askLoop;