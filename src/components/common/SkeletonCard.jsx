function SkeletonCard({ className = 'h-28' }) {
  return <div className={`card-surface skeleton ${className}`} aria-hidden="true" />;
}

export default SkeletonCard;
