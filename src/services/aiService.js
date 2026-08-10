import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const client = new GoogleGenAI({ apiKey });

export async function* streamReasoningAndAnswer(prompt) {
    const stream = await client.interactions.create({
        model: "gemma-4-31b-it",
        input: prompt,
        generation_config: { thinking_summaries: "auto" },
        tools: [
            {
                type: "google_search"
            }
        ],
        stream: true,
    });

    let thoughts = "";
    let answer = "";
    const sources = new Map();

    for await (const event of stream) {

        if (event.event_type !== "step.delta") {
            continue;
        }

        const delta = event.delta;

        if (delta.type === "thought_summary") {

            const text = delta.content?.text || "";

            thoughts += text;

            yield {
                type: "thought",
                content: text,
                full: thoughts
            };
        }

        else if (delta.type === "text" && delta.text) {

            answer += delta.text;

            yield {
                type: "answer",
                content: delta.text,
                full: answer
            };
        }

        else if (delta.type === "text_annotation_delta") {

            for (const annotation of delta.annotations || []) {

                if (annotation.type !== "url_citation") {
                    continue;
                }

                if (!sources.has(annotation.url)) {
                    sources.set(annotation.url, {
                        title: annotation.title || "Source",
                        uri: annotation.url
                    });
                }
            }
        }
    }

    if (sources.size > 0) {
        yield {
            type: "sources",
            sources: [...sources.values()]
        };
    }
}