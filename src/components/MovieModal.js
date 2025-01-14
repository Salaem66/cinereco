// src/components/MovieModal.js
import React from 'react';
import './MovieModal.css';

function MovieModal({ movie, providers, onClose }) {
  if (!movie) return null;

  // Filtrer les plateformes disponibles en France (FR)
  const flatrate = providers?.results?.FR?.flatrate || [];
  const buy = providers?.results?.FR?.buy || [];
  const rent = providers?.results?.FR?.rent || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="modal-header">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="modal-poster"
            />
          ) : (
            <div className="modal-poster placeholder">Pas d'affiche</div>
          )}
          <div className="modal-info">
            <h2>{movie.title}</h2>
            <p><strong>Date de sortie :</strong> {movie.release_date}</p>
            <p><strong>Note :</strong> {movie.vote_average}/10</p>
            <p><strong>Résumé :</strong> {movie.overview}</p>
            <p><strong>Genres :</strong> {movie.genres.map(g => g.name).join(', ')}</p>
          </div>
        </div>
        <div className="modal-providers">
          <h3>Plateformes Disponibles en France</h3>
          {flatrate.length > 0 && (
            <div>
              <h4>Streaming</h4>
              <div className="providers-list">
                {flatrate.map(provider => (
                  <img
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                    alt={provider.provider_name}
                    title={provider.provider_name}
                    className="provider-logo"
                  />
                ))}
              </div>
            </div>
          )}
          {buy.length > 0 && (
            <div>
              <h4>Acheter</h4>
              <div className="providers-list">
                {buy.map(provider => (
                  <img
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                    alt={provider.provider_name}
                    title={provider.provider_name}
                    className="provider-logo"
                  />
                ))}
              </div>
            </div>
          )}
          {rent.length > 0 && (
            <div>
              <h4>Location</h4>
              <div className="providers-list">
                {rent.map(provider => (
                  <img
                    key={provider.provider_id}
                    src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                    alt={provider.provider_name}
                    title={provider.provider_name}
                    className="provider-logo"
                  />
                ))}
              </div>
            </div>
          )}
          {flatrate.length === 0 && buy.length === 0 && rent.length === 0 && (
            <p>Aucune plateforme disponible en France pour ce film.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieModal;
