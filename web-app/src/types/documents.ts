export type Filter = "Cases" | "Acts" | "Republic Acts";

export interface Case {
  id: string;
  document_id: string;
  facts: string;
  issue: string;
  ruling: string;
}

export interface Law {
  id: string;
  key_provisions: string;
  effect: string;
}

export interface Document {
  id: string;
  type: string;
  prefix: string;
  document_number: string;
  title: string;
  full_content: string;
  case_digests: Case[];
  law_digests: Law[];
}
