<template>
	<div ref="main">

		<Toolbar :info="info" :idTable="tableId" :tools="toolBarButton" :bulk="bulkActions"/>

		<Table
			:apiModule="apiModule"
			:storeModule="storeModule"
			:id="tableId"
			:noWrap="true"
			:busy="isBusy"
			:noCollapse="true"
			:fields="fields"
			:items="rows"
			:filter="filters"
			:current-page="getCurrentPage"
			:per-page="getPerPage"
			:sortBy="sortBy"
			:sortDesc="sortDesc"
			:onRowSelected="onRowSelected"
		>
		<!-- Bottoni di azione sulla riga della tabella -->
			<template v-slot:cell(roles)="row">
				{{row.item.roles[0]}}
			</template>

			<!-- Bottoni di azione sulla riga della tabella -->
			<template v-slot:cell(action)="row">
				<div class="actions--menu">
					<div class="action--menu">
						<b-button
							v-b-tooltip.hover
							title="Cancella"
							size="sm"
							variant="link"
							@click="itemDelete(row.item)"
						>
							<font-awesome-icon class="action--item action-delete text-danger" icon="trash" />
						</b-button>
					</div>
				</div>
			</template>
		</Table>
	</div>
</template>

<script>
	import Table from '@/components/Crud/Table.vue'
	import Toolbar from '@/components/Crud/Toolbar.vue'

	import {
		mapGetters, mapState
	} from 'vuex'

	export default {
		name: 'Users',
		components: {
			Table,
			Toolbar,
		},
		data() {
			return {
				pageTitle: 'Utenti',
				apiRequest: 'post',
				bulkActions: false,
				isBusy: true,
				rows: []
			}
		},
		computed: {
			...mapGetters({
				filters       : 'users/getFilters',
				fields        : 'users/getFields',
				getCurrentPage: 'users/getCurrentPage',
				getPerPage    : 'users/getPerPage',
				sortBy        : 'users/getSortBy',
				sortDesc      : 'users/getSortDesc'
			}),
			...mapState({
				tableId      : state => state.users.tableId,
				toolBarButton: state => state.users.toolBarButton,
				apiModule    : state => state.users.apiModule,
				storeModule  : state => state.users.storeModule,
				userRoles    : state => state.userRoles
			}),
		},
		methods: {
			onRowSelected(items) {
				this.bulkActions = items.length > 1 ? true : false;
			},
			async provider() {
				const ctx = {};

				this.isBusy = true;

				// Imposta i filtri da passase alla funzione che genera la lista
				ctx.apiUrl      = this.apiModule;

				// Ordinamento di default
				ctx.sortBy   = this.$store.getters[`${this.storeModule}/getSortBy`];
				ctx.sortDesc = this.$store.getters[`${this.storeModule}/getSortDesc`];

				// Tenta di generare la lista
				const response = await this.$store.dispatch('getList', ctx)

				if(response) {
					// Numero totale di righe ritornate dalla query
					this.$store.commit(`${this.storeModule}/SET_TOTAL_ROWS`, response.data.length)

					// Righe ritornate dalla query
					this.$store.commit(`${this.storeModule}/ROWS`, response.data)
					// Da ripristinare con le vere API
					// this.$store.commit(`${this.storeModule}/ROWS`, response.data.rows)

					this.isBusy = false;

					this.rows = response.data;

					// return response.data
					// return response.data.rows
				} else {
					throw`[AMV] lack of response in list`;
				}

			},
			/**
			 * Al click sul icona di edit recupera tutte le info
			 * sulla riga corrispondente.
			 * per le operazioni di update recupera i dati sull'elelemnto dall'API e
			 * popola il form.
			 */
			async itemDelete(item) {
				const deleted = await this.$store.dispatch('deleteItem', {
					apiModule: this.apiModule,
					name: `${item.name} ${item.surname} | ${item.email}`,
					id: item.id
				});

				if (deleted) {
					this.$root.$emit('bv::refresh::table', this.tableId)
				}
			},
		},
		mounted() {
			this.$nextTick(() => {
				this.provider();
			})
		},
	}
</script>
