import { Link } from 'react-router-dom'
import { useMovieContext } from '../contexts/MovieContext'
import '../css/Ratings.css'

function Ratings() {
  const { ratings, favorites, watchlist, setUserRating } = useMovieContext()

  // Gather all rated items — from favorites and watchlist
  const allItems = [...favorites, ...watchlist].filter(
    (item, index, self) => self.findIndex((i) => i.id === item.id) === index
  )

  const ratedItems = allItems.filter((item) => ratings[item.id] !== undefined)

  // Sort by rating descending
  const sorted = [...ratedItems].sort(
    (a, b) => (ratings[b.id] || 0) - (ratings[a.id] || 0)
  )

  const starCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratedItems.filter((i) => ratings[i.id] === star).length,
  }))

  return (
    <div className="favorite-container">
      <div className="favorite-header ratings-header">
        <div>
          <h1>My Ratings</h1>
          <p className="ratings-subtitle">
            {ratedItems.length > 0
              ? `You've rated ${ratedItems.length} title${ratedItems.length > 1 ? 's' : ''}`
              : 'Rate titles from their detail pages to see them here'}
          </p>
        </div>

        {ratedItems.length > 0 && (
          <div className="rating-summary">
            {starCounts.map(({ star, count }) => (
              <div key={star} className="rating-bar-row">
                <span className="rating-bar-label">{'★'.repeat(star)}</span>
                <div className="rating-bar-track">
                  <div
                    className="rating-bar-fill"
                    style={{
                      width: `${ratedItems.length ? (count / ratedItems.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <span className="rating-bar-count">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {sorted.length > 0 ? (
        <div className="rated-grid px-4">
          {sorted.map((item) => (
            <Link key={item.id} to={`/movie/${item.id}`} className="rated-card">
              {item.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                  alt={item.title}
                  className="rated-poster"
                />
              ) : (
                <div className="rated-poster rated-poster-placeholder">🎬</div>
              )}
              <div className="rated-info">
                <h3 className="rated-title">{item.title || item.name}</h3>
                <span className="rated-year">
                  {(item.release_date || item.first_air_date)?.split('-')[0]}
                </span>
                <div className="rated-stars-display">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star-btn mini ${star <= (ratings[item.id] || 0) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault()
                        setUserRating(item.id, star)
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <span className="rated-score">{ratings[item.id]}/5</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="favorite-empty">
          <span style={{ fontSize: '4rem' }}>⭐</span>
          <h2>No ratings yet</h2>
          <p>
            Open any movie or TV show detail page and tap the stars to rate it.
            Your ratings will appear here.
          </p>
          <Link to="/" className="btn-premium">
            Start Browsing
          </Link>
        </div>
      )}
    </div>
  )
}

export default Ratings
