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
import PaginationBar from "./PaginationBar";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/src/helpers/supabase/client";

const fetchMap: Record<
  Filter,
  (supabase: SupabaseClient, page: number) => Promise<DocumentData>
> = {
  Cases: (supabase, pages) => fetchCases(supabase, pages),
  Acts: (supabase, pages) => fetchActs(supabase, pages),
  "Republic Acts": (supabase, pages) => fetchRepublicActs(supabase, pages),
};

const FILTERS: Filter[] = ["Cases", "Republic Acts", "Acts"];

export default function DiscoverView() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Cases");
  const [page, setPage] = useState(1);
  const supabase = createClient();

  const handleToggle = (newFilter: Filter) => {
    setActiveFilter(newFilter);
    setPage(1); //always start at page 1;
  };
  // THE TANSTACK MAGIC:
  const { data, isLoading } = useQuery({
    queryKey: ["documents", activeFilter, page],
    queryFn: () => fetchMap[activeFilter](supabase, page),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });
  return (
    // 1. Changed to just `h-full`. We removed `overflow-hidden` and `h-[100dvh]`
    // because page.tsx is already doing that for us!
    <div className="flex flex-col h-full bg-[#050505] pt-8 px-8 pb-0">
      <div className="w-full flex justify-center shrink-0 mb-6">
        <CaseToggle filters={FILTERS} onToggle={handleToggle} />
      </div>

      {isLoading ? (
        <div className="text-white text-center mt-10 text-xl font-medium tracking-wide animate-pulse">
          Loading jurisprudence...
        </div>
      ) : (
        // 2. The scrolling container just fills the rest of the box
        <div className="flex-1 overflow-y-auto hide-scrollbar min-h-0 pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((docItem) => (
              <CaseCard
                key={docItem.id}
                document={docItem}
                filter={activeFilter}
              />
            ))}
          </div>
          <div className="mt-8 mb-4">
            <PaginationBar
              currentPage={page}
              totalPages={2} // Keep this at 2 for your testing!
              onPageChange={setPage}
            />
          </div>
          {/* 3. Your spacer rests perfectly at the bottom of the rounded box */}
          <div className="h-12 w-full shrink-0"></div>
        </div>
      )}
    </div>
  );
}
