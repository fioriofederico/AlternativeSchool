// Dependencies ===============
const deliveryFolders = {};

// State ======================

deliveryFolders.state = {
	tableId: 'deliveryFoldersTable',
	apiModule: 'courses',
	storeModule: 'courses',
	apiModuleTable: '',
	rows: [],
	item: {},
	fields: [{
		key: 'action',
		label: '',
		class: 'text-center',
		thAttr: {
			width: '50px'
		}
	}, {
		key: 'name',
		label: 'Nome del Modulo',
		sortable: true,
		sortDirection: 'desc',
	}, {
		key: 'startDeliveryTime',
		label: 'Data di Inizio',
		sortable: true,
		sortDirection: 'desc',
	}, {
		key: 'endDeliveryTime',
		label: 'Data di Termine',
		sortable: true,
		sortDirection: 'desc',
	}],
	toolBarButtonStudent: {
		backPageAddress: '/courses',
		backPage: true,
		filterOn: false,
		createOn: false,
		refreshOn: true,
		deleteOn: true,
	},
	toolBarButtonAdmin: {
		backPageAddress: '/allCourses',
		backPage: true,
		filterOn: false,
		createOn: true,
		refreshOn: true,
		deleteOn: true,
	},
	toolBarButtonTutor: {
		backPageAddress: '/courses',
		backPage: true,
		filterOn: false,
		createOn: true,
		refreshOn: true,
		deleteOn: true,
	}
}

// Mutations ==================

deliveryFolders.mutations = {
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

deliveryFolders.actions = {
	setIdModules(item){
		return deliveryFolders.state.apiModuleTable = 'courses/' + item + '/delivery_folders';
	},
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

deliveryFolders.getters = {
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

export default deliveryFolders
