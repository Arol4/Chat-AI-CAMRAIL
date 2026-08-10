import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function ReasoningViewer({ content }) {
  return (
    <div className="reasoning-container">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {normalizeReasoning(content)}
      </ReactMarkdown>
    </div>
  );
}

function normalizeReasoning(text) {
  if (!text) return "";

  return text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^[ \t]+\*\s+/gm, "* ")
    .trim();
}