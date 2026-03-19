"use client";
import { useEffect, useState } from "react";
import { supabase } from "../helpers/supabase.";
import CaseCard from "../components/discover/CaseCard";

export default function DiscoverView() {
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCasesFromSupabase() {
      // THE MAGIC QUERY: Get documents, and also grab their matching child digest rows!
      const { data, error } = await supabase
        .from("documents")
        .select("*, case_digests(*)")
        .eq("type", "case"); // Only fetch things marked as 'case'

      if (error) {
        console.error("Supabase error:", error);
      } else if (data) {
        setCases(data);
      }
    }

    fetchCasesFromSupabase();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] p-10">
      <h1 className="text-3xl font-bold text-white mb-8">
        Supabase Legal Explorer
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            document={caseItem} // Pass the parent 'documents' row
            digest={caseItem.case_digests[0]} // Pass the linked 'case_digests' row
          />
        ))}
      </div>
    </div>
  );
}
