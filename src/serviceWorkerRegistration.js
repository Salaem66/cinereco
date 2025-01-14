// Extrait simplifié, avec le code généré par Create React App
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    window.location.hostname === '[::1]' ||
    window.location.hostname.match(
      /^127(?:\.[0-9]+){0,2}\.[0-9]+$/
    )
);

export function register(config) {
  if ('serviceWorker' in navigator) {
    // On vérifie si l’URL est en HTTPS
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Mode localhost : on vérifie l’existence du SW
        checkValidServiceWorker(swUrl, config);
        navigator.serviceWorker.ready.then(() => {
          console.log('Le service worker est prêt (localhost).');
        });
      } else {
        // En production : on enregistre directement
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('Service Worker enregistré : ', registration);
    })
    .catch(error => {
      console.error('Erreur lors de l’enregistrement du SW :', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, { headers: { 'Service-Worker': 'script' } })
    .then(response => {
      // On vérifie que le SW existe (status=200)
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType && contentType.indexOf('javascript') === -1)
      ) {
        // Pas trouvé => on recharge la page
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Trouvé => on enregistre le SW
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Pas de connexion internet, l’appli fonctionne hors-ligne.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(err => {
        console.error(err.message);
      });
  }
}
