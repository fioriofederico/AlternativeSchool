import store from '@/store'
import {
  includes
} from 'lodash';

// This pages not requires authentication
const noAuthPages = ['login', 'manageAuth', 'error404', 'disabledUser'];

export function beforeResolve(to, next) {
  // Casi in cui si entra nell'IF:
  // 1) ricarica della pagina da parte dell'utente;
  // 2) l'utente risulta non autenticato.
  //
  // 1) In questo caso le varibili di store (vuex) dell'applicazione vengono
  // azzerata e quindi bisogna riautenticare l'utente.
  // 2) se durante la navigazione dell'app l'untente non risulta più autenticato
  // allora siprova a fare l'autologin
  if (
    !includes(noAuthPages, to.name) &&
    !store.getters['auth/isAuthenticated']
  ) {
    /**
     * Operazionni da eseguire ogni volta che l'App viene creata
     */
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // Prova ad autenticare l'utente
    store.dispatch('auth/fetchUser', {
      accessToken: accessToken,
      refreshToken: refreshToken
    })

    if (store.getters['auth/isAuthenticated']) {
      /**
       * Verifica se è possibile visitare la route da utenti con ruoli o permessi
       * specifici. Se la meta value authorize non è settata sulla route
       * vuol dire che quest'ultima può essere visitata da tutti.
       */
      if (
        to?.authorize &&
        store.getters['auth/user']?.role &&
        !includes(to.authorize, store.getters['auth/user'].role)
      ) {
        next({
          name: 'error404'
        })
      } else {
        next()
      }
    } else {
      // Non è stato possibile ri-autenticare l'untente, neanche per mezzo
      // del refresh token. Non rimane altro che effettuare il logout.
      // store.dispatch('auth/logout');
      next();
    }
  } else {
    next()
  }
}