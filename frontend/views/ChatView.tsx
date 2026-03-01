import { ArrowUp } from "lucide-react";

export default function ChatView() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* label with gradient text */}
      <div
        className="mb-10 text-3xl font-legal text-center
                   text-gradient-accent font-bold"
      >
        What law would you like to explore today?
      </div>

      {/* type bar with gradient + blur */}
      <div
        className="flex w-4xl rounded-full py-2 px-4
                   bg-gradient-accent-blur mb-40"
      >
        <input
          type="text"
          className="flex-1 ml-4 outline-none bg-transparent text-foreground placeholder-foreground/70"
          placeholder="Type a law, e.g., RA 7610..."
        />
        <button className="flex justify-center items-center bg-foreground/30 rounded-full w-10 h-10 ml-2">
          <ArrowUp size={24} className="text-background" />
        </button>
      </div>
    </div>
  );
}
