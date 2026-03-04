import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMovieContext } from '../contexts/MovieContext'
import '../css/Hero.css'

interface HeroMovie {
  id: number
  title?: string
  name?: string
  description?: string
  overview?: string
  poster_path?: string
  backdrop_path?: string
  vote_average?: number
  release_date?: string
  first_air_date?: string
  contentType?: 'movie' | 'tv'
}

interface HeroProps {
  movies: HeroMovie[]
}

const AUTOPLAY_INTERVAL = 6000

const Hero = ({ movies }: HeroProps) => {
  const navigate = useNavigate()
  const { markAsWatched } = useMovieContext()
  const [activeIndex, setActiveIndex] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const handleWatchClick = (e: React.MouseEvent, movie: HeroMovie) => {
    e.preventDefault()
    markAsWatched({
      ...movie,
      poster_path: movie.poster_path || '',
      backdrop_path: movie.backdrop_path || '',
      vote_average: movie.vote_average || 0,
      overview: movie.overview || movie.description || '',
      contentType: movie.contentType,
    } as any)
    navigate(`/${movie.contentType === 'tv' ? 'tv' : 'movie'}/${movie.id}`)
  }

  const goTo = useCallback(
    (index: number, dir: 'next' | 'prev' = 'next') => {
      if (animating || index === activeIndex) return
      setDirection(dir)
      setAnimating(true)
      setTimeout(() => {
        setActiveIndex(index)
        setAnimating(false)
      }, 500)
    },
    [animating, activeIndex]
  )

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % movies.length
    goTo(next, 'next')
  }, [activeIndex, movies.length, goTo])

  const goPrev = useCallback(() => {
    const prev = (activeIndex - 1 + movies.length) % movies.length
    goTo(prev, 'prev')
  }, [activeIndex, movies.length, goTo])

  // Autoplay
  useEffect(() => {
    if (movies.length <= 1) return
    const timer = setInterval(goNext, AUTOPLAY_INTERVAL)
    return () => clearInterval(timer)
  }, [goNext, movies.length])

  if (!movies || movies.length === 0) return null

  const current = movies[activeIndex]
  const year = (current.release_date || current.first_air_date || '').split(
    '-'
  )[0]

  return (
    <div
      className={`hero-section hero-carousel ${animating ? `animating-${direction}` : ''}`}
      style={{
        backgroundImage:
          current.backdrop_path || current.poster_path
            ? `url(https://image.tmdb.org/t/p/original${current.backdrop_path || current.poster_path})`
            : 'none',
      }}
    >
      <div className="hero-overlay" />

      {/* Content */}
      <div
        className={`hero-content ${animating ? 'hero-content-exit' : 'hero-content-enter'}`}
      >
        <div className="hero-meta-row">
          {current.vote_average && current.vote_average > 0 && (
            <span className="hero-badge rating-badge">
              ★ {current.vote_average.toFixed(1)}
            </span>
          )}
          {year && <span className="hero-badge year-badge">{year}</span>}
          {current.contentType && (
            <span className="hero-badge type-badge">
              {current.contentType === 'tv' ? 'TV Show' : 'Movie'}
            </span>
          )}
        </div>
        <h1>{current.title || current.name}</h1>
        <p>{current.description || current.overview}</p>
        <div className="hero-actions">
          <button
            onClick={(e) => handleWatchClick(e, current)}
            className="btn-premium btn-watch-hero"
          >
            Watch Now
          </button>
          <Link
            to={`/${current.contentType === 'tv' ? 'tv' : 'movie'}/${current.id}`}
            className="btn-premium btn-details-hero"
          >
            More Info
          </Link>
        </div>
      </div>

      {/* Left / Right arrows */}
      {movies.length > 1 && (
        <>
          <button
            className="hero-arrow hero-arrow-left"
            onClick={goPrev}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            className="hero-arrow hero-arrow-right"
            onClick={goNext}
            aria-label="Next"
          >
            ›
          </button>
        </>
      )}

      {/* Dot indicators */}
      {movies.length > 1 && (
        <div className="hero-dots">
          {movies.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === activeIndex ? 'active' : ''}`}
              onClick={() => goTo(i, i > activeIndex ? 'next' : 'prev')}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress bar */}
      {movies.length > 1 && (
        <div className="hero-progress">
          <div
            key={activeIndex}
            className="hero-progress-bar"
            style={{ animationDuration: `${AUTOPLAY_INTERVAL}ms` }}
          />
        </div>
      )}
    </div>
  )
}

export default Hero
