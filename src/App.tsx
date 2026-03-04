import { useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import ActorDetail from './pages/ActorDetail'
import Home from './pages/Home'
import Library from './pages/Library'
import MovieDetail from './pages/MovieDetail'
import Ratings from './pages/Ratings'
import Trending from './pages/Trending'

function App() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string | number>('')
  const [contentType, setContentType] = useState<'movie' | 'tv'>('movie')
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [year, setYear] = useState('')
  const [isFree, setIsFree] = useState(false)
  const [includeAdult, setIncludeAdult] = useState(false)

  const handleHomeClick = () => {
    setSearchQuery('')
    setSelectedGenre('')
    setSortBy('popularity.desc')
    setYear('')
    setIsFree(false)
    setIncludeAdult(false)
    navigate('/')
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query) {
      setSelectedGenre('')
      setSortBy('popularity.desc')
      setYear('')
      setIsFree(false)
      navigate('/')
    }
  }

  const handleGenreSelect = (genreId: string | number) => {
    setSelectedGenre(genreId)
    navigate('/')
    if (genreId) {
      setSearchQuery('')
      setIsFree(false)
    }
  }

  const handleTypeChange = (type: 'movie' | 'tv') => {
    setContentType(type)
    setSearchQuery('')
    setSelectedGenre('')
    setSortBy('popularity.desc')
    setYear('')
    setIsFree(false)
    navigate('/')
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    navigate('/')
    if (sort !== 'popularity.desc') setSearchQuery('')
  }

  const handleYearChange = (y: string) => {
    setYear(y)
    navigate('/')
    if (y) setSearchQuery('')
  }

  const handleFreeToggle = (free: boolean) => {
    setIsFree(free)
    navigate('/')
    if (free) setSearchQuery('')
  }

  const handleAdultToggle = (adult: boolean) => {
    setIncludeAdult(adult)
    navigate('/')
  }

  return (
    <main className="main-content">
      <Navbar
        onSearch={handleSearch}
        onGenreSelect={handleGenreSelect}
        contentType={contentType}
        onTypeChange={handleTypeChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        year={year}
        onYearChange={handleYearChange}
        selectedGenre={selectedGenre}
        isFree={isFree}
        onFreeToggle={handleFreeToggle}
        onHomeClick={handleHomeClick}
        includeAdult={includeAdult}
        onAdultToggle={handleAdultToggle}
      />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchQuery={searchQuery}
              selectedGenre={selectedGenre}
              contentType={contentType}
              sortBy={sortBy}
              year={year}
              isFree={isFree}
              includeAdult={includeAdult}
            />
          }
        />
        <Route path="/library" element={<Library />} />
        <Route path="/favorite" element={<Library />} />
        <Route path="/watchlist" element={<Library />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/ratings" element={<Ratings />} />
        <Route path="/movie/:id" element={<MovieDetail type="movie" />} />
        <Route path="/tv/:id" element={<MovieDetail type="tv" />} />
        <Route path="/person/:id" element={<ActorDetail />} />
      </Routes>
      <Footer />
    </main>
  )
}

export default App
