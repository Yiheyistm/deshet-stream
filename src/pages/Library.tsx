import { useState } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import { useMovieContext } from '../contexts/MovieContext'
import '../css/Library.css'

function Library() {
  const { favorites, watchlist, watchHistory, clearWatchHistory } =
    useMovieContext()
  const [activeTab, setActiveTab] = useState<
    'watchlist' | 'favorites' | 'history'
  >('watchlist')

  const getActiveContent = () => {
    switch (activeTab) {
      case 'watchlist':
        return watchlist
      case 'favorites':
        return favorites
      case 'history':
        return watchHistory
      default:
        return []
    }
  }

  const content = getActiveContent()

  return (
    <div className="library-container">
      <div className="library-header px-4">
        <h1>My Library</h1>
        <div className="library-tabs">
          <button
            className={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('watchlist')}
          >
            Watchlist{' '}
            {watchlist.length > 0 && (
              <span className="tab-count">{watchlist.length}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === 'favorites' ? 'active' : ''}`}
            onClick={() => setActiveTab('favorites')}
          >
            Favorites{' '}
            {favorites.length > 0 && (
              <span className="tab-count">{favorites.length}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Browsing History
          </button>
        </div>
      </div>

      <div className="library-content px-4">
        <div className="content-header d-flex justify-content-between align-items-center mb-4">
          <h2 className="tab-title">
            {activeTab === 'watchlist' && 'Movies to Watch'}
            {activeTab === 'favorites' && 'Your Top Picks'}
            {activeTab === 'history' && 'Browsing & Watching History'}
          </h2>
          {activeTab === 'history' && watchHistory.length > 0 && (
            <button className="btn-clear-history" onClick={clearWatchHistory}>
              Clear History
            </button>
          )}
        </div>

        {content.length > 0 ? (
          <div className="movie-grid">
            {content.map((movie) => (
              <MovieCard key={`${activeTab}-${movie.id}`} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="library-empty">
            <div className="empty-icon">
              {activeTab === 'watchlist' && '🔖'}
              {activeTab === 'favorites' && '❤️'}
              {activeTab === 'history' && '🕒'}
            </div>
            <h3>
              {activeTab === 'watchlist' && 'Nothing in your watchlist'}
              {activeTab === 'favorites' && 'No favorites yet'}
              {activeTab === 'history' && "You haven't watched anything yet"}
            </h3>
            <p>
              {activeTab === 'watchlist' &&
                'Save movies and TV shows to watch later!'}
              {activeTab === 'favorites' &&
                'Love a movie? Add it to your favorites!'}
              {activeTab === 'history' &&
                'Explore our collection and start watching!'}
            </p>
            <Link to="/" className="btn-premium mt-3">
              Browse Content
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Library
