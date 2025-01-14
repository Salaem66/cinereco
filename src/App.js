import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TinderCard from 'react-tinder-card';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { fetchMovies, GENRES, GENRE_LABELS, fetchMovieDetails, fetchWatchProviders, isAvailableInFrance } from './services/tmdb';
import MovieModal from './components/MovieModal';
import './App.css';

const MAX_SELECTED_GENRES = 3;
const MIN_DURATION = 10;
const MAX_DURATION = 300;
const DURATION_STEP = 10;
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w200';
const MIN_POPULARITY = 40;

function App() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentGenreIndex, setCurrentGenreIndex] = useState(GENRES.length - 1);
  const [genresCompleted, setGenresCompleted] = useState(false);
  const [duration, setDuration] = useState(120);
  const [durationCompleted, setDurationCompleted] = useState(false);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSwipe = useCallback((direction, genre) => {
    if (direction === 'right' && selectedGenres.length < MAX_SELECTED_GENRES) {
      setSelectedGenres(prevGenres => [...prevGenres, genre.id]);
    }
    setCurrentGenreIndex(prevIndex => prevIndex - 1);
  }, [selectedGenres]);

  useEffect(() => {
    if (selectedGenres.length === MAX_SELECTED_GENRES) {
      setGenresCompleted(true);
    }
  }, [selectedGenres]);

  const validateDuration = useCallback(() => {
    if (duration > 0) {
      setDurationCompleted(true);
    }
  }, [duration]);

  const fetchAndFilterMovies = useCallback(async () => {
    if ((selectedGenres.length > 0 || genresCompleted) && durationCompleted) {
      setLoading(true);
      try {
        const joinedGenres = selectedGenres.length > 0 ? selectedGenres.join(',') : '';
        const fetchedMovies = await fetchMovies(joinedGenres, duration, 'FR', MIN_POPULARITY);
        
        // Filtrer les films disponibles en France
        const availableMovies = await Promise.all(
          fetchedMovies.map(async (movie) => {
            const isAvailable = await isAvailableInFrance(movie.id);
            return isAvailable ? movie : null;
          })
        );
        
        const filteredMovies = availableMovies.filter(movie => movie !== null);
        const sortedMovies = sortMoviesByGenreMatchAndRating(filteredMovies, selectedGenres);
        setMovies(sortedMovies);
        setShowResults(true);
      } catch (error) {
        console.error('Erreur lors de la récupération des films :', error);
      } finally {
        setLoading(false);
      }
    }
  }, [selectedGenres, genresCompleted, durationCompleted, duration]);

  useEffect(() => {
    fetchAndFilterMovies();
  }, [fetchAndFilterMovies]);

  const calculateGenreScore = useCallback((movie, selectedGenres) => {
    if (!movie.genre_ids) return 0;
    return movie.genre_ids.filter((gId) => selectedGenres.includes(gId)).length;
  }, []);

  const sortMoviesByGenreMatchAndRating = useCallback((movies, selectedGenres) => {
    return movies.sort((a, b) => {
      const scoreA = calculateGenreScore(a, selectedGenres);
      const scoreB = calculateGenreScore(b, selectedGenres);
      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return b.vote_average - a.vote_average;
    });
  }, [calculateGenreScore]);

  const handleMovieClick = useCallback(async (movieId) => {
    try {
      const details = await fetchMovieDetails(movieId);
      const providers = await fetchWatchProviders(movieId);
      setSelectedMovie(details);
      setWatchProviders(providers);
      setModalOpen(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du film :', error);
    }
  }, []);

  return (
    <motion.div 
      className="app-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>RecoCine - Trouve ton film parfait</h1>

      <AnimatePresence mode="wait">
        {!genresCompleted && (
          <motion.div 
            key="genre-selection"
            className="genre-selection"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <h2>Swipe les genres qui t'intéressent (sélectionne jusqu'à {MAX_SELECTED_GENRES} genres)</h2>
            <div className="card-container">
              {GENRES.map((genre, index) => (
                index === currentGenreIndex && (
                  <TinderCard
                    className="swipe"
                    key={genre.id}
                    onSwipe={(dir) => handleSwipe(dir, genre)}
                    onCardLeftScreen={() => setCurrentGenreIndex(prevIndex => prevIndex - 1)}
                    preventSwipe={['up', 'down']}
                  >
                    <motion.div 
                      className="genre-card"
                      whileTap={{ scale: 0.95 }}
                    >
                      <h3>{genre.name}</h3>
                    </motion.div>
                  </TinderCard>
                )
              ))}
            </div>
            <p>Genres sélectionnés : {selectedGenres.map(id => GENRE_LABELS[id]).join(', ')}</p>
            {selectedGenres.length > 0 && (
              <motion.button 
                onClick={() => setGenresCompleted(true)} 
                className="validate-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Terminer la sélection
              </motion.button>
            )}
          </motion.div>
        )}

        {genresCompleted && !durationCompleted && (
          <motion.div 
            key="duration-selection"
            className="duration-selection"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <h2>Combien de temps as-tu ?</h2>
            <div className="slider-container">
              <Slider
                min={MIN_DURATION}
                max={MAX_DURATION}
                step={DURATION_STEP}
                value={duration}
                onChange={(val) => setDuration(val)}
                trackStyle={{ backgroundColor: '#3498db', height: 6 }}
                railStyle={{ backgroundColor: '#ccc', height: 6 }}
                handleStyle={{
                  borderColor: '#3498db',
                  height: 24,
                  width: 24,
                  marginLeft: -12,
                  marginTop: -9,
                  backgroundColor: '#fff',
                }}
              />
              <p>{duration} min</p>
            </div>
            <motion.button 
              onClick={validateDuration} 
              className="validate-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Valider
            </motion.button>
          </motion.div>
        )}

        {showResults && (
          <motion.div 
            key="results-section"
            className="results-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Résultats de la recherche</h2>
            {loading && <p>Chargement des films...</p>}
            {!loading && movies.length === 0 && <p>Aucun film trouvé avec ces critères.</p>}
            {!loading && movies.length > 0 && (
              <motion.div 
                className="movie-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {movies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    className="movie-card"
                    onClick={() => handleMovieClick(movie.id)}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {movie.poster_path ? (
                      <img
                        src={`${POSTER_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        className="poster"
                      />
                    ) : (
                      <div className="poster placeholder">Pas d'affiche</div>
                    )}
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="genre-tags">
                      {movie.genre_ids.map((gId) => (
                        <span key={gId} className="genre-tag">
                          {GENRE_LABELS[gId] || 'Inconnu'}
                        </span>
                      ))}
                    </div>
                    <div className="movie-rating">
                      <span className="star">⭐</span>
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            <motion.button 
              onClick={() => {
                setGenresCompleted(false);
                setDurationCompleted(false);
                setSelectedGenres([]);
                setMovies([]);
                setShowResults(false);
              }} 
              className="reset-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Refaire une recherche
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {modalOpen && (
        <MovieModal
          movie={selectedMovie}
          providers={watchProviders}
          onClose={() => setModalOpen(false)}
        />
      )}
    </motion.div>
  );
}

export default App;

