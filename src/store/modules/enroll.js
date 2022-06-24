// Dependencies ===============

const enroll = {};

// State ======================

enroll.state = {
	tableId: 'enrollTable',
	apiModule: 'courses',
	storeModule: 'courses',
	apiModuleTableRemoveStudent: '',
	apiModuleTableStudent: '',
	rows: [],
	totalRows: 0,
	currentPage: 1,
	perPage: 10,
	filters: {},
	sortBy: 'id',
	sortDesc: true,
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
		label: 'Nome dello Studente',
		sortable: true,
		sortDirection: 'desc',
	}, {
		key: 'surname',
		label: 'Cognome dello Studente',
		sortable: true,
		sortDirection: 'desc',
	}, {
		key: 'certificateEnabled',
		label: 'Certificato Abilitato',
		sortable: true,
		sortDirection: 'desc',
	}],
	toolBarButton: {
		backPage: true,
		backPageAddress: '/courses',
		filterOn: false,
		createOn: false,
		refreshOn: true,
		deleteOn: true,
	},toolBarButtonAdmin: {
		backPage: true,
		backPageAddress: '/allCourses',
		filterOn: false,
		createOn: false,
		refreshOn: true,
		deleteOn: true,
	}
}

// Mutations ==================

enroll.mutations = {
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
	},
}

// Actions ====================

enroll.actions = {
	setPathEnRollStudentCourses(item){
		return enroll.state.apiModuleTableStudent = 'courses/' + item + '/students';
	},
	setPathEnRollRemoveStudentCourses(item){
		return enroll.state.apiModuleTableRemoveStudent = 'courses/' + item + '/unenroll';
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

enroll.getters = {
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

export default enroll
