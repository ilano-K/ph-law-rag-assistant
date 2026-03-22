"use client";
import { useEffect, useState } from "react";
import CaseCard from "./CaseCard";
import { Document, Filter } from "../../types/documents";
import {
  fetchActs,
  fetchCases,
  fetchRepublicActs,
} from "../../services/documentsService";
import CaseToggle from "./DocumentToggleButton";

const fetchMap: Record<Filter, () => Promise<Document[]>> = {
  Cases: fetchCases,
  Acts: fetchActs,
  "Republic Acts": fetchRepublicActs,
};

const FILTERS: Filter[] = ["Cases", "Republic Acts", "Acts"];

export default function DiscoverView() {
  const [docs, setDocs] = useState<Document[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>("Cases");

  useEffect(() => {
    async function load() {
      const data: Document[] = await fetchCases();
      setDocs(data);
    }
    load();
  }, []);

  async function handleDataChange(filter: Filter) {
    setActiveFilter(filter);
    const data = await fetchMap[filter]();
    setDocs(data);
  }
  return (
    <div className="min-h-screen bg-[#050505] p-8">
      {/* The new layout wrapper for the toggle */}
      <div className="w-full flex justify-center">
        <CaseToggle filters={FILTERS} onToggle={handleDataChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((docItem) => (
          <CaseCard key={docItem.id} document={docItem} filter={activeFilter} />
        ))}
      </div>
    </div>
  );
}
