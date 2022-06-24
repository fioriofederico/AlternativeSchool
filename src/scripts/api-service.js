import Vue from 'vue'
import axios from 'axios';
import Qs from 'qs';
import store from './../store'

const vm = new Vue()

// -------------------------------

export default class ApiService {

	url = '';
	newAxios = null;

	constructor(url) {
		this.url = url ?? process.env.VUE_APP_API_GLOBAL_URL;

		this.instance();
		this.interceptorsReq();
		this.interceptorsRes();

	}

	instance() {
		this.newAxios = axios.create({
			baseURL: this.url
		});
	}

	query(resource, params) {
		return this.newAxios.get(`/${resource}`, {
			params: params
		}).catch(error => {
			console.error(`[AMV] ApiService query ${error}`);
		});
	}

	get(resource, slug = "") {
		return this.newAxios.get(`/${resource}/${slug}`).catch(error => {
			console.error(`[AMV] ApiService get ${error}`);
		});
	}

	getDataChat(resource) {
		return this.newAxios.get(`/${resource}`).catch(error => {
			console.error(`[AMV] ApiService get ${error}`);
		});
	}

	download(resource, slug = "") {
		return this.newAxios.get(`/${resource}/${slug}`).catch(error => {
			console.error(`[AMV] ApiService get ${error}`);
		});
	}

	async postCertficate(resource) {
		return await this.newAxios.post(`/${resource}`);
	}

	async post(resource, params) {
		return await this.newAxios.post(`/${resource}`, params);
	}

	async update(resource, slug, params) {
		return await this.newAxios.put(`/${resource}/${slug}`, params);
	}

	async put(resource, params) {
		return await this.newAxios.put(`/${resource}`, params);
	}

	async delete(resource, slug) {
		return await this.newAxios.delete(`/${resource}/${slug}`);
	}

	// Configurazione per ogni richiesta che passa da axios
	interceptorsReq() {
		this.newAxios.interceptors.request.use(config => {

			config.paramsSerializer = (params) => {
				return Qs.stringify(params, {
					arrayFormat: 'brackets'
				})
			};

			if (localStorage.getItem('accessToken')) {
				// Non includere nel header delle chiamate alle route di auth il token
				config.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;
			}

			return config
		})
	}

	// Configurazione per ogni risposta che proviene da axios
	interceptorsRes() {
		this.newAxios.interceptors.response.use(function (response) {
			// Any status code that lie within the range of 2xx cause this function to trigger
			// Do something with response data
			return response;
		}, function (error) {
			try {
				if (error.response) {
					//Not Found
					if (error.response.status == 404) {
						store.dispatch('showAlert', {
							show: 5,
							message: 'La risorsa che stai chiamando non esiste. Contatta l\'amministratore di sistema per ulteriori dettagli.',
							variant: 'danger'
						})
					}

					// Forbbiden
					if (error.response.status == 403) {
						store.dispatch('showAlert', {
							show: 5,
							message: `${error.response.data.messages.error}. Contatta l'amministratore di sistema per ulteriori dettagli.`,
							variant: 'danger'
						})
					}

					// Sbatti fuori l'utente in quanto sta tentando di accedere
					// a risorse che non sono proprie o manca delle autorizzazioni
					// necessarie per continuare
					if (error.response.status == 401) {
						store.dispatch('auth/logout')
					}

					// Gestisci gli errori provenienti dai form
					if (
						(
							error.response.config.method == 'delete' ||
							error.response.config.method == 'post' ||
							error.response.config.method == 'put'
						) &&
						error.response.status == 400
					) {
						vm.$bvToast.toast(error.response.data.messages.error, {
							title: `Si è verificato un errore`,
							autoHideDelay: 5000,
							appendToast: true,
							variant: 'danger'
						})

						// Da abilitare in caso di ritorno di errori multipli
						// for (const field in error.response.data.messages) {
						// 	if (Object.hasOwnProperty.call(error.response.data.messages, field)) {
						// 		const message = error.response.data.messages[field];
						// 		vm.$bvToast.toast(message, {
						// 			title: `Si è verificato un errore`,
						// 			autoHideDelay: 5000,
						// 			appendToast: true,
						// 			variant: 'danger'
						// 		})
						// 	}
						// }
					}

					// Gestisci gli errori provenienti dai form
					if (error.response.status == 500) {
						store.dispatch('showAlert', {
							show: 5,
							message: 'Si è verificato un errore tecnico. Contatta l\'amministratore di sistema per ulteriori dettagli.',
							variant: 'danger'
						})
					}

					return error.response;

				}
			} catch (error) {
				// Something happened in setting up the request that triggered an Error
				throw `ApiService response ${error}`;
			}
		});
	}
}

export const api = new ApiService();
