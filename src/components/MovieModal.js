import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MovieModal.css';

function MovieModal({ movie, providers, onClose }) {
  if (!movie) return null;

  // Filtrer les plateformes disponibles en France (FR)
  const flatrate = providers?.flatrate || [];
  const buy = providers?.buy || [];
  const rent = providers?.rent || [];

  const getProviderUrl = (providerName) => {
    switch (providerName.toLowerCase()) {
      case 'amazon prime video':
        return 'https://www.primevideo.com';
      case 'amazon video':
         return 'https://www.primevideo.com';
      case 'microsoft store':
        return 'https://www.microsoft.com/';
      case 'netflix':
        return 'https://www.netflix.com';
      case 'disney plus':
        return 'https://www.disneyplus.com';
      case 'canal+':
        return 'https://www.canalplus.com';
      case 'apple tv':
        return 'https://tv.apple.com';
      case 'ocs':
        return 'https://www.ocs.fr';
      case 'arte':
        return 'https://www.arte.tv';
      case 'france.tv':
        return 'https://www.france.tv';
      // Ajoutez d'autres cas pour les plateformes supplémentaires
      default:
        return null;
    }
  };

  const renderProviders = (providerList, type) => {
    if (providerList.length === 0) return null;

    return (
      <div>
        <h4>{type === 'flatrate' ? 'Streaming' : type === 'buy' ? 'Acheter' : 'Location'}</h4>
        <div className="providers-list">
          {providerList.map(provider => {
            const providerUrl = getProviderUrl(provider.provider_name);
            return (
              <a
                key={provider.provider_id}
                href={providerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="provider-link"
                title={`Visiter ${provider.provider_name}`}
              >
                <img
                  src={`https://image.tmdb.org/t/p/w200${provider.logo_path}`}
                  alt={provider.provider_name}
                  className="provider-logo"
                />
              </a>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay" 
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="modal-content" 
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 500 }}
        >
          <motion.button 
            className="close-button" 
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            &times;
          </motion.button>
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
              <p><strong>Note :</strong> {movie.vote_average.toFixed(1)}/10</p>
              <p><strong>Résumé :</strong> {movie.overview}</p>
              <p><strong>Genres :</strong> {movie.genres.map(g => g.name).join(', ')}</p>
            </div>
          </div>
          <div className="modal-providers">
            <h3>Plateformes Disponibles en France</h3>
            {renderProviders(flatrate, 'flatrate')}
            {renderProviders(buy, 'buy')}
            {renderProviders(rent, 'rent')}
            {flatrate.length === 0 && buy.length === 0 && rent.length === 0 && (
              <p>Aucune plateforme disponible en France pour ce film.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default MovieModal;

