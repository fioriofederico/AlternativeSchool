// Dependencies ===============
const users = {};

// State ======================

users.state = {
	tableId: 'usersTable',
	apiModule: 'users',
	storeModule: 'users',
	rows: [],
	item: {},
	fields: [{
		key: 'name',
		label: 'Nome',
		sortable: true,
		sortDirection: 'desc',
	}, {
		key: 'surname',
		label: 'Cognome',
		sortable: true,
		sortDirection: 'desc',
	}, {
		key: 'username',
		label: 'Username',
		sortable: true,
		sortDirection: 'desc',
	}, {
		key: 'email',
		label: 'Email'
	}, {
		key: 'roles',
		label: 'Ruolo'
	}],
	toolBarButton: {
		filterOn: false,
		createOn: false,
		refreshOn: true,
		deleteOn: true,
	}
}

// Mutations ==================

users.mutations = {
	'ROWS'(state, rows) {
		return state.rows = rows
	},
	'SET_SORT_BY'(state, payload) {
		return state.sortBy = payload;
	},
	'SET_SORT_DESC'(state, payload) {
		return state.sortDesc = payload;
	},
	'SET_FILTERS'(state, payload) {
		return state.filters = payload;
	},
	'CURRENT_PAGE'(state, page) {
		return state.currentPage = page
	},
	'PER_PAGE'(state, perPage) {
		return state.perPage = perPage
	},
	'SET_TOTAL_ROWS'(state, totalRows) {
		return state.totalRows = totalRows
	},
	'ITEM'(state, item) {
		return state.item = {
			...item
		}
	}
}

// Actions ====================

users.actions = {
	async setCurrentPage({
		commit,
		getters
	}, page) {
		await commit('CURRENT_PAGE', page)
		return getters.getCurrentPage
	},
	async setPerPage({
		commit,
		getters
	}, perPage) {
		await commit('PER_PAGE', perPage)
		return getters.getPerPage
	},
	async resetFilter({
		commit
	}, filters) {
		await commit('SET_FILTERS', filters)
	},
	async filtersChange({
		commit
	}) {
		await commit('CURRENT_PAGE', 1)
	},
}
// Getters ====================

users.getters = {
	totalRows(state) {
		return state.totalRows
	},
	rows(state) {
		return state.rows
	},
	getFields(state) {
		return state.fields
	},
	getFilters(state) {
		return state.filters
	},
	getCurrentPage(state) {
		return state.currentPage
	},
	getPerPage(state) {
		return state.perPage
	},
	getSortBy(state) {
		return state.sortBy
	},
	getSortDesc(state) {
		return state.sortDesc
	},
	item(state) {
		return state.item
	}
}
// Export =====================

export default users
