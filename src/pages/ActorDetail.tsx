import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import MovieCard from '../components/MovieCard'
import '../css/ActorDetail.css'
import { getPersonDetails } from '../servies/api'

const ActorDetail = () => {
  const { id } = useParams()
  const [person, setPerson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const fetchActor = async () => {
      setLoading(true)
      try {
        if (id) {
          const data = await getPersonDetails(id)
          setPerson(data)
        }
      } catch (err) {
        console.error(err)
        setError('Failed to load actor details')
      } finally {
        setLoading(false)
      }
    }
    fetchActor()
    window.scrollTo(0, 0)
  }, [id])

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2>Loading actor bio...</h2>
      </div>
    )

  if (error || !person)
    return (
      <div className="error-container">
        <div className="error-message">
          <h3>Oops!</h3>
          <p>{error || 'Actor not found'}</p>
          <Link to="/" className="btn-premium">
            Go Home
          </Link>
        </div>
      </div>
    )

  const knownFor =
    person.combined_credits?.cast
      ?.sort((a: any, b: any) => b.vote_count - a.vote_count)
      ?.slice(0, 8) || []

  return (
    <div className="actor-detail-container">
      <div className="actor-header-bg">
        {knownFor[0]?.backdrop_path && (
          <img
            src={`https://image.tmdb.org/t/p/original${knownFor[0].backdrop_path}`}
            alt="background"
            className="actor-bg-img"
          />
        )}
      </div>

      <div className="actor-content">
        <div className="actor-sidebar">
          <img
            src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
            alt={person.name}
            className="actor-profile-img"
          />
          <div className="actor-personal-info">
            <h3>Personal Info</h3>
            <div className="info-item">
              <span className="label">Known For</span>
              <span className="value">{person.known_for_department}</span>
            </div>
            {person.birthday && (
              <div className="info-item">
                <span className="label">Birthday</span>
                <span className="value">{person.birthday}</span>
              </div>
            )}
            {person.place_of_birth && (
              <div className="info-item">
                <span className="label">Place of Birth</span>
                <span className="value">{person.place_of_birth}</span>
              </div>
            )}
            {person.deathday && (
              <div className="info-item">
                <span className="label">Day of Death</span>
                <span className="value">{person.deathday}</span>
              </div>
            )}
          </div>
        </div>

        <div className="actor-main-info">
          <h1>{person.name}</h1>

          <div className="biography-section">
            <h3>Biography</h3>
            <p className={`biography-text ${isExpanded ? 'expanded' : ''}`}>
              {person.biography ||
                `We don't have a biography for ${person.name}.`}
            </p>
            {person.biography?.length > 500 && (
              <button
                className="read-more-btn"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </button>
            )}
          </div>

          {knownFor.length > 0 && (
            <div className="known-for-section">
              <h3>Known For</h3>
              <div className="movie-grid">
                {knownFor.map((item: any) => (
                  <MovieCard
                    key={`${item.id}-${item.media_type}`}
                    movie={item}
                    contentType={item.media_type}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ActorDetail
