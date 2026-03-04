import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMovieContext } from '../contexts/MovieContext'
import '../css/Navbar.css'
import { getGenres, getTVGenres, searchMulti } from '../servies/api'

interface NavbarProps {
  onSearch: (query: string) => void
  onGenreSelect: (genreId: string | number) => void
  contentType: 'movie' | 'tv'
  onTypeChange: (type: 'movie' | 'tv') => void
  sortBy: string
  onSortChange: (sort: string) => void
  year: string
  onYearChange: (y: string) => void
  selectedGenre: string | number
  isFree: boolean
  onFreeToggle: (free: boolean) => void
  onHomeClick: () => void
  includeAdult: boolean
  onAdultToggle: (adult: boolean) => void
}

const Navbar = ({
  onSearch,
  onGenreSelect,
  contentType,
  onTypeChange,
  sortBy,
  onSortChange,
  year,
  onYearChange,
  selectedGenre,
  isFree,
  onFreeToggle,
  onHomeClick,
  includeAdult,
  onAdultToggle,
}: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false)
  const [genres, setGenres] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [liveResults, setLiveResults] = useState<any[]>([])

  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const { searchHistory, addToSearchHistory, clearSearchHistory } =
    useMovieContext()

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) =>
    (currentYear - i).toString()
  )

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data =
          contentType === 'movie' ? await getGenres() : await getTVGenres()
        setGenres(data)
      } catch (err) {
        console.error('Failed to fetch genres:', err)
      }
    }
    fetchGenres()
  }, [contentType])

  useEffect(() => {
    const fetchLiveResults = async () => {
      if (searchInput.trim().length > 1) {
        try {
          const data = await searchMulti(searchInput, 1, includeAdult)
          setLiveResults(
            data.results
              .filter((i: any) => i.media_type !== 'person')
              .slice(0, 6)
          )
          setShowHistory(true)
        } catch (err) {
          console.error('Failed to fetch live results:', err)
        }
      } else {
        setLiveResults([])
      }
    }

    const timer = setTimeout(fetchLiveResults, 300)
    return () => clearTimeout(timer)
  }, [searchInput, includeAdult])

  // Clear local input when content type switches or home is clicked
  const handleLogoClick = () => {
    setSearchInput('')
    onHomeClick()
  }

  useEffect(() => {
    setSearchInput('')
  }, [contentType])

  const getDetailUrl = (item: any) => {
    return `/${item.media_type || contentType}/${item.id}`
  }

  return (
    <nav
      className={`premium-navbar ${scrolled ? 'scrolled' : ''} ${mobileMenuOpen ? 'menu-open' : ''}`}
    >
      <div className="navbar-container d-flex justify-content-between align-items-center px-4">
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center gap-2"
          onClick={handleLogoClick}
        >
          {/* <img
            src="/logo.png"
            alt="Deshet Tech"
            style={{ height: '35px', width: 'auto' }}
          /> */}
          <span>MOVIES</span>
        </Link>

        {/* Hamburger button — visible on mobile only */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop controls — hidden on mobile */}
        <div className="navbar-controls desktop-only d-flex align-items-center gap-4">
          <div className="type-toggle">
            <button
              className={`type-btn ${contentType === 'movie' ? 'active' : ''}`}
              onClick={() => onTypeChange('movie')}
            >
              Movies
            </button>
            <button
              className={`type-btn ${contentType === 'tv' ? 'active' : ''}`}
              onClick={() => onTypeChange('tv')}
            >
              TV Shows
            </button>
          </div>

          <div className="navbar-links">
            <Link
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
              to="/"
              onClick={handleLogoClick}
            >
              Home
            </Link>
            <Link
              className={`navbar-link ${isActive('/trending') ? 'active' : ''}`}
              to="/trending"
            >
              🔥 Trending
            </Link>
            <Link
              className={`navbar-link ${isActive('/library') ? 'active' : ''}`}
              to="/library"
            >
              My Library
            </Link>
            <Link
              className={`navbar-link ${isActive('/ratings') ? 'active' : ''}`}
              to="/ratings"
            >
              Ratings
            </Link>
          </div>

          <div className="filter-group d-flex gap-2">
            <div className="genre-select-wrapper">
              <select
                className="genre-select"
                onChange={(e) => onGenreSelect(e.target.value)}
                value={selectedGenre}
              >
                <option value="">All Genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="genre-select-wrapper sort-select">
              <select
                className="genre-select"
                onChange={(e) => onSortChange(e.target.value)}
                value={sortBy}
              >
                <option value="popularity.desc">Trending</option>
                <option value="vote_average.desc">Top Rated</option>
                <option
                  value={
                    contentType === 'movie'
                      ? 'primary_release_date.desc'
                      : 'first_air_date.desc'
                  }
                >
                  Latest
                </option>
                <option value="revenue.desc">Blockbusters</option>
              </select>
            </div>

            <div className="genre-select-wrapper year-select">
              <select
                className="genre-select"
                onChange={(e) => onYearChange(e.target.value)}
                value={year}
              >
                <option value="">Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-dropdown-container">
              <button
                className={`filter-dropdown-btn ${isFree || includeAdult ? 'active' : ''}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                ⚙️ Settings{' '}
                {(isFree || includeAdult) && (
                  <span className="filter-dot"></span>
                )}
              </button>

              {showFilters && (
                <div className="filter-dropdown-menu">
                  <div
                    className="filter-item"
                    onClick={() => onFreeToggle(!isFree)}
                  >
                    <div
                      className={`filter-checkbox ${isFree ? 'checked' : ''}`}
                    >
                      {isFree && '✓'}
                    </div>
                    <span>🆓 Free Only</span>
                  </div>
                  <div
                    className="filter-item"
                    onClick={() => onAdultToggle(!includeAdult)}
                  >
                    <div
                      className={`filter-checkbox ${includeAdult ? 'checked' : ''}`}
                    >
                      {includeAdult && '✓'}
                    </div>
                    <span>🔞 Adult Content (18+)</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder={`Search ${contentType === 'movie' ? 'movies' : 'TV shows'}...`}
              onChange={(e) => {
                const query = e.target.value
                setSearchInput(query)
                onSearch(query)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value
                  if (query.trim()) addToSearchHistory(query.trim())
                }
              }}
              value={searchInput}
              onFocus={() => setShowHistory(true)}
              onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            />
            {showHistory &&
              (searchHistory.length > 0 || liveResults.length > 0) && (
                <div className="search-history-dropdown">
                  <div className="history-header">
                    <span>Recent Searches</span>
                    <button className="clear-btn" onClick={clearSearchHistory}>
                      Clear All
                    </button>
                  </div>
                  <div className="history-list">
                    {searchInput.trim() && liveResults.length > 0 && (
                      <>
                        <div className="history-header pt-0">
                          <span>Suggestions</span>
                        </div>
                        <div className="live-results">
                          {liveResults.map((item) => (
                            <Link
                              key={item.id}
                              to={getDetailUrl(item)}
                              className="history-item live-result-item"
                              onClick={() => {
                                setShowHistory(false)
                                setSearchInput('')
                                addToSearchHistory(item.title || item.name)
                              }}
                            >
                              <img
                                src={
                                  item.poster_path
                                    ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                                    : 'https://via.placeholder.com/40x60?text=?'
                                }
                                alt=""
                                className="suggestion-poster"
                              />
                              <div className="suggestion-info">
                                <span className="suggestion-title">
                                  {item.title || item.name}
                                </span>
                                <span className="suggestion-meta">
                                  {item.media_type === 'movie'
                                    ? '🎬 Movie'
                                    : '📺 TV Show'}{' '}
                                  •{' '}
                                  {
                                    (
                                      item.release_date || item.first_air_date
                                    )?.split('-')[0]
                                  }
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <div className="history-header border-top mt-2">
                          <span>Recent Searches</span>
                        </div>
                      </>
                    )}
                    {!searchInput.trim() &&
                      searchHistory.map((query: string, index: number) => (
                        <div
                          key={index}
                          className="history-item"
                          onClick={() => {
                            setSearchInput(query)
                            onSearch(query)
                            setShowHistory(false)
                          }}
                        >
                          <span className="history-icon">🕒</span>
                          <span className="history-text">{query}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-type-toggle">
            <button
              className={`type-btn ${contentType === 'movie' ? 'active' : ''}`}
              onClick={() => {
                onTypeChange('movie')
                setMobileMenuOpen(false)
              }}
            >
              🎬 Movies
            </button>
            <button
              className={`type-btn ${contentType === 'tv' ? 'active' : ''}`}
              onClick={() => {
                onTypeChange('tv')
                setMobileMenuOpen(false)
              }}
            >
              📺 TV Shows
            </button>
          </div>

          <div className="mobile-nav-links">
            <Link
              className="mobile-nav-link"
              to="/"
              onClick={() => {
                handleLogoClick()
                setMobileMenuOpen(false)
              }}
            >
              Home
            </Link>
            <Link
              className="mobile-nav-link"
              to="/trending"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔥 Trending
            </Link>
            <Link
              className="mobile-nav-link"
              to="/library"
              onClick={() => setMobileMenuOpen(false)}
            >
              📁 My Library
            </Link>
            <Link
              className="mobile-nav-link"
              to="/ratings"
              onClick={() => setMobileMenuOpen(false)}
            >
              ⭐ My Ratings
            </Link>
          </div>

          <div className="mobile-filters">
            <select
              className="genre-select"
              onChange={(e) => {
                onGenreSelect(e.target.value)
                setMobileMenuOpen(false)
              }}
              value={selectedGenre}
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
            <select
              className="genre-select"
              onChange={(e) => {
                onSortChange(e.target.value)
              }}
              value={sortBy}
            >
              <option value="popularity.desc">Trending</option>
              <option value="vote_average.desc">Top Rated</option>
              <option
                value={
                  contentType === 'movie'
                    ? 'primary_release_date.desc'
                    : 'first_air_date.desc'
                }
              >
                Latest
              </option>
              <option value="revenue.desc">Blockbusters</option>
            </select>
            <select
              className="genre-select"
              onChange={(e) => {
                onYearChange(e.target.value)
              }}
              value={year}
            >
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <button
              className={`mobile-free-btn ${isFree ? 'active' : ''}`}
              onClick={() => {
                onFreeToggle(!isFree)
                setMobileMenuOpen(false)
              }}
            >
              {isFree ? '✅ Showing Free Content' : '🆓 Show Free Only'}
            </button>

            <button
              className={`mobile-free-btn ${includeAdult ? 'active' : ''}`}
              onClick={() => {
                onAdultToggle(!includeAdult)
                setMobileMenuOpen(false)
              }}
            >
              {includeAdult
                ? '🔞 18+ Content Enabled'
                : '🔞 Enable 18+ Content'}
            </button>
          </div>

          <div className="mobile-search">
            <input
              type="text"
              className="search-input"
              style={{ width: '100%' }}
              placeholder={`Search ${contentType === 'movie' ? 'movies' : 'TV shows'}...`}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value)
                onSearch(e.target.value)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const q = (e.target as HTMLInputElement).value
                  if (q.trim()) {
                    addToSearchHistory(q.trim())
                    setMobileMenuOpen(false)
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
