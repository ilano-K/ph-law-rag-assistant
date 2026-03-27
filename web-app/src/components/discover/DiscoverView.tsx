"use client";
import { useState } from "react";
import CaseCard from "./CaseCard";
import { Document, Filter } from "../../types/documents";
import {
  fetchActs,
  fetchCases,
  fetchRepublicActs,
} from "../../services/documentsService";
import CaseToggle from "./DocumentToggleButton";
import { useQuery } from "@tanstack/react-query";

const fetchMap: Record<Filter, () => Promise<Document[]>> = {
  Cases: fetchCases,
  Acts: fetchActs,
  "Republic Acts": fetchRepublicActs,
};

const FILTERS: Filter[] = ["Cases", "Republic Acts", "Acts"];

export default function DiscoverView() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Cases");

  // THE TANSTACK MAGIC:
  const { data: docs = [], isLoading } = useQuery({
    queryKey: ["documents", activeFilter],
    queryFn: () => fetchMap[activeFilter](),
    staleTime: Infinity,
  });
  return (
    <div className="min-h-screen bg-[#050505] p-8">
      {/* The new layout wrapper for the toggle */}
      <div className="w-full flex justify-center">
        <CaseToggle filters={FILTERS} onToggle={setActiveFilter} />
      </div>

      {isLoading ? (
        <div className="text-white text-center mt-10 text-xl font-medium tracking-wide animate-pulse">
          Loading jurisprudence...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((docItem) => (
            <CaseCard
              key={docItem.id}
              document={docItem}
              filter={activeFilter}
            />
          ))}
        </div>
      )}
    </div>
  );
}
