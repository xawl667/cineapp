import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Films from './pages/Films/Films'
import FilmDetail from './pages/FilmDetail/FilmDetail'
import Favoris from './pages/Favoris/Favoris'
import NotFound from './pages/NotFound/NotFound'
import { useState } from 'react'

function App() {
  const [favoris, setFavoris] = useState([])

  const toggleFavori = (film) => {
    setFavoris(prev =>
      prev.find(f => f.id === film.id)
        ? prev.filter(f => f.id !== film.id)
        : [...prev, film]
    )
  }

  const isFavori = (id) => favoris.some(f => f.id === id)

  return (
    <>
      <Navbar nbFavoris={favoris.length} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/films" element={<Films toggleFavori={toggleFavori} isFavori={isFavori} />} />
        <Route path="/films/:id" element={<FilmDetail toggleFavori={toggleFavori} isFavori={isFavori} />} />
        <Route path="/favoris" element={<Favoris favoris={favoris} toggleFavori={toggleFavori} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
