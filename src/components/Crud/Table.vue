<template>
	<div :id="this.id + '_table_wrap'">

		<b-table
			:id="id"
			:busy="isBusy"
			:striped="striped"
			:bordered="bordered"
			:items="staticList ? items : this.provider"
			:fields="fields"
			:current-page="getCurrentPage"
			:per-page="getPerPage"
			:filter="filter"
			:sticky-header="stickyHeader"
			:head-variant="headVariant"
			@row-selected="onRowSelected"
			@row-dblclicked="dbClicked"
			:emptyText="emptyText"
			:responsive="responsive"
			:emptyFilteredText="emptyFilteredText"
			:select-mode="selectMode"
			:selected-variant="selectVariant"
			show-empty
			:selectable="selectable"
			:no-border-collapse="noCollapse"
			:table-class="[{'text-nowrap': noWrap}, tableClass]"
			:tbody-tr-class="trClass"
			@sort-changed="this.setSorting"
		>
			<slot v-for="(_, name) in $slots" :name="name" :slot="name" />

			<template #table-busy>
				<div class="text-center text-info my-2">
					<b-spinner class="align-middle"></b-spinner>
					<strong></strong>
				</div>
			</template>

			<template
				v-for="(_, name) in $scopedSlots"
				:slot="name"
				slot-scope="slotData"
			>
				<slot :name="name" v-bind="slotData"/>
			</template>
		</b-table>

	</div>

</template>

<script>
import {bus} from '@/main';

export default {
	name: "Table",
	components: {

	},
	props: {
		id: {
			type: String,
			default: 'crudTable'
		},
		apiModule: String,
		storeModule: String,
		busy: {
			type: Boolean,
			default: false
		},
		noWrap: {
			type: Boolean,
			default: false
		},
		striped: {
			type: Boolean,
			default: true
		},
		stickyHeader: {
			type: [Boolean, String],
			default: '650px'
		},
		noCollapse: {
			type: Boolean,
			default: false
		},
		staticList: {
			type: Boolean,
			default: false
		},
		selectable: {
			type: Boolean,
			default: false
		},
		nopaging: {
			type: Boolean,
			default: false
		},
		bordered: {
			type: Boolean,
			default: true
		},
		responsive: {
			type: Boolean,
			default: true
		},
		headVariant: {
			type: String,
			default: 'dark'
		},
		selectMode: {
			type: String,
			default: 'range'
		},
		fields: {
			type: Array,
			required: true
		},
		items: {
			type: [Array, Function],
			default: null
		},
		currentPage: {
			type: [Number, String],
			default: 1
		},
		perPage: {
			type: [Number, String],
			default: 10
		},
		tableClass: [String, Array, Object],
		trClass: [String, Array, Object, Function],
		filter: Object,
		sortBy: String,
		sortDesc: Boolean,
		onRowSelected: Function,
		onFiltered: {
			type: Function,
			default: () => {}
		},
		dbClicked: {
			type: Function,
			default: () => {}
		},
		sortingChanged: Function,
		emptyText: {
			type: String,
			default: "Non ci sono elementi da mostrare."
		},
		emptyFilteredText: {
			type: String,
			default: "Non ci sono elementi da mostrare."
		},
		selectVariant: {
			type: String,
			default: "warning"
		}
	},
	data() {
		return {
			isBusy: false
		}
	},
	computed: {
		getPerPage() {
			return this.$store.getters[`${this.storeModule}/getPerPage`]
		},
		getCurrentPage() {
			return this.$store.getters[`${this.storeModule}/getCurrentPage`]
		},
		totalRows() {
			return this.$store.getters[`${this.storeModule}/totalRows`]
		}
	},
	methods: {
		/**
		 * Questa funzione serve per passare tra child e parent il dato della
		 * pagina selezionata.
		 * Il valore della funzione viene utilizzatocome valore della proprietà
		 * selectedPage del component Pagination.
		 * La sudddetta proprietà è passata come una funzione che aspetta dal chld
		 * il valore di ritorno. Il figlio deve ritornare il valore per mezzo
		 * della funzione $emit.
		 *
		 * @page {int} Numero di pagina selezionato
		 * @return int
		 */
		async currentPageSelected(page) {
			const currentPage = await this.$store.dispatch(this.storeModule + '/setCurrentPage', page)
			return currentPage
		},
		/**
		 *  Questa funzione serve per passare tra child e parent quanti
		 * elementi mostrare per pagina. Il valore della funzione viene utilizzato
		 * come valore della proprietà perPageSelected del component Pagination.
		 * La sudddetta proprietà è passata come una funzione che aspetta dal chld
		 * il valore di ritorno. Il figlio deve ritornare il valore per mezzo
		 * della funzione $emit
		 *
		 * @perPage {int} Quanti elementi mostrare per pagina
		 * @return int
		 */
		async perPageSelected(perPage) {
			const items = await this.$store.dispatch(this.storeModule + '/setPerPage', perPage)
			return items
		},
		async provider(ctx) {
			this.isBusy = true;
			// Imposta i filtri da passase alla funzione che genera la lista
			ctx.apiUrl   = this.apiModule;

			// Ordinamento di default
			ctx.sortBy   = this.$store.getters[`${this.storeModule}/getSortBy`];
			ctx.sortDesc = this.$store.getters[`${this.storeModule}/getSortDesc`];

			// Tenta di generare la lista
			var response = await this.$store.dispatch('getList', ctx)
			if(response) {
				// Numero totale di righe ritornate dalla query
				this.$store.commit(`${this.storeModule}/SET_TOTAL_ROWS`, response.data.total_rows)

				// Righe ritornate dalla query
				this.$store.commit(`${this.storeModule}/ROWS`, response.data)
				// Da ripristinare con le vere API
				// this.$store.commit(`${this.storeModule}/ROWS`, response.data.rows)

				this.isBusy = false;
				return response.data
				// return response.data.rows
			} else {
				throw`[AMV] lack of response in list`;
			}

		},
		setSorting(ctx) {
			this.$store.dispatch(`${this.storeModule}/setCurrentPage`, 1 );
			this.$store.commit(`${this.storeModule}/SET_SORT_BY`, ctx.sortBy );
			this.$store.commit(`${this.storeModule}/SET_SORT_DESC`, ctx.sortDesc);
		},
	},
	mounted() {
		bus.$on('submitFilters', async () => {
			// Resetta il parametro della paginazione quando viene inviato il
			// form dei filtri per partire sempre dalla prima pagina.
			await this.$store.dispatch(`${this.storeModule}/setCurrentPage`, 1 );

			// Aggiorna la tabella. Il refresh della tabella comporta una chiamata
			//  alle API con i filtraggi settati.
			this.$root.$emit('bv::refresh::table', this.id)
		})
	},
}
</script>


<style>
.actions--menu {
    display: flex;
    align-content: center;
    justify-content: space-between;
}
</style>
