type Citation = {
  page: number;
  quote: string;
  chunkId: string;
};

type CitationListProps = {
  citations: Citation[];
};

export default function CitationList({ citations }: CitationListProps) {
  return (
    <div className="ai-message-citation">
      {citations.map((cite) => (
        <div key={cite.chunkId} className="citation-item">
          <span>Page {cite.page}</span>
          <em>{cite.quote}</em>
        </div>
      ))}
    </div>
  );
}
