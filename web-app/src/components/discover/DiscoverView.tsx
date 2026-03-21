"use client";
import { useEffect, useState } from "react";
import CaseCard from "./CaseCard";
import { Documents } from "../../types/documents";
import { fetchCases } from "../../services/documentsService";
import CaseToggle from "./DocumentToggleButton";

export default function DiscoverView() {
  const [cases, setCases] = useState<Documents[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchCases();
      setCases(data);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      {/* The new layout wrapper for the toggle */}
      <div className="w-full flex justify-center">
        <CaseToggle filters={["Cases", "Republic Acts", "Acts"]} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            document={caseItem}
            digest={caseItem.case_digests[0]}
          />
        ))}
      </div>
    </div>
  );
}
