require("dotenv").config();

const { InferenceClient } = require("@huggingface/inference");

const client = new InferenceClient(process.env.HF_TOKEN);

async function analyzeFeedback(feedbackText) {
    console.log("AI ANALYSIS STARTED");

    const response = await client.chatCompletion({
        model: "openai/gpt-oss-120b:fastest",

        messages: [
            {
                role: "system",
                content:
                    "You are a customer feedback classifier. Return only the requested JSON object."
            },
            {
                role: "user",
                content: `
Analyze this customer feedback for the LOOP project.

Feedback:
${feedbackText}

Return ONLY valid JSON.

Use exactly these fields:

{
  "sentiment": "POSITIVE",
  "score": 8,
  "theme": "Performance",
  "featureArea": "Mobile App"
}

Rules:
- sentiment must be POSITIVE, NEGATIVE, or NEUTRAL
- score must be a number from 1 to 10
- theme must be a short category
- featureArea must identify the product area
- Do not use markdown
- Do not add explanations
`
            }
        ],

        max_tokens: 500
    });

    console.log("AI RESPONSE RECEIVED");

    const message = response?.choices?.[0]?.message;

    console.log("AI MESSAGE:", message);

    let text = message?.content;

    // gpt-oss can place reasoning in reasoning_content.
    // Prefer the final content when available.
    if (!text && message?.reasoning_content) {
        text = message.reasoning_content;
    }

    if (!text) {
        console.error(
            "AI RESPONSE DID NOT CONTAIN CONTENT:",
            JSON.stringify(response, null, 2)
        );

        throw new Error(
            "AI did not return any usable response"
        );
    }

    console.log("RAW AI RESPONSE:", text);

    text = String(text)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");

    if (start === -1 || end === -1) {
        console.error(
            "AI RESPONSE WITHOUT JSON:",
            text
        );

        throw new Error(
            "AI did not return valid JSON"
        );
    }

    text = text.substring(start, end + 1);

    try {

        const result = JSON.parse(text);

        console.log(
            "PARSED AI RESULT:",
            result
        );

        return result;

    } catch (error) {

        console.error(
            "AI JSON PARSE ERROR:",
            text
        );

        throw new Error(
            "AI returned invalid JSON"
        );
    }
}

module.exports = analyzeFeedback;