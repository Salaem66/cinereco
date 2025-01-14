// src/App.js
import React, { useState, useEffect } from 'react';
import TinderCard from 'react-tinder-card';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { fetchMovies, GENRES, GENRE_LABELS, fetchMovieDetails, fetchWatchProviders } from './services/tmdb';
import MovieModal from './components/MovieModal';
import './App.css';

function App() {
  // Étape 1 : Sélection des Genres
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [currentGenreIndex, setCurrentGenreIndex] = useState(GENRES.length - 1);
  const [genresCompleted, setGenresCompleted] = useState(false);

  // Étape 2 : Sélection de la Durée
  const [duration, setDuration] = useState(120);
  const [durationCompleted, setDurationCompleted] = useState(false);

  // Étape 3 : Affichage des Résultats
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Détails du film sélectionné
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Gestion du swipe sur les genres
  const handleSwipe = (direction, genre) => {
    if (direction === 'right' && selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genre.id]);
    }
    setCurrentGenreIndex(currentGenreIndex - 1);
  };

  // Déclenchement automatique après la sélection de 3 genres
  useEffect(() => {
    if (selectedGenres.length === 3) {
      setGenresCompleted(true);
    }
  }, [selectedGenres]);

  // Fonction pour valider la durée
  const validateDuration = () => {
    if (duration > 0) {
      setDurationCompleted(true);
    }
  };

  // Récupérer et trier les films
  useEffect(() => {
    const fetchAndSortMovies = async () => {
      if ((selectedGenres.length > 0 || genresCompleted) && durationCompleted) {
        setLoading(true);
        try {
          const joinedGenres = selectedGenres.length > 0 ? selectedGenres.join(',') : '';
          const fetchedMovies = await fetchMovies(joinedGenres, duration);
          const sortedMovies = sortMoviesByGenreMatch(fetchedMovies, selectedGenres);
          setMovies(sortedMovies);
          setShowResults(true);
        } catch (error) {
          console.error('Erreur lors de la récupération des films :', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchAndSortMovies();
  }, [selectedGenres, genresCompleted, durationCompleted, duration]);

  // Calculer le score de correspondance des genres
  const calculateGenreScore = (movie, selectedGenres) => {
    if (!movie.genre_ids) return 0;
    return movie.genre_ids.filter((gId) => selectedGenres.includes(gId)).length;
  };

  // Trier les films par score décroissant
  const sortMoviesByGenreMatch = (movies, selectedGenres) => {
    return movies.sort((a, b) => calculateGenreScore(b, selectedGenres) - calculateGenreScore(a, selectedGenres));
  };

  // Fonction pour gérer le clic sur une carte de film
  const handleMovieClick = async (movieId) => {
    try {
      const details = await fetchMovieDetails(movieId);
      const providers = await fetchWatchProviders(movieId);
      setSelectedMovie(details);
      setWatchProviders(providers);
      setModalOpen(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du film :', error);
    }
  };

  return (
    <div className="app-container">
      <h1>RecoCine - Trouve ton film parfait</h1>

      {/* Étape 1 : Sélection des Genres */}
      {!genresCompleted && (
        <div className="genre-selection">
          <h2>Swipe les genres qui t'intéressent (sélectionne jusqu'à 3 genres)</h2>
          <div className="card-container">
            {GENRES.map((genre, index) => (
              index === currentGenreIndex && (
                <TinderCard
                  className="swipe"
                  key={genre.id}
                  onSwipe={(dir) => handleSwipe(dir, genre)}
                  onCardLeftScreen={() => setCurrentGenreIndex(currentGenreIndex - 1)}
                  preventSwipe={['up', 'down']}
                >
                  <div className="genre-card">
                    <h3>{genre.name}</h3>
                  </div>
                </TinderCard>
              )
            ))}
          </div>
          <p>Genres sélectionnés : {selectedGenres.map(id => GENRE_LABELS[id]).join(', ')}</p>
          {/* Option pour terminer la sélection avant d'avoir 3 genres */}
          {selectedGenres.length > 0 && (
            <button onClick={() => setGenresCompleted(true)} className="validate-button">
              Terminer la sélection
            </button>
          )}
        </div>
      )}

      {/* Étape 2 : Sélection de la Durée */}
      {genresCompleted && !durationCompleted && (
        <div className="duration-selection">
          <h2>Combien de temps as-tu ?</h2>
          <div className="slider-container">
            <Slider
              min={10}
              max={300}
              step={10}
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
          <button onClick={validateDuration} className="validate-button">Valider</button>
        </div>
      )}

      {/* Étape 3 : Affichage des Résultats */}
      {showResults && (
        <div className="results-section">
          <h2>Résultats de la recherche</h2>
          {loading && <p>Chargement des films...</p>}
          {!loading && movies.length === 0 && <p>Aucun film trouvé avec ces critères.</p>}
          {!loading && movies.length > 0 && (
            <div className="movie-grid">
              {movies.map((movie) => (
                <div
                  className="movie-card"
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                      className="poster"
                    />
                  ) : (
                    <div className="poster placeholder">Pas d'affiche</div>
                  )}
                  <h3 className="movie-title">{movie.title}</h3>
                  {/* Tags de Genres */}
                  <div className="genre-tags">
                    {movie.genre_ids.map((gId) => (
                      <span key={gId} className="genre-tag">
                        {GENRE_LABELS[gId] || 'Inconnu'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Option pour réinitialiser la recherche */}
          <button onClick={() => {
            setGenresCompleted(false);
            setDurationCompleted(false);
            setSelectedGenres([]);
            setMovies([]);
            setShowResults(false);
          }} className="reset-button">
            Refaire une recherche
          </button>
        </div>
      )}

      {/* Composant Modal pour afficher les détails du film */}
      {modalOpen && (
        <MovieModal
          movie={selectedMovie}
          providers={watchProviders}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
