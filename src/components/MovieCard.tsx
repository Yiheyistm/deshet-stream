import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMovieContext } from '../contexts/MovieContext'
import '../css/MovieCard.css'

interface MovieCardProps {
  movie: any
  contentType?: 'movie' | 'tv'
}

const MovieCard = ({ movie, contentType }: MovieCardProps) => {
  const navigate = useNavigate()
  const { isFavorite, addToFavorites, removeFromFavorites, markAsWatched } =
    useMovieContext()
  const [isHovered, setIsHovered] = useState(false)
  const [isPreviewing, setIsPreviewing] = useState(false)
  const favorite = isFavorite(movie.id)

  useEffect(() => {
    let timer: any
    if (isHovered) {
      timer = setTimeout(() => setIsPreviewing(true), 600)
    } else {
      setIsPreviewing(false)
    }
    return () => clearTimeout(timer)
  }, [isHovered])

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (favorite) {
      removeFromFavorites(movie)
    } else {
      addToFavorites(movie)
    }
  }

  const handleWatchClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    markAsWatched({ ...movie, contentType: type })
    navigate(`/${type}/${movie.id}`)
  }

  const title = movie.title || movie.name
  const date = movie.release_date || movie.first_air_date
  const type =
    movie.media_type || contentType || (movie.first_air_date ? 'tv' : 'movie')

  const backdrop =
    isPreviewing && movie.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}`
      : `https://image.tmdb.org/t/p/w500${movie.poster_path}`

  return (
    <div
      className={`movie-card ${isPreviewing ? 'previewing' : ''}`}
      onClick={() => navigate(`/${type}/${movie.id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="play-overlay">
        <div className="play-icon-circle">▶</div>
      </div>
      <div
        className={`fav-icon ${favorite ? 'active' : ''}`}
        onClick={handleFavoriteClick}
      >
        ❤
      </div>
      <div className="poster-container">
        <img
          src={backdrop}
          alt={title}
          className={isPreviewing ? 'backdrop-anim' : ''}
        />
        {isPreviewing && (
          <div className="preview-meta-overlay">
            <span className="type-badge">{type.toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="movie-card-body">
        <h5 className="movie-title text-truncate">{title}</h5>
        <div className="movie-meta">
          <span className="rating-badge">{movie.vote_average?.toFixed(1)}</span>
          <span>{date?.split('-')[0]}</span>
        </div>
        <p className="movie-overview">{movie.overview}</p>

        {isPreviewing && (
          <div className="preview-extra mt-2 animate-in">
            <button className="btn-watch-mini" onClick={handleWatchClick}>
              Watch Now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieCard
