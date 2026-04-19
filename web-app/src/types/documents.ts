export type Filter = "Cases" | "Acts" | "Republic Acts";

export type Case = {
  id: string;
  document_id: string;
  facts: string;
  issue: string;
  ruling: string;
};

export type Law = {
  id: string;
  key_provisions: string;
  effect: string;
};

export type Document = {
  id: string;
  type: string;
  prefix: string;
  document_number: string;
  title: string;
  full_content: string;
  case_digests: Case[];
  law_digests: Law[];
};
