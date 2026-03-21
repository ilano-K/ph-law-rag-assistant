export interface Cases {
  id: string;
  document_id: string;
  facts: string;
  issue: string;
  ruling: string;
}

export interface Documents {
  id: string;
  type: string;
  prefix: string;
  document_number: string;
  title: string;
  full_content: string;
  case_digests: Cases[];
}
