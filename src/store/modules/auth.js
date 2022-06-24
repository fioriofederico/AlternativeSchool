// Dependencies ===============
import jwtDecode from "jwt-decode";

import moment from 'moment';
import 'moment/locale/it';
moment.locale('it');

import {api} from '@/scripts/api-service';

import router from '@/router'

const auth = {};

// State ======================

auth.state = {
	authorized: false,
	user: null,
	decodedJWT: null,
	loginError: '',
	signupError: '',
	confirm: false,
	confirmError: '',
	accessToken: false,
	refreshToken: false,
	expiresIn: null,
	toShow: 'LoginForm',
	landingPage: 'allCourses',
	landingPageTutor: 'courses',
	landingPageAccess: ''
}

// Mutations ==================

auth.mutations = {
	authorized(state, decodedJWT) {
		state.authorized = !!decodedJWT
	},
	user(state, user) {
		state.user = user
	},
	confirm(state, showConfirm) {
		state.confirm = !!showConfirm
	},
	loginError(state, message) {
		state.loginError = message
	},
	accessToken(state, payload) {
		state.accessToken = payload
	},
	refreshToken(state, payload) {
		state.refreshToken = payload
	},
	decodedJWT(state, payload) {
		state.decodedJWT = payload
	},
	expiresIn(state, payloads) {
		state.expiresIn = payloads
	}
}

// Actions ====================

auth.actions = {
	/**
	 *
	 * @param {object} param0
	 * @param {object} param1  Email e password dell'utente
	 */
	async register({
					state,
					commit
				}, {
					username,
					password,
					name,
					surname,
					email,
					roles
				}) {
		try {
			const session = await api.post( 'auth/register' , {
				username: username,
				password: password,
				name: name,
				surname: surname,
				email: email,
				roles: [roles],
			});


			if(session?.status && session.status == '200') {
				// Dai il messaggio di benvenuto all'utente appena loggato.
				this._vm.$bvToast.toast('Ora procedere dalla login page per accedere', {
					title: `Registrazione effettuato con successo`,
					autoHideDelay: 2500,
					appendToast: true,
					variant: 'success'
				});

				router.push({
					name: state.landingPage
				});

			}
		} catch (err) {
				this._vm.$bvToast.toast(`Username o Email già associata ad un utente, si prega di cambiare i dati o di effettuare l'accesso`, {
					title: 'Operazione non Riuscita',
					autoHideDelay: 2000,
					appendToast: true,
					variant: 'danger'
				})
			commit('registeError', err)
		}
	},
	async login({
		state,
		commit,
		dispatch
	}, {
		username,
		password
	}) {
		try {
			const session = await api.post( 'auth/login' , {
				username: username,
				password: password,
			});

			if(session?.status && session.status == '200') {
				// Dai il messaggio di benvenuto all'utente appena loggato.
				this._vm.$bvToast.toast(`Stai per essere reindirizzato all'applicazione`, {
					title: `Login effettuato con successo`,
					autoHideDelay: 2500,
					appendToast: true,
					variant: 'success'
				});

				// Reindirizza alla URL presente nella risposta
				await dispatch('fetchUser', {
					accessToken: session.data.token,
					idUser: session.data.id,
					userName: session.data.username,
					email: session.data.email,
					role: session.data.roles[0],
				})
				if(session.data.roles[0] == 'ROLE_TUTOR'){
					router.push({
						name: state.landingPageTutor
					});
				}else {
					router.push({
						name: state.landingPage
					});
				}

			}
		} catch (err) {
			commit('loginError', err)
		}
	},
	/**
	 * Sulla base del token di sessione passato recupera i dati dell'utente ed
	 * effettua l'auto login al reefresh della pagina per mezzo della chiamata
	 * fatta dal file App.vue.
	 *
	 * Occorre in questa funzione verificare la scadenza del token di sessione,
	 * in modo da poter rigenerarlo o effettuare il logout dell'utente.
	 *
	 * @param {object} param0
	 * @param {object} param1 Vengono passatti rispettivamente il token di sessione
	 * 						con i dati dell'utente, ed il refresh token che serve a
	 * 						rigenerare il primo
	 */
	async fetchUser(
		{state, commit, dispatch},
		{
			accessToken: accessToken,
			idUser: idUser,
			userName: userName,
			email: email,
			role: role,
		}
	){
		// Se uno dei due token non viene passato o è falso, sbatti fuori l'utente
		if(!accessToken) {
			dispatch('logout', state.user);
			return;
		}

		// Aggiornata nello store dell'applicazione il token di sessione
		// con i dati dell'utente
		commit('accessToken', accessToken)

		// Decodifica il token di sessione
		commit('decodedJWT', jwtDecode(accessToken))

		// Calcola tra quanti secondi il token scade
		const expiresIn = state.decodedJWT.exp - moment.utc().format('X');

		// Salva i dati importanti nel localStorage
		localStorage.setItem('accessToken', state.accessToken);


		// Conserva i dati dell'utente nello store
		commit('user', {
			id: idUser,
			username: userName,
			email: email,
			role: role,
		})

		// Verfica se l'utente è attivo o meno
		commit('authorized', state.decodedJWT)

		// Conserva nello store i tra quanti secondi scade il token di sessione
		commit('expiresIn', expiresIn)

		// Verifica se il token è da rigenerare
		dispatch('autoLogin')

		return true;
	},
	async autoLogin({dispatch}) {
		// Se nel local storage non esiste l'access token sabtti fuori l'utente
		if(!localStorage.getItem('accessToken')) {
			dispatch('logout');
			return;
		}

		// Decodifica il token per recuperare i dati al suo interno
		const decodedJWT = jwtDecode(localStorage.getItem('accessToken'));

		// Tra quanti secondi scade il token
		// const expiresIn = decodedJWT.exp - moment.utc().format('X')

		if (!decodedJWT.exp) {
			dispatch('logout');
			return;
		}

		// Alla scadenza del token prova a rigenerarlo in maniera automatica
		// in modo da autenticare in automatico l'utente evitandogli di effettuare
		// nuovamente il login.
		// setTimeout(() => {
		// 	dispatch('refreshToken', localStorage.getItem('refreshToken'));
		// }, expiresIn * 1000);

	},
	async refreshToken({dispatch}, refreshToken) {

		const res = await api.query('auth/refresh', {
			params: {
				refresh_token: refreshToken
			}
		});

		// Se la rigenerazione del token non è andata a buon fine. Sbatti
		// l'utente fuori
		if (res.data?.access_token) {
			// Salva i dati dell'utente e autenticalo con i nuovi dati
			dispatch('fetchUser', {
				accessToken: res.data.access_token,
				refreshToken: refreshToken
			})
		} else {
			dispatch('logout')
			return;
		}

	},
	async logout({
		commit
	}) {

		commit('user', null)
		commit('accessToken', null)
		// commit('refreshToken', null)

		// localStorage.removeItem('refreshToken');
		localStorage.removeItem('accessToken');
		localStorage.removeItem('user');

		// Ritorna alla pagina di login
		router.replace({
			name: 'login'
		});
	},
}

// Getters ====================

auth.getters = {
	user(state) {
		return state.user
	},
	authorized(state) {
		return state.authorized
	},
	getDecodedJWT(state) {
		return state.decodedJWT
	},
	getAccessToken(state) {
		return state.accessToken
	},
	isAuthenticated(state) {
		return state.accessToken !== null && state.authorized
	},
	loading(state, rootState, rootGetters) {
		return rootGetters.loading;
	}
}

// Export =====================

export default auth
