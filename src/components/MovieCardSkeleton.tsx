import '../css/MovieCard.css'

const MovieCardSkeleton = () => {
  return (
    <div className="movie-card skeleton-card">
      <div className="skeleton-img skeleton"></div>
      <div className="movie-card-body">
        <div className="skeleton-title skeleton"></div>
        <div className="skeleton-meta skeleton"></div>
      </div>
    </div>
  )
}

export default MovieCardSkeleton
