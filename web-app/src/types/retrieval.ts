export type RetrieveDocsRequest = {
    query_text: string;
    top_k: number;
    alpha: number;
    filters?: filter[];
}

export type RetrieveDocsResponse = {
    results: RetrieveDocsResult[]
}

type filter = {
    filter: string,
}

export type DocMetadata = {
    text: string;
    chunk_index: number;
    law_id: string;
    document_type: string;
    date_approved: string;
    title: string;
    source_url: string;
}

export type RetrieveDocsResult = {
    id: string;
    score: number;
    metadata: DocMetadata
}