// src/services/tmdb.js

/**
 * Mapping ID -> label (pour l’affichage)
 */
export const GENRE_LABELS = {
  28: 'Action',
  12: 'Aventure',
  16: 'Animation',
  35: 'Comédie',
  80: 'Crime',
  99: 'Documentaire',
  18: 'Drame',
  10751: 'Famille',
  14: 'Fantastique',
  36: 'Histoire',
  27: 'Horreur',
  10402: 'Musique',
  9648: 'Mystère',
  10749: 'Romance',
  878: 'Science-Fiction',
  10770: 'Téléfilm',
  53: 'Thriller',
  10752: 'Guerre',
  37: 'Western',
  // Ajoute d'autres genres si nécessaire
};

/**
 * Liste des genres disponibles pour la sélection
 * Format: { id: number, name: string }
 */
export const GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Aventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comédie' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentaire' },
  { id: 18, name: 'Drame' },
  { id: 10751, name: 'Famille' },
  { id: 14, name: 'Fantastique' },
  { id: 36, name: 'Histoire' },
  { id: 27, name: 'Horreur' },
  { id: 10402, name: 'Musique' },
  { id: 9648, name: 'Mystère' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science-Fiction' },
  { id: 10770, name: 'Téléfilm' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'Guerre' },
  { id: 37, name: 'Western' },
  // Ajoute d'autres genres si nécessaire
];

/**
 * Clé API TMDb
 * Utilise la variable d'environnement REACT_APP_TMDB_API_KEY
 */
const API_KEY = "6ef7318d02f41956a25c992eb066a580";

if (!API_KEY) {
  console.error('Erreur : REACT_APP_TMDB_API_KEY n\'est pas défini dans le fichier .env');
}

/**
 * URL de base pour les requêtes TMDb
 */
const BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Appel à l’API TMDb pour récupérer les films selon les genres et la durée
 * 
 * @param {string} genreIds - Liste des IDs de genres séparés par des virgules (ex. "28,35,99")
 * @param {number} duration - Durée maximale des films en minutes
 * @returns {Promise<Array>} - Tableau de films
 */
export async function fetchMovies(genreIds, duration) {
  try {
    let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=fr-FR&sort_by=popularity.desc&with_runtime.lte=${duration}`;

    if (genreIds) {
      url += `&with_genres=${genreIds}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur TMDb lors de la récupération des films : ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('fetchMovies Error:', error);
    throw error;
  }
}

/**
 * Récupère les détails complets d'un film depuis TMDb
 * @param {number} movieId - ID du film
 * @returns {Promise<Object>} - Détails du film
 */
export async function fetchMovieDetails(movieId) {
  try {
    const url = `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=fr-FR`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur TMDb lors de la récupération des détails du film : ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('fetchMovieDetails Error:', error);
    throw error;
  }
}

/**
 * Récupère les plateformes de diffusion d'un film depuis TMDb
 * @param {number} movieId - ID du film
 * @returns {Promise<Object>} - Plateformes de diffusion
 */
export async function fetchWatchProviders(movieId) {
  try {
    const url = `${BASE_URL}/movie/${movieId}/watch/providers?api_key=${API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur TMDb lors de la récupération des plateformes : ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('fetchWatchProviders Error:', error);
    throw error;
  }
}
