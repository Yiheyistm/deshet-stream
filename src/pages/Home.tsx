import { useCallback, useEffect, useRef, useState } from 'react'
import Hero from '../components/Hero'
import MovieCard from '../components/MovieCard'
import MovieCardSkeleton from '../components/MovieCardSkeleton'
import { useMovieContext } from '../contexts/MovieContext'
import '../css/Home.css'
import {
  discoverMovies,
  discoverTV,
  searchMovies,
  searchTV,
} from '../servies/api'

interface HomeProps {
  searchQuery: string
  selectedGenre: string | number
  contentType: 'movie' | 'tv'
  sortBy: string
  year: string
  isFree?: boolean
  includeAdult?: boolean
}

function Home({
  searchQuery,
  selectedGenre,
  contentType,
  sortBy,
  year,
  isFree = false,
  includeAdult = false,
}: HomeProps) {
  const { watchHistory } = useMovieContext()
  const [movies, setMovies] = useState<any[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [heroMovies, setHeroMovies] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  // Sentinel element ref for IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  // Reset when filters change
  useEffect(() => {
    setCurrentPage(1)
    setMovies([])
    setHasMore(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [searchQuery, selectedGenre, sortBy, year, contentType, isFree])

  // Main fetch effect
  useEffect(() => {
    const fetchMovies = async () => {
      if (currentPage === 1) setLoading(true)
      else setLoadingMore(true)
      setError('')

      try {
        let data
        if (searchQuery) {
          data =
            contentType === 'movie'
              ? await searchMovies(searchQuery, currentPage, includeAdult)
              : await searchTV(searchQuery, currentPage, includeAdult)
        } else {
          data =
            contentType === 'movie'
              ? await discoverMovies(
                  currentPage,
                  sortBy,
                  selectedGenre,
                  year,
                  isFree,
                  includeAdult
                )
              : await discoverTV(
                  currentPage,
                  sortBy,
                  selectedGenre,
                  year,
                  isFree,
                  includeAdult
                )
        }

        const results = data.results || []
        const pages = Math.min(data.total_pages || 1, 500)
        setHasMore(currentPage < pages)

        if (currentPage === 1) {
          setMovies(results)
          if (results.length > 0) {
            setHeroMovies(
              results.slice(0, 5).map((m: any) => ({ ...m, contentType }))
            )
          }
        } else {
          setMovies((prev) => [...prev, ...results])
        }
      } catch (err) {
        console.error(err)
        setError(
          `Unable to fetch ${contentType === 'movie' ? 'movies' : 'TV shows'}. Please check your connection.`
        )
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    }

    fetchMovies()
  }, [
    searchQuery,
    selectedGenre,
    currentPage,
    contentType,
    sortBy,
    year,
    includeAdult,
  ])

  // Infinite scroll observer
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0]
      if (target.isIntersecting && hasMore && !loadingMore && !loading) {
        setCurrentPage((prev) => prev + 1)
      }
    },
    [hasMore, loadingMore, loading]
  )

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '200px',
      threshold: 0,
    })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [handleObserver])

  const showHero = heroMovies.length > 0 && !searchQuery && currentPage === 1

  return (
    <div className={`home-container ${!showHero ? 'paged' : ''}`}>
      {showHero && movies.length > 0 && <Hero movies={heroMovies} />}

      <div className="container-fluid">
        {/* PERSONALIZED ROW: RECENTLY VIEWED */}
        {!searchQuery &&
          watchHistory.some((m) => m.isWatched) &&
          currentPage === 1 && (
            <div className="recent-row mb-5">
              <h4 className="row-title">🕒 Continue Watching</h4>
              <div className="recent-grid">
                {watchHistory
                  .filter((m: any) => m.isWatched)
                  .slice(0, 5)
                  .map((m: any) => (
                    <div key={`hist-${m.id}`} className="recent-item">
                      <MovieCard movie={m} contentType={m.contentType} />
                      <div className="recent-badge">Recent</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

        <h3 className="section-title">
          {loading && movies.length === 0
            ? `Searching ${contentType === 'movie' ? 'movies' : 'TV shows'}...`
            : searchQuery
              ? `Search Results for "${searchQuery}"`
              : (() => {
                  const sortLabels: Record<string, string> = {
                    'popularity.desc': 'Trending',
                    'vote_average.desc': 'Top Rated',
                    'primary_release_date.desc': 'Latest',
                    'first_air_date.desc': 'Latest',
                    'revenue.desc': 'Blockbuster',
                  }
                  const sortLabel = sortLabels[sortBy] || 'Popular'
                  const typeLabel =
                    contentType === 'movie' ? 'Movies' : 'TV Shows'
                  const yearText = year ? ` (${year})` : ''
                  const freeText = isFree ? 'Free ' : ''
                  return `${freeText}${sortLabel} ${typeLabel}${yearText}`
                })()}
        </h3>

        {loading && movies.length === 0 ? (
          <div className="movie-grid">
            {[...Array(12)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="empty-container">
            <h2>No results found</h2>
            <p>
              We couldn't find any results for your criteria. Try a different
              search term or genre.
            </p>
          </div>
        ) : (
          <>
            <div className="movie-grid">
              {movies.map((movie: any, index: number) => (
                <MovieCard
                  key={`${movie.id}-${index}`}
                  movie={movie}
                  contentType={contentType}
                />
              ))}
              {/* Inline skeletons when loading more */}
              {loadingMore &&
                [...Array(6)].map((_, i) => (
                  <MovieCardSkeleton key={`sk-${i}`} />
                ))}
            </div>

            {/* Infinite scroll sentinel — only active for first few pages */}
            {hasMore && currentPage < 3 && (
              <div ref={sentinelRef} style={{ height: '10px' }} />
            )}

            {/* Manual Load More button to allow reaching the footer */}
            {hasMore && currentPage >= 3 && !loadingMore && (
              <div className="load-more-container mt-4 mb-5 text-center">
                <button
                  className="btn-premium px-5"
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                >
                  Load More Content
                </button>
              </div>
            )}

            {/* End-of-results indicator */}
            {!hasMore && movies.length > 0 && (
              <div className="end-of-results">
                <span>You've seen it all! ✨</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Home
