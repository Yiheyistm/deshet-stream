import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import StreamingPlayer from '../components/StreamingPlayer'
import TrailerModal from '../components/TrailerModal'
import { useMovieContext } from '../contexts/MovieContext'
import '../css/MovieDetail.css'
import {
  getCollection,
  getMovieDetails,
  getRecommendations,
  getTVDetails,
  getTVRecommendations,
  getTVSeason,
  getWatchProviders,
} from '../servies/api'

interface MovieDetailProps {
  type: 'movie' | 'tv'
}

const DetailSkeleton = () => (
  <div className="movie-detail-container skeleton-detail">
    <div className="detail-backdrop skeleton"></div>
    <div className="movie-detail-content">
      <div className="detail-poster-container">
        <div className="detail-poster skeleton"></div>
      </div>
      <div className="detail-info">
        <div
          className="skeleton-title skeleton"
          style={{ height: '3rem', width: '60%' }}
        ></div>
        <div
          className="skeleton-tagline skeleton"
          style={{ height: '1.5rem', width: '40%', margin: '1rem 0' }}
        ></div>
        <div className="genres d-flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{ width: '80px', height: '30px', borderRadius: '20px' }}
            ></div>
          ))}
        </div>
        <div className="detail-meta d-flex gap-3 mt-4">
          <div
            className="skeleton"
            style={{ width: '100px', height: '20px' }}
          ></div>
          <div
            className="skeleton"
            style={{ width: '60px', height: '20px' }}
          ></div>
        </div>
        <div className="overview-container mt-5">
          <div
            className="skeleton mb-2"
            style={{ height: '1rem', width: '100%' }}
          ></div>
          <div
            className="skeleton mb-2"
            style={{ height: '1rem', width: '90%' }}
          ></div>
          <div
            className="skeleton mb-2"
            style={{ height: '1rem', width: '95%' }}
          ></div>
        </div>
        <div className="detail-actions d-flex gap-3 mt-5">
          <div
            className="skeleton"
            style={{ width: '180px', height: '50px', borderRadius: '6px' }}
          ></div>
          <div
            className="skeleton"
            style={{ width: '180px', height: '50px', borderRadius: '6px' }}
          ></div>
        </div>
      </div>
    </div>
  </div>
)

function MovieDetail({ type }: MovieDetailProps) {
  const { id } = useParams()
  const [movie, setMovie] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [collection, setCollection] = useState<any>(null)
  const [watchProviders, setWatchProviders] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const [showPlayer, setShowPlayer] = useState(false)
  const [currentSeason, setCurrentSeason] = useState(1)
  const [currentEpisode, setCurrentEpisode] = useState(1)
  const [seasonData, setSeasonData] = useState<any>(null)
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    ratings,
    setUserRating,
    addToWatchHistory,
    markAsWatched,
  } = useMovieContext()

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true)
      setIsExpanded(false)
      try {
        if (id) {
          const detailPromise =
            type === 'movie' ? getMovieDetails(id) : getTVDetails(id)
          const recPromise =
            type === 'movie' ? getRecommendations(id) : getTVRecommendations(id)

          const [detailsData, recommendationsData] = await Promise.all([
            detailPromise,
            recPromise,
          ])

          setMovie(detailsData)
          setRecommendations(recommendationsData?.slice(0, 8) || [])

          // Add to watch history
          addToWatchHistory({
            ...detailsData,
            contentType: type,
          })

          // Fetch collection and watch providers in parallel (non-critical)
          const extras: Promise<void>[] = []

          if (detailsData.belongs_to_collection?.id) {
            extras.push(
              getCollection(detailsData.belongs_to_collection.id)
                .then(setCollection)
                .catch(() => {})
            )
          }

          extras.push(
            getWatchProviders(id, type)
              .then(setWatchProviders)
              .catch(() => {})
          )

          await Promise.all(extras)

          // Fetch first season data if it's a TV show
          if (type === 'tv' && detailsData.seasons?.length > 0) {
            try {
              const firstSeason =
                detailsData.seasons.find((s: any) => s.season_number > 0) ||
                detailsData.seasons[0]
              const sData = await getTVSeason(id, firstSeason.season_number)
              setSeasonData(sData)
              setCurrentSeason(firstSeason.season_number)
            } catch (err) {
              console.error('Failed to load season data', err)
            }
          }
        }
      } catch (err) {
        console.error(err)
        setError(
          `Failed to load ${type === 'movie' ? 'movie' : 'TV show'} details`
        )
      } finally {
        setLoading(false)
      }
    }
    fetchDetails()
    window.scrollTo(0, 0)
  }, [id, type])

  if (loading) return <DetailSkeleton />
  if (error)
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Oops!</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  if (!movie)
    return (
      <div className="empty-container">
        <h2>Content not found</h2>
      </div>
    )

  const favorite = isFavorite(movie.id)
  const watchlisted = isInWatchlist(movie.id)

  const toggleFavorite = () => {
    if (favorite) {
      removeFromFavorites(movie)
    } else {
      addToFavorites(movie)
    }
  }

  const toggleWatchlist = () => {
    if (watchlisted) {
      removeFromWatchlist(movie)
    } else {
      addToWatchlist(movie)
    }
  }

  const handleRate = (rating: number) => {
    setUserRating(movie.id, rating)
  }

  const userRating = ratings[movie.id] || 0

  const trailer = movie.videos?.results?.find(
    (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
  )

  const cast = movie.credits?.cast?.slice(0, 10) || []

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const title = movie.title || movie.name
  const date = movie.release_date || movie.first_air_date
  const runtime =
    movie.runtime || (movie.episode_run_time ? movie.episode_run_time[0] : null)

  return (
    <div className="movie-detail-container">
      <div
        className="detail-backdrop"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
        }}
      ></div>

      <div className="movie-detail-content">
        <div className="detail-poster-container">
          <img
            className="detail-poster"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={title}
          />
          <div className="extra-info-card mt-4">
            <div className="info-item">
              <span className="label">Status</span>
              <span className="value">{movie.status}</span>
            </div>
            {movie.budget > 0 && (
              <div className="info-item">
                <span className="label">Budget</span>
                <span className="value">{formatCurrency(movie.budget)}</span>
              </div>
            )}
            {movie.revenue > 0 && (
              <div className="info-item">
                <span className="label">Revenue</span>
                <span className="value">{formatCurrency(movie.revenue)}</span>
              </div>
            )}
            {movie.number_of_seasons && (
              <div className="info-item">
                <span className="label">Seasons</span>
                <span className="value">{movie.number_of_seasons}</span>
              </div>
            )}
            {movie.number_of_episodes && (
              <div className="info-item">
                <span className="label">Episodes</span>
                <span className="value">{movie.number_of_episodes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="detail-info">
          <h1>{title}</h1>
          {movie.tagline && <span className="tagline">{movie.tagline}</span>}

          <div className="genres">
            {movie.genres?.map((genre: any) => (
              <span key={genre.id} className="genre-badge">
                {genre.name}
              </span>
            ))}
          </div>

          <div className="user-rating-section mb-4">
            <span className="rating-label">Your Rating:</span>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-btn ${star <= userRating ? 'active' : ''}`}
                  onClick={() => handleRate(star)}
                >
                  ★
                </button>
              ))}
              {userRating > 0 && (
                <span className="rating-text ms-2">{userRating}/5</span>
              )}
            </div>
          </div>

          <div className="detail-meta">
            <span className="rating">
              {movie.vote_average?.toFixed(1)}
              <small className="ms-2 text-muted" style={{ fontSize: '0.9rem' }}>
                ({movie.vote_count?.toLocaleString()} votes)
              </small>
            </span>
            <span>{date?.split('-')[0]}</span>
            {runtime && <span>{runtime} min</span>}
          </div>

          <div className="overview-container">
            <p className="detail-overview">
              {isExpanded || movie.overview.length <= 300
                ? movie.overview
                : `${movie.overview.substring(0, 300)}...`}
            </p>
            {movie.overview.length > 300 && (
              <button
                className="read-more-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>

          <div className="detail-actions">
            <button
              className="btn-trailer btn-watch-now"
              onClick={() => {
                markAsWatched({ ...movie, contentType: type })
                setShowPlayer(true)
              }}
            >
              WATCH NOW
            </button>
            {trailer && (
              <button
                className="btn-trailer"
                onClick={() => setShowTrailer(true)}
              >
                ▶ Play Trailer
              </button>
            )}
            <button
              className={`btn-fav ${favorite ? 'active' : ''}`}
              onClick={toggleFavorite}
            >
              {favorite ? '❤ Loved' : '♡ Add to Favorites'}
            </button>
            <button
              className={`btn-watchlist ${watchlisted ? 'active' : ''}`}
              onClick={toggleWatchlist}
            >
              {watchlisted ? '✓ In Watchlist' : '+ Watchlist'}
            </button>
          </div>

          {cast.length > 0 && (
            <div className="cast-section">
              <h3>Top Cast</h3>
              <div className="cast-list">
                {cast.map((person: any) => (
                  <Link
                    key={person.id}
                    to={`/person/${person.id}`}
                    className="cast-card-link"
                  >
                    <div className="cast-card">
                      {person.profile_path ? (
                        <img
                          className="cast-img"
                          src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                          alt={person.name}
                        />
                      ) : (
                        <div
                          className="cast-img-placeholder"
                          style={{
                            background: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '140px',
                            height: '140px',
                            borderRadius: '50%',
                            margin: '0 auto 12px',
                          }}
                        >
                          👤
                        </div>
                      )}
                      <span className="cast-name">{person.name}</span>
                      <span className="cast-character">{person.character}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {movie.production_companies?.length > 0 && (
            <div className="production-section mt-5">
              <h3>Production</h3>
              <div className="production-list">
                {movie.production_companies.map((company: any) => (
                  <div key={company.id} className="production-item">
                    {company.logo_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                        alt={company.name}
                        className="company-logo"
                      />
                    ) : (
                      <span className="company-name">{company.name}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {watchProviders &&
        (watchProviders.flatrate ||
          watchProviders.free ||
          watchProviders.ads ||
          watchProviders.buy ||
          watchProviders.rent) && (
          <div className="watch-providers-section">
            <div className="container-fluid">
              <h3 className="section-title">Where to Watch</h3>
              <div className="providers-container">
                {/* Highlight Free & Ads first since user asked for it */}
                {(watchProviders.free || watchProviders.ads) && (
                  <div className="provider-group free-group">
                    <span className="group-label">Free</span>
                    <div className="provider-list">
                      {[
                        ...(watchProviders.free || []),
                        ...(watchProviders.ads || []),
                      ].map((provider: any) => (
                        <a
                          key={provider.provider_id}
                          href={watchProviders.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="provider-item"
                          title={provider.provider_name}
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                            alt={provider.provider_name}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {watchProviders.flatrate && (
                  <div className="provider-group">
                    <span className="group-label">Stream</span>
                    <div className="provider-list">
                      {watchProviders.flatrate.map((provider: any) => (
                        <a
                          key={provider.provider_id}
                          href={watchProviders.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="provider-item"
                          title={provider.provider_name}
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                            alt={provider.provider_name}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {(watchProviders.buy || watchProviders.rent) && (
                  <div className="provider-group">
                    <span className="group-label">Rent / Buy</span>
                    <div className="provider-list">
                      {/* Unique providers only */}
                      {Array.from(
                        new Set(
                          [
                            ...(watchProviders.buy || []),
                            ...(watchProviders.rent || []),
                          ].map((p) => p.provider_id)
                        )
                      )
                        .map((id) =>
                          [
                            ...(watchProviders.buy || []),
                            ...(watchProviders.rent || []),
                          ].find((p) => p.provider_id === id)
                        )
                        .map((provider: any) => (
                          <a
                            key={provider.provider_id}
                            href={watchProviders.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="provider-item"
                            title={provider.provider_name}
                          >
                            <img
                              src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                              alt={provider.provider_name}
                            />
                          </a>
                        ))}
                    </div>
                  </div>
                )}
              </div>
              <p className="providers-footer">Data provided by JustWatch</p>
            </div>
          </div>
        )}

      {collection && collection.parts?.length > 1 && (
        <div className="collection-section">
          {collection.backdrop_path && (
            <div
              className="collection-backdrop"
              style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${collection.backdrop_path})`,
              }}
            />
          )}
          <div className="container-fluid collection-content">
            <div className="collection-header">
              <span className="collection-badge">Part of a Collection</span>
              <h3 className="section-title">{collection.name}</h3>
              {collection.overview && (
                <p className="collection-overview">{collection.overview}</p>
              )}
            </div>
            <div className="collection-grid">
              {collection.parts
                .sort((a: any, b: any) =>
                  (a.release_date || '').localeCompare(b.release_date || '')
                )
                .map((part: any) => (
                  <Link
                    key={part.id}
                    to={`/movie/${part.id}`}
                    className={`collection-card ${part.id === movie.id ? 'current' : ''}`}
                  >
                    {part.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w300${part.poster_path}`}
                        alt={part.title}
                        className="collection-poster"
                      />
                    ) : (
                      <div className="collection-poster-placeholder">🎬</div>
                    )}
                    <div className="collection-card-info">
                      <span className="collection-card-title">
                        {part.title}
                      </span>
                      <span className="collection-card-year">
                        {part.release_date?.split('-')[0] || 'Upcoming'}
                      </span>
                    </div>
                    {part.id === movie.id && (
                      <div className="collection-now-badge">Viewing</div>
                    )}
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}

      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <div className="container-fluid">
            <h3 className="section-title">More Like This</h3>
            <div className="movie-grid">
              {recommendations.map((movie: any) => (
                <MovieCard key={movie.id} movie={movie} contentType={type} />
              ))}
            </div>
          </div>
        </div>
      )}

      {movie.reviews?.results?.length > 0 && (
        <div className="reviews-section">
          <div className="container-fluid">
            <h3 className="section-title">User Reviews</h3>
            <div className="reviews-grid">
              {movie.reviews.results.slice(0, 5).map((review: any) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <div className="author-avatar">
                      {review.author_details?.username?.[0].toUpperCase()}
                    </div>
                    <div className="author-info">
                      <span className="author-name">{review.author}</span>
                      <span className="review-date">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.author_details?.rating && (
                      <div className="review-stat">
                        ★ {review.author_details.rating}
                      </div>
                    )}
                  </div>
                  <div className="review-content">
                    <p>{review.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showTrailer && trailer && (
        <TrailerModal
          videoKey={trailer.key}
          onClose={() => setShowTrailer(false)}
        />
      )}

      {showPlayer && id && (
        <StreamingPlayer
          id={id}
          type={type}
          season={currentSeason}
          episode={currentEpisode}
          seasons={movie?.seasons}
          seasonData={seasonData}
          onSeasonChange={async (sNum) => {
            const data = await getTVSeason(id!, sNum)
            setSeasonData(data)
            setCurrentSeason(sNum)
            setCurrentEpisode(1)
          }}
          onEpisodeChange={(eNum) => {
            setCurrentEpisode(eNum)
          }}
          onClose={() => setShowPlayer(false)}
        />
      )}
    </div>
  )
}

export default MovieDetail
