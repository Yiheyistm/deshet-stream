const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL

export const getPopularMovies = async (page: number = 1) => {
  const response = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
  )
  const data = await response.json()
  return data
}

export const searchMovies = async (
  query: string,
  page: number = 1,
  includeAdult: boolean = false
) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&page=${page}&include_adult=${includeAdult}`
  )
  const data = await response.json()
  return data
}

export const getMovieDetails = async (id: string | number) => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos,credits,images,reviews`
  )
  const data = await response.json()
  return data
}

export const getGenres = async () => {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
  )
  const data = await response.json()
  return data.genres
}

export const getMoviesByGenre = async (
  genreId: string | number,
  page: number = 1
) => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`
  )
  const data = await response.json()
  return data
}

export const getRecommendations = async (id: string | number) => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}/recommendations?api_key=${API_KEY}`
  )
  const data = await response.json()
  return data.results
}

// TV SHOWS API
export const getPopularTV = async (page: number = 1) => {
  const response = await fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`
  )
  const data = await response.json()
  return data
}

export const searchTV = async (
  query: string,
  page: number = 1,
  includeAdult: boolean = false
) => {
  const response = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${query}&page=${page}&include_adult=${includeAdult}`
  )
  const data = await response.json()
  return data
}

export const getTVDetails = async (id: string | number) => {
  const response = await fetch(
    `${BASE_URL}/tv/${id}?api_key=${API_KEY}&append_to_response=videos,credits,images,reviews`
  )
  const data = await response.json()
  return data
}

export const getTVGenres = async () => {
  const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`)
  const data = await response.json()
  return data.genres
}

export const getTVRecommendations = async (id: string | number) => {
  const response = await fetch(
    `${BASE_URL}/tv/${id}/recommendations?api_key=${API_KEY}`
  )
  const data = await response.json()
  return data.results
}

export const discoverMovies = async (
  page: number = 1,
  sortBy: string = 'popularity.desc',
  genre: string | number = '',
  year: string = '',
  isFree: boolean = false,
  includeAdult: boolean = false
) => {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}&include_adult=${includeAdult}`
  if (genre) url += `&with_genres=${genre}`
  if (year) url += `&primary_release_year=${year}`
  if (isFree) url += `&with_watch_monetization_types=free&watch_region=US`

  const response = await fetch(url)
  const data = await response.json()
  return data
}

export const discoverTV = async (
  page: number = 1,
  sortBy: string = 'popularity.desc',
  genre: string | number = '',
  year: string = '',
  isFree: boolean = false,
  includeAdult: boolean = false
) => {
  let url = `${BASE_URL}/discover/tv?api_key=${API_KEY}&page=${page}&sort_by=${sortBy}&include_adult=${includeAdult}`
  if (genre) url += `&with_genres=${genre}`
  if (year) url += `&first_air_date_year=${year}`
  if (isFree) url += `&with_watch_monetization_types=free&watch_region=US`

  const response = await fetch(url)
  const data = await response.json()
  return data
}
export const getPersonDetails = async (id: string | number) => {
  const response = await fetch(
    `${BASE_URL}/person/${id}?api_key=${API_KEY}&append_to_response=combined_credits,external_ids`
  )
  const data = await response.json()
  return data
}

export const getCollection = async (id: string | number) => {
  const response = await fetch(
    `${BASE_URL}/collection/${id}?api_key=${API_KEY}`
  )
  const data = await response.json()
  return data
}

export const getTrending = async (
  mediaType: 'all' | 'movie' | 'tv' = 'all',
  timeWindow: 'day' | 'week' = 'day',
  page: number = 1
) => {
  const response = await fetch(
    `${BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${API_KEY}&page=${page}`
  )
  const data = await response.json()
  return data
}

export const getWatchProviders = async (
  id: string | number,
  type: 'movie' | 'tv' = 'movie'
) => {
  const response = await fetch(
    `${BASE_URL}/${type}/${id}/watch/providers?api_key=${API_KEY}`
  )
  const data = await response.json()
  // Prefer US, fallback to first available region
  const results = data.results || {}
  return results.US || results[Object.keys(results)[0]] || null
}

export const searchMulti = async (
  query: string,
  page: number = 1,
  includeAdult: boolean = false
) => {
  const response = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}&page=${page}&include_adult=${includeAdult}`
  )
  const data = await response.json()
  return data
}

export const getTVSeason = async (id: string | number, season: number) => {
  const response = await fetch(
    `${BASE_URL}/tv/${id}/season/${season}?api_key=${API_KEY}`
  )
  const data = await response.json()
  return data
}
