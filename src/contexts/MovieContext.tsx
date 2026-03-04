import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'

interface Movie {
  id: number
  title?: string
  name?: string
  poster_path: string
  backdrop_path: string
  vote_average: number
  release_date?: string
  first_air_date?: string
  overview: string
  contentType?: 'movie' | 'tv'
  timestamp?: number
  isWatched?: boolean
}

interface MovieContextType {
  favorites: Movie[]
  watchlist: Movie[]
  ratings: Record<number, number>
  watchHistory: Movie[]
  addToFavorites: (movie: Movie) => void
  removeFromFavorites: (movie: Movie) => void
  isFavorite: (id: number) => boolean
  addToWatchlist: (movie: Movie) => void
  removeFromWatchlist: (movie: Movie) => void
  isInWatchlist: (id: number) => boolean
  setUserRating: (id: number, rating: number) => void
  addToWatchHistory: (movie: Movie) => void
  markAsWatched: (movie: Movie) => void
  clearWatchHistory: () => void
  searchHistory: string[]
  addToSearchHistory: (query: string) => void
  clearSearchHistory: () => void
}

const MovieContext = createContext<MovieContextType | undefined>(undefined)

export const useMovieContext = () => {
  const context = useContext(MovieContext)
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider')
  }
  return context
}

export const MovieProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<Movie[]>([])
  const [watchlist, setWatchlist] = useState<Movie[]>([])
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const [watchHistory, setWatchHistory] = useState<Movie[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const storedFavs = localStorage.getItem('movie-favorites')
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs))
      } catch (e) {
        console.error('Failed to parse favorites', e)
      }
    }

    const storedWatch = localStorage.getItem('movie-watchlist')
    if (storedWatch) {
      try {
        setWatchlist(JSON.parse(storedWatch))
      } catch (e) {
        console.error('Failed to parse watchlist', e)
      }
    }

    const storedRatings = localStorage.getItem('movie-ratings')
    if (storedRatings) {
      try {
        setRatings(JSON.parse(storedRatings))
      } catch (e) {
        console.error('Failed to parse ratings', e)
      }
    }

    const storedHistory = localStorage.getItem('movie-search-history')
    if (storedHistory) {
      try {
        setSearchHistory(JSON.parse(storedHistory))
      } catch (e) {
        console.error('Failed to parse search history', e)
      }
    }

    const storedWatchHistory = localStorage.getItem('movie-watch-history')
    if (storedWatchHistory) {
      try {
        setWatchHistory(JSON.parse(storedWatchHistory))
      } catch (e) {
        console.error('Failed to parse watch history', e)
      }
    }
  }, [])

  // Save to localStorage whenever collections change
  useEffect(() => {
    localStorage.setItem('movie-favorites', JSON.stringify(favorites))
  }, [favorites])

  useEffect(() => {
    localStorage.setItem('movie-watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  useEffect(() => {
    localStorage.setItem('movie-ratings', JSON.stringify(ratings))
  }, [ratings])

  useEffect(() => {
    localStorage.setItem('movie-search-history', JSON.stringify(searchHistory))
  }, [searchHistory])

  useEffect(() => {
    localStorage.setItem('movie-watch-history', JSON.stringify(watchHistory))
  }, [watchHistory])

  const addToFavorites = (movie: Movie) => {
    if (!favorites.find((fav) => fav.id === movie.id)) {
      setFavorites((prev) => [...prev, movie])
    }
  }

  const removeFromFavorites = (movie: Movie) => {
    setFavorites((prev) => prev.filter((fav) => fav.id !== movie.id))
  }

  const isFavorite = (id: number) => {
    return favorites.some((fav) => fav.id === id)
  }

  const addToWatchlist = (movie: Movie) => {
    if (!watchlist.find((w) => w.id === movie.id)) {
      setWatchlist((prev) => [...prev, movie])
    }
  }

  const removeFromWatchlist = (movie: Movie) => {
    setWatchlist((prev) => prev.filter((w) => w.id !== movie.id))
  }

  const isInWatchlist = (id: number) => {
    return watchlist.some((w) => w.id === id)
  }

  const setUserRating = (id: number, rating: number) => {
    setRatings((prev) => ({ ...prev, [id]: rating }))
  }

  const addToWatchHistory = (movie: Movie) => {
    setWatchHistory((prev) => {
      // Use Number() to ensure type consistency even if IDs come from params
      const movieId = Number(movie.id)
      const existing = prev.find((m) => Number(m.id) === movieId)

      // Only preserve isWatched if it was already true for this item
      const isWatched = existing?.isWatched === true || movie.isWatched === true
      const filtered = prev.filter((m) => Number(m.id) !== movieId)

      return [
        { ...movie, id: movieId, timestamp: Date.now(), isWatched },
        ...filtered,
      ].slice(0, 20)
    })
  }

  const markAsWatched = (movie: Movie) => {
    setWatchHistory((prev) => {
      const movieId = Number(movie.id)
      const filtered = prev.filter((m) => Number(m.id) !== movieId)
      return [
        { ...movie, id: movieId, timestamp: Date.now(), isWatched: true },
        ...filtered,
      ].slice(0, 20)
    })
  }

  const clearWatchHistory = () => {
    setWatchHistory([])
  }

  const addToSearchHistory = (query: string) => {
    if (!query.trim()) return
    setSearchHistory((prev) => {
      const filtered = prev.filter((h) => h !== query)
      return [query, ...filtered].slice(0, 5)
    })
  }

  const clearSearchHistory = () => {
    setSearchHistory([])
  }

  return (
    <MovieContext.Provider
      value={{
        favorites,
        watchlist,
        ratings,
        watchHistory,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        setUserRating,
        addToWatchHistory,
        markAsWatched,
        clearWatchHistory,
        searchHistory,
        addToSearchHistory,
        clearSearchHistory,
      }}
    >
      {children}
    </MovieContext.Provider>
  )
}
