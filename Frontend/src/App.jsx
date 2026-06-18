import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import Films from './pages/Films/Films'
import FilmDetail from './pages/FilmDetail/FilmDetail'
import Favoris from './pages/Favoris/Favoris'
import NotFound from './pages/NotFound/NotFound'
import Register from './pages/Register/register'
import Login from './pages/Login/login'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'
import Profile from './pages/Profile/profile'
import Watchlist from './pages/Watchlist/Watchlist'
import Mood from './pages/Mood/Mood'
import Feed from './pages/Feed/Feed'
import UserProfile from './pages/UserProfile/UserProfile'
import Watched from './pages/Watched/Watched'
import { useFavoris } from './hooks/useFavoris'
import { useWatchlist } from './hooks/useWatchlist'

function App() {
  const { favoris, toggleFavori, isFavori } = useFavoris()
  const { watchlist, toggleWatchlist, isInWatchlist } = useWatchlist()

  return (
    <>
      <Navbar nbFavoris={favoris.length} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/films" element={
          <Films
            toggleFavori={toggleFavori}
            isFavori={isFavori}
            toggleWatchlist={toggleWatchlist}
            isInWatchlist={isInWatchlist}
          />
        } />
        <Route path="/films/:id" element={
          <FilmDetail
            toggleFavori={toggleFavori}
            isFavori={isFavori}
            toggleWatchlist={toggleWatchlist}
            isInWatchlist={isInWatchlist}
          />
        } />
        <Route path="/favoris" element={
          <ProtectedRoute>
            <Favoris favoris={favoris} toggleFavori={toggleFavori} />
          </ProtectedRoute>
        } />
        <Route path="/watchlist" element={
          <ProtectedRoute>
            <Watchlist watchlist={watchlist} toggleWatchlist={toggleWatchlist} />
          </ProtectedRoute>
        } />
        <Route path="/mood" element={
          <ProtectedRoute>
            <Mood
              toggleFavori={toggleFavori}
              isFavori={isFavori}
              toggleWatchlist={toggleWatchlist}
              isInWatchlist={isInWatchlist}
            />
          </ProtectedRoute>
        } />
        <Route path="/feed" element={
          <ProtectedRoute>
            <Feed />
          </ProtectedRoute>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/users/:id" element={<UserProfile />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/watched" element={
          <ProtectedRoute>
            <Watched />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App