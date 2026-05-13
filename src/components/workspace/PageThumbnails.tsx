type PageThumbnailsProps = {
  pageCount: number;
  selectedPage: number;
  onSelect: (page: number) => void;
};

export default function PageThumbnails({ pageCount, selectedPage, onSelect }: PageThumbnailsProps) {
  return (
    <div className="page-thumbnails">
      <div className="thumbnails-header">
        <span>Pages</span>
        <span className="thumbnails-count">{pageCount}</span>
      </div>
      <div className="thumbnails-list">
        {Array.from({ length: pageCount }).map((_, index) => {
          const page = index + 1;
          return (
            <div
              key={page}
              className={`thumbnail-item ${selectedPage === page ? 'active' : ''}`}
              onClick={() => onSelect(page)}
            >
              <div className="thumbnail-preview">
                <div className="thumbnail-lines">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <span className="thumbnail-label">{page}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
