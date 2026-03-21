"use client";
import { useEffect, useState } from "react";
import CaseCard from "../components/discover/CaseCard";
import { Documents } from "../types/documents";
import { fetchDocumentsFromSupabase } from "../services/documentsService";

export default function DiscoverView() {
  const [cases, setCases] = useState<Documents[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchDocumentsFromSupabase();
      setCases(data);
    }
    load();
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
