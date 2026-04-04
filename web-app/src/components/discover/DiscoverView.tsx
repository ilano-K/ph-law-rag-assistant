"use client";
import { useState } from "react";
import CaseCard from "./CaseCard";
import { Filter } from "../../types/documents";
import {
  DocumentData,
  fetchActs,
  fetchCases,
  fetchRepublicActs,
} from "../../services/documentsService";
import CaseToggle from "./DocumentToggleButton";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const fetchMap: Record<Filter, (page: number) => Promise<DocumentData>> = {
  Cases: (pages) => fetchCases(pages),
  Acts: (pages) => fetchActs(pages),
  "Republic Acts": (pages) => fetchRepublicActs(pages),
};

const FILTERS: Filter[] = ["Cases", "Republic Acts", "Acts"];

export default function DiscoverView() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Cases");
  const [page, setPage] = useState(1);

  const handleToggle = (newFilter: Filter) => {
    setActiveFilter(newFilter);
    setPage(1); //always start at page 1;
  };
  // THE TANSTACK MAGIC:
  const { data, isLoading } = useQuery({
    queryKey: ["documents", activeFilter, page],
    queryFn: () => fetchMap[activeFilter](page),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });

  return (
    <div className="min-h-screen bg-[#050505] p-8">
      {/* The new layout wrapper for the toggle */}
      <div className="w-full flex justify-center">
        <CaseToggle filters={FILTERS} onToggle={handleToggle} />
      </div>

      {isLoading ? (
        <div className="text-white text-center mt-10 text-xl font-medium tracking-wide animate-pulse">
          Loading jurisprudence...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((docItem) => (
            <CaseCard
              key={docItem.id}
              document={docItem}
              filter={activeFilter}
            />
          ))}
          <button onClick={() => setPage(1)}>test</button>
        </div>
      )}
    </div>
  );
}
