import React, { useState } from 'react'
import '../css/StreamingPlayer.css'

interface StreamingPlayerProps {
  id: string | number
  type: 'movie' | 'tv'
  season?: number
  episode?: number
  onClose: () => void
  // TV specific props
  seasons?: any[]
  seasonData?: any
  onSeasonChange?: (s: number) => void
  onEpisodeChange?: (e: number) => void
}

const StreamingPlayer: React.FC<StreamingPlayerProps> = ({
  id,
  type,
  season = 1,
  episode = 1,
  onClose,
  seasons,
  seasonData,
  onSeasonChange,
  onEpisodeChange,
}) => {
  const [selectedServer, setSelectedServer] = useState(1)

  // Multi-CDN server list - Re-optimized for high availability
  const servers = [
    {
      id: 1,
      name: 'Server 1 (Primary)',
      url:
        type === 'movie'
          ? `https://vidsrc.to/embed/movie/${id}`
          : `https://vidsrc.to/embed/tv/${id}/${season}/${episode}`,
    },
    {
      id: 2,
      name: 'Server 2 (HD)',
      url:
        type === 'movie'
          ? `https://moviesapi.club/movie/${id}`
          : `https://moviesapi.club/tv/${id}-${season}-${episode}`,
    },
    {
      id: 3,
      name: 'Server 3 (Stable)',
      url:
        type === 'movie'
          ? `https://vidsrc.me/embed/movie?tmdb=${id}`
          : `https://vidsrc.me/embed/tv?tmdb=${id}&sea=${season}&epi=${episode}`,
    },
    {
      id: 4,
      name: 'Server 4 (Backup)',
      url:
        type === 'movie'
          ? `https://vidsrc.xyz/embed/movie/${id}`
          : `https://vidsrc.xyz/embed/tv/${id}/${season}/${episode}`,
    },
    {
      id: 5,
      name: 'Server 5 (Mirror)',
      url:
        type === 'movie'
          ? `https://www.2embed.cc/embed/${id}`
          : `https://www.2embed.cc/embedtv/${id}&s=${season}&e=${episode}`,
    },
  ]

  return (
    <div className="player-modal-overlay" onClick={onClose}>
      <div
        className="player-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="player-close-btn" onClick={onClose}>
          ✕
        </button>

        <div
          className="player-iframe-container"
          style={{ position: 'relative', background: '#000' }}
        >
          <div
            className="player-loading-text"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'rgba(255,255,255,0.3)',
              fontSize: '0.9rem',
              zIndex: 0,
            }}
          >
            🎬 Initializing stream, please wait...
          </div>
          <iframe
            src={servers.find((s) => s.id === selectedServer)?.url}
            title="Video Player"
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            frameBorder="0"
            scrolling="no"
            style={{ position: 'relative', zIndex: 1 }}
          ></iframe>
        </div>

        <div className="player-controls">
          <div className="server-list">
            <span className="server-label">Servers:</span>
            {servers.map((server) => (
              <button
                key={server.id}
                className={`server-btn ${selectedServer === server.id ? 'active' : ''}`}
                onClick={() => setSelectedServer(server.id)}
              >
                {server.name}
              </button>
            ))}
          </div>

          {/* Integrated Episode Selector for TV Shows */}
          {type === 'tv' && seasons && (
            <div className="player-tv-selector">
              <div className="player-season-tabs">
                {seasons
                  .filter((s: any) => s.season_number > 0)
                  .map((s: any) => (
                    <button
                      key={s.id}
                      className={`p-season-btn ${season === s.season_number ? 'active' : ''}`}
                      onClick={() => onSeasonChange?.(s.season_number)}
                    >
                      S{s.season_number}
                    </button>
                  ))}
              </div>
              <div className="player-episode-grid">
                {seasonData?.episodes?.map((ep: any) => (
                  <button
                    key={ep.id}
                    className={`p-ep-item ${episode === ep.episode_number ? 'active' : ''}`}
                    onClick={() => onEpisodeChange?.(ep.episode_number)}
                  >
                    <span className="p-ep-num">{ep.episode_number}</span>
                    <span className="p-ep-title">{ep.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="player-note mt-3">
            🚀 <strong>Tip:</strong> If the video freezes or doesn't load,
            switch to another server. Ad-blocker recommended.
          </p>
        </div>
      </div>
    </div>
  )
}

export default StreamingPlayer
