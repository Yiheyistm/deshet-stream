import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import MovieCardSkeleton from '../components/MovieCardSkeleton'
import '../css/Home.css'
import '../css/Trending.css'
import { getTrending } from '../servies/api'

function Trending() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day')
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [timeWindow, mediaType])

  useEffect(() => {
    const fetchTrending = async () => {
      setLoading(true)
      try {
        const data = await getTrending(mediaType, timeWindow, page)
        setItems(
          (data.results || []).filter((i: any) => i.media_type !== 'person')
        )
        setTotalPages(Math.min(data.total_pages || 1, 500))
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchTrending()
  }, [timeWindow, mediaType, page])

  return (
    <div className="trending-page">
      {/* Hero banner */}
      <div className="trending-hero">
        <div className="trending-hero-overlay" />
        <div className="trending-hero-content">
          <span className="trending-fire">🔥</span>
          <h1>What's Trending</h1>
          <p>The most-watched titles right now, updated daily and weekly.</p>
        </div>
      </div>

      <div className="container-fluid trending-controls">
        {/* Time window toggle */}
        <div className="toggle-group">
          <button
            className={`toggle-btn ${timeWindow === 'day' ? 'active' : ''}`}
            onClick={() => setTimeWindow('day')}
          >
            Today
          </button>
          <button
            className={`toggle-btn ${timeWindow === 'week' ? 'active' : ''}`}
            onClick={() => setTimeWindow('week')}
          >
            This Week
          </button>
        </div>

        {/* Media type filter */}
        <div className="toggle-group">
          {(['all', 'movie', 'tv'] as const).map((t) => (
            <button
              key={t}
              className={`toggle-btn ${mediaType === t ? 'active' : ''}`}
              onClick={() => setMediaType(t)}
            >
              {t === 'all' ? '🌐 All' : t === 'movie' ? '🎬 Movies' : '📺 TV'}
            </button>
          ))}
        </div>
      </div>

      <div className="container-fluid">
        <h3 className="section-title" style={{ marginBottom: '2rem' }}>
          {mediaType === 'all'
            ? 'All'
            : mediaType === 'movie'
              ? 'Movies'
              : 'TV Shows'}{' '}
          — Trending {timeWindow === 'day' ? 'Today' : 'This Week'}
        </h3>

        {loading ? (
          <div className="movie-grid">
            {[...Array(20)].map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="movie-grid">
              {items.map((item: any) => (
                <MovieCard
                  key={`${item.media_type}-${item.id}`}
                  movie={item}
                  contentType={item.media_type === 'tv' ? 'tv' : 'movie'}
                />
              ))}
            </div>

            <div className="pagination">
              <button
                className="pagination-btn"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                className="pagination-btn"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages || loading}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {items.length === 0 && !loading && (
        <div className="empty-container">
          <h2>No results</h2>
          <Link to="/" className="btn btn-premium">
            Go Home
          </Link>
        </div>
      )}
    </div>
  )
}

export default Trending
