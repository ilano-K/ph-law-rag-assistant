"use_client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: (props) => (
          <p className="mb-4 leading-relaxed last:mb-0" {...props} />
        ),
        ul: (props) => (
          <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />
        ),
        ol: (props) => (
          <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />
        ),
        li: (props) => <li className="pl-1" {...props} />,
        h1: (props) => (
          <h1 className="text-2xl font-bold mb-4 mt-6" {...props} />
        ),
        h2: (props) => (
          <h2
            className="text-xl font-bold mb-3 mt-5 text-cyan-400"
            {...props}
          />
        ),
        h3: (props) => (
          <h3 className="text-lg font-bold mb-2 mt-4" {...props} />
        ),
        strong: (props) => (
          <strong className="font-semibold text-white" {...props} />
        ),
        pre: (props) => (
          <pre
            className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-4 overflow-x-auto"
            {...props}
          />
        ),
        code: (props) => (
          <code className="text-cyan-400 font-mono text-sm" {...props} />
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
