import { GoogleGenAI } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const client = new GoogleGenAI({ apiKey });

const googleSearchTool = {
    type: "google_search"
};

export async function* streamReasoningAndAnswer(prompt) {
    const stream = await client.interactions.create({
        model: "gemini-2.5-flash",
        input: prompt,
        generation_config: { thinking_summaries: "auto" },
        tools: [googleSearchTool],
        stream: true,
    });

    let thoughts = "";
    let answer = "";
    let groundingMetadata = null;

    for await (const event of stream) {
        if (event.event_type === "step.delta") {
            if (event.delta.type === "thought_summary") {
                const text = event.delta.content?.text || "";
                thoughts += text;
                yield { type: "thought", content: text, full: thoughts };
            } 
            else if (event.delta.type === "text" && event.delta.text) {
                answer += event.delta.text;
                yield { type: "answer", content: event.delta.text, full: answer };
            }
        }
        // ✅ Récupération des métadonnées dans l'événement de fin
        else if (event.event_type === "interaction.completed") {
            console.log("Metadata at interaction.completed:", event.metadata);
            groundingMetadata = event.metadata?.grounding_metadata || null;
        }
    }

    if (groundingMetadata) {
        const sources = extractSources(groundingMetadata);
        yield { type: "sources", sources };
    }
}

function extractSources(metadata) {
    const sources = [];
    if (metadata.grounding_chunks) {
        for (const chunk of metadata.grounding_chunks) {
            if (chunk.web) {
                sources.push({
                    title: chunk.web.title || "Source",
                    uri: chunk.web.uri
                });
            }
        }
    }
    return sources;
}