"use client";
import { createClient } from "@/src/lib/supabase/client";
import { getAllChats } from "@/src/services/refactoring/chatService";
import { useQuery } from "@tanstack/react-query";
import ChatHistoryCard from "./ChatHistoryCard";

// 1. Import the router specifically for the App Router
import { useRouter } from "next/navigation";

export default function HistoryView() {
  const supabase = createClient();

  // 2. Initialize the router
  const router = useRouter();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["conversation-history", user?.id],
    queryFn: () => getAllChats({ userId: user!.id, supabase }),
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="text-white/50 animate-pulse text-center mt-10">
        Loading history...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full p-8 overflow-y-auto hide-scrollbar bg-[#050505]">
      {/* Changed from grid to flex-col */}
      <div className="flex flex-col gap-4">
        {data?.data.map((conversationItem) => (
          <ChatHistoryCard
            key={conversationItem.id}
            title={conversationItem.title}
            firstMessage={conversationItem.first_message ?? ""}
            date={conversationItem.created_at}
            onNavigate={() => router.push(`/chat/${conversationItem.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
