type ProcessingStatusProps = {
  status?: string | null;
};

export default function ProcessingStatus({ status }: ProcessingStatusProps) {
  if (!status) return null;
  const label = status === 'ready' ? 'Ready' : status === 'processing' ? 'Processing' : status;
  return <span className={`status-pill status-${status}`}>{label}</span>;
}
