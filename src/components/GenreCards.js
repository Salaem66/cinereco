import React from 'react';
import TinderCard from 'react-tinder-card';

const GenreCards = ({ genres, currentGenreIndex, handleSwipe, selectedGenres, setGenresCompleted, MAX_SELECTED_GENRES, GENRE_LABELS }) => {
  return (
    <div className="genre-selection">
      <h2>Swipe les genres qui t'intéressent</h2>
      <div className="card-container">
        {genres.map((genre, index) => (
          index === currentGenreIndex && (
            <TinderCard
              className="swipe"
              key={genre.id}
              onSwipe={(dir) => handleSwipe(dir, genre)}
              preventSwipe={['up', 'down']}
            >
              <div 
                className="genre-card"
                style={{
                  backgroundImage: `url(https://source.unsplash.com/featured/?${genre.name.toLowerCase()},movie)`
                }}
              >
                <h3>{genre.name}</h3>
              </div>
            </TinderCard>
          )
        ))}
      </div>
      <p className="infoText">Genres sélectionnés : {selectedGenres.map(id => GENRE_LABELS[id]).join(', ')}</p>
      {selectedGenres.length > 0 && (
        <button 
          onClick={() => setGenresCompleted(true)} 
          className="validate-button"
        >
          Terminer la sélection ({selectedGenres.length}/{MAX_SELECTED_GENRES})
        </button>
      )}
    </div>
  );
};

export default GenreCards;

