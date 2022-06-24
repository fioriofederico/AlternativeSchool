// Dependencies ===============
const coursesModules = {};

// State ======================

coursesModules.state = {
	tableId: 'coursesModulesTable',
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
		key: 'description',
		label: 'Descrizione del Modulo',
		sortable: true,
		sortDirection: 'desc',
	}],
	toolBarButtonAdmin: {
		backPageAddress: '/allCourses',
		backPage: true,
		filterOn: false,
		createOn: true,
		refreshOn: true,
		deleteOn: true,
	},
	toolBarButtonStudent: {
		backPageAddress: '/courses',
		backPage: true,
		filterOn: false,
		createOn: false,
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
	},
}

// Mutations ==================

coursesModules.mutations = {
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

coursesModules.actions = {
	setIdModules(item){
		return coursesModules.state.apiModuleTable = 'courses/' + item + '/modules';
	},
	setToolBar(pathBack, backOn, createOn){
		coursesModules.state.toolBarButton.backPageAddress = pathBack
		coursesModules.state.toolBarButton.backPage = backOn
		coursesModules.state.toolBarButton.createOn = createOn
		return coursesModules.state.toolBarButton
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

coursesModules.getters = {
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

export default coursesModules
