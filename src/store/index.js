import Vue from 'vue'
import Vuex from 'vuex'
import VueSwal from 'vue-swal'
import vueVimeoPlayer from 'vue-vimeo-player'
import VuePlyr from 'vue-plyr/dist/vue-plyr.ssr.js'
import 'vue-plyr/dist/vue-plyr.css'
// Router
import router from './../router'

// Module
import modules from './modules'

// -------------------------------

// Utilities
import _forIn from 'lodash/forIn'

// -------------------------------

// Classe per la gestione delle chiamate api
import {api} from './../scripts/api-service'

// Vue instance
Vue.use(Vuex)
const vm = new Vue()
Vue.use(VueSwal)
Vue.use(vueVimeoPlayer)
Vue.use(VuePlyr, {
	plyr: {}
})

// -------------------------------
export default new Vuex.Store({
	state: {
		pageIcon: null,
		pageName: null,
		isSingle: false,
		hasInfo: false,
		disableInfo: false,
		menuCollapsed: false,
		alert: {
			show: false,
			message: '',
			variant: 'danger'
		},
		userRoles: {
			dev: 'Develop',
			master: 'Master',
			admin: 'Amminstratore',
			operator: 'Operatore'
		},
		formSize: 'md',
		caledarLabel: {
			labelPrevYear: 'Anno precedente',
			labelPrevMonth: 'Mese precedente',
			labelCurrentMonth: 'Mese attuale',
			labelNextMonth: 'Mese successivo',
			labelNextYear: 'Anno successivo',
			labelToday: 'Oggi',
			labelNoDateSelected: 'Nessuna data selezionata',
			labelCalendar: 'Calendario',
			labelHelp: 'Usa le i bottoni in alto per navigare nel calendario '
		},
		dateRangeSettings: {
			firstDay: 1,
			format: 'dd/mm/yyyy',
			separator: ' - ',
			applyLabel: 'Applica',
			cancelLabel: 'Cancella',
			customRangeLabel: 'Personalizzata',
			daysOfWeek: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
			monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto',
				'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
			]
		},
		sidebarWidth: '200px'
	},
	mutations: {
		ALERT(state, payload) {
			return state.alert = payload
		},
		PAGE_NAME(state, payload) {
			return state.pageName = payload
		},
		PAGE_ICON(state, payload) {
			return state.pageIcon = payload
		},
		SET_HAS_INFO(state, payload) {
			return state.hasInfo = payload
		},
		SET_DISABLE_INFO(state, payload) {
			return state.disableInfo = payload
		},
		SET_MENU_COLLAPSED(state, payload) {
			return state.menuCollapsed = payload
		}
	},
	actions: {
		async getList(ctx, options) {
			try {
				/**
				 * Paramtri da passare come query string all'API
				 */
				let params = {
					// Numero di pagina
					page: options.currentPage,
					for_page: options.perPage,
				};

				// Prendi solo i filtri impostati
				if (options ?.filter) {
					_forIn(options.filter, (value, key) => {
						if (value) {
							params[key] = value;
						}
					})
				}

				if (options ?.sortBy) {
					// Se è impostato l'order by aggiungilo alla query string.
					const sortVerse = options.sortDesc ? 'DESC' : 'ASC';

					params.sort_by = `${options.sortBy}:${sortVerse}`
				}

				// Chiamata all'API per la restituzione della lista
				return await api.query(
					`${options.apiUrl}`,
					Object.entries(params).reduce((a, [k, v]) => (v ? (a[k] = v, a) : a), {})
				)

			} catch (error) {
				throw `getList Api: ${error}`;
			}
		},
		async deleteItem(ctx, {
			id,
			apiModule,
			name
		}) {
			const res = await vm.$swal({
				icon: 'warning',
				title: `Cancellazione: ${name}`,
				dangerMode: true,
				buttons: {
					cancel: "Annulla",
					confirm: "Conferma",
				},
				width: '50rem'
			})

			if (res === true) {
				const deleted = await api.delete(apiModule, id);

				if (deleted.status == 200) {
					vm.$swal({
						title: 'Elemento cancellato',
						icon: 'success'
					});
					return true
				} else {
					this._vm.$bvToast.toast(deleted.data.message.error, {
						title: `Cancellazione non avvenuta`,
						autoHideDelay: 5000,
						appendToast: true,
						variant: 'danger'
					})
					return false
				}
			}
		},
		async getItem(ctx, {
			resource,
			slug
		}) {
			return await api.get(resource, slug);
		},
		async getDataChat(ctx, {
			resource
		}) {
			return await api.getDataChat(resource);
		},

		async downloadFile(ctx, {
			resource,
			slug
		}) {
			return await api.download(resource, slug);
		},
		async query(ctx, {
			resource,
			params
		}) {
			return await api.query(resource, params);
		},
		async post(ctx, {
			resource,
			params
		}) {
			return await api.post(resource, params);
		},
		async postEnroll(ctx, {
			resource
		}) {
			return await api.post(resource);
		},
		async postCertifcate(ctx, {
			resource
		}) {
			return await api.postCertficate(resource);
		},
		async put(ctx, {
			resource,
			params
		}) {
			return await api.put(resource, params);
		},
		async update(ctx, {
			resource,
			slug,
			params
		}) {
			return await api.update(resource, slug, params);
		},
		async showLoader(ctx, refs) {
			return await this._vm.$loading.show({
				container: refs
			})
		},
		async showAlert({
			commit
		}, {
			show,
			message,
			variant
		}) {
			commit('ALERT', {
				show: show,
				message: message,
				variant: variant,
			})
		},
		async pageName({
			commit
		}, name) {
			commit('PAGE_NAME', name)
		},
		async pageIcon({
			commit
		}, icon) {
			commit('PAGE_ICON', icon)
		},
		async generatePassword({
			dispatch
		}, piece = 4) {
			const passwordBlock = [];
			let string = ''

			for (let i = 0; i < piece; i++) {
				do {
					string = await dispatch('randomString', {
						length: 4,
						chars: '#aA'
					})
				} while (!dispatch('isAlphaNumeric', string));
				passwordBlock.push(string)
			}

			return passwordBlock.join('-')
		},
		isAlphaNumeric(ctx, str) {
			return /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)+$/gi.test(str)
		},
		async randomString(ctx, {
			length,
			chars
		}) {
			var mask = '';
			if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
			if (chars.indexOf('#') > -1) mask += '0123456789';
			if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
			var result = '';
			for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
			return result;
		},
		filterRangeDate(ctx, {
			val,
			filters,
			filterKey,
			isDatetime = false
		}) {
			const startDay = (val.startDate.getDate() < 10 ? '0' : '') + val.startDate.getDate();
			const startMonth = ((val.startDate.getMonth() + 1) < 10 ? '0' : '') + (val.startDate.getMonth() + 1);

			const endDay = (val.endDate.getDate() < 10 ? '0' : '') + val.endDate.getDate();
			const endMonth = ((val.endDate.getMonth() + 1) < 10 ? '0' : '') + (val.endDate.getMonth() + 1);

			let gteTime = isDatetime ? '00:00:00' : '';
			let lteTime = isDatetime ? '23:59:59' : '';

			if (val.startDate) {
				this._vm.$set(
					filters, `${filterKey}:gte`,
					`${val.startDate.getFullYear()}-${startMonth}-${startDay} ${gteTime}`
				);
			}

			if (val.endDate) {
				this._vm.$set(
					filters, `${filterKey}:lte`, `${val.endDate.getFullYear()}-${endMonth}-${endDay} ${lteTime}`
				);
			}
		},
		async showToast(ctx, {
			toast,
			options
		}) {
			return await this._vm.$bvToast.toast(toast.message, {
				title: toast.title,
				autoHideDelay: options ?.autoHideDelay ?? 5000,
				appendToast: true,
				variant: options ?.variant ?? 'info',
				noCloseButton: options ?.noCloseButton ?? true,
				toaster: options ?.position ?? 'b-toaster-bottom-right',
				solid: options ?.solid ?? false,
			});
		},
		async showInfoList({
			commit,
			dispatch
		}, list) {
			// Nascondi di il bottone info
			commit('SET_DISABLE_INFO', true);

			const count = list.length - 1;

			list.forEach((item, i) => {
				setTimeout(() => {
					dispatch(
						'showToast', {
							toast: item,
							options: {
								position: 'b-toaster-top-right',
								solid: true
							}
						}
					);
					if (i == count) {
						commit('SET_DISABLE_INFO', false);
					}
				}, 5000 * i);
			});
		},
		async setInfoCookie({
			dispatch,
			commit
		}, {
			infoList,
			cookieName
		}) {
			// Mosrta l'icona per mostrare le info
			commit('SET_HAS_INFO', true)
			// Controlla se è settato il cookie che indica che le info di
			// questo modulo sono state lette. Se noo, allora mostrale e
			// imposta il suddetto cookie a true per evitare che
			// all'utente vengano mostrare di continuo questi toast
			// ad ogni visita della pagina
			if (
				this._vm.$cookies.get(cookieName) == null ||
				this._vm.$cookies.get(cookieName) != 'true'
			) {
				// Setta
				this._vm.$cookies.set(cookieName, true, -1);
				dispatch('showInfoList', infoList);
			}
		},
		goBack({
			state
		}) {
			window.history.length > 1 ? router.go(-1) : router.push(state.landingPage)
		}
	},
	getters: {
		hasInfo(state) {
			return state.hasInfo
		},
		disableInfo(state) {
			return state.disableInfo
		},
		alert(state) {
			return state.alert
		},
		pageName(state) {
			return state.pageName
		},
		pageIcon(state) {
			return state.pageIcon
		},
		userRole() {
			return modules.auth.getters.user
		},
		defaultRangeDate(state) {
			let today = new Date()
			today.setHours(0, 0, 0, 0)

			let yesterday = new Date()
			yesterday.setDate(today.getDate() - 1)
			yesterday.setHours(0, 0, 0, 0);

			const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1)
			const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0)

			return state.defaultRangeDate = {
				"Oggi": [today, today],
				"Ieri": [yesterday, yesterday],
				"Questo mese": [thisMonthStart, thisMonthEnd],
				"Mese scorso": [new Date(today.getFullYear(), today.getMonth() - 1, 1), new Date(today.getFullYear(),
					today.getMonth(), 0)],
				"Quest'anno": [new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 11, 31)],
				"Anno scorso": [new Date(today.getFullYear() - 1, 0, 1), new Date(today.getFullYear() - 1, 11, 31)],
			}
		},
		menuCollapsed(state) {
			return state.menuCollapsed
		},
		marginCollapsed(state) {
			return state.menuCollapsed ? {
				'margin-left': '50px'
			} : {
				'margin-left': state.sidebarWidth
			}
		}
	},
	modules
})
