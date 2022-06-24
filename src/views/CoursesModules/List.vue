<template>
	<div ref="main">

		<Toolbar :info="info" :idTable="tableId" :tools="toolBarButton" :bulk="bulkActions"/>

		<Table
			:apiModule="apiModuleTable"
			:storeModule="apiModuleTable"
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
			:dbClicked="rowDbClicked"
		>

			<!-- Bottoni di azione sulla riga della tabella -->
			<template v-slot:cell(action)="row">
				<div class="actions--menu">
          <div class="action--menu">
            <router-link :to="'/videos/'+ $route.params.id + '/' + row.item.id ">
            <b-button
                v-b-tooltip.hover
                title="Mostra Video del Corso"
                size="sm"
                variant="link"
                data-crud="update"
                @click="setOnCoursesModulesVideosApi($route.params.id, row.item)"
            >
              <font-awesome-icon class="action--item action-edit text-info" icon="caret-square-right" />
            </b-button>
            </router-link>
          </div>
          <div class="action--menu">
            <router-link :to="'/folderCoursesModules/' +  $route.params.id + '/'+ row.item.id ">
              <b-button
                  v-b-tooltip.hover
                  title="Allegati al Modulo"
                  size="sm"
                  variant="link"
                  @click="setOnFolderCoursesModulesApi($route.params.id, row.item.id)"
              >
                <font-awesome-icon class="action--item action-edit text-info" icon="paperclip" />
              </b-button>
            </router-link>
          </div>
					<div class="action--menu" v-if="['ROLE_TUTOR','ROLE_ADMIN'].includes($store.getters['auth/user'].role)">
						<b-button
							v-b-tooltip.hover
							title="Modifica"
							size="sm"
							variant="link"
							data-crud="update"
							@click="info(row.item, row.index, $event.target)"
						>
							<font-awesome-icon class="action--item action-edit text-primary" icon="pen" />
						</b-button>
					</div>
					<div class="action--menu" v-if="['ROLE_TUTOR','ROLE_ADMIN'].includes($store.getters['auth/user'].role)">
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

		<Modal
			:id="modal.id"
			:title="modal.title"
			modalSize="md"
		>
			<Form
				:apiRequest="apiRequest"
				:apiModule="apiModule"
				:storeModule="storeModule"
        :apiModuleTable="apiModuleTable"
			/>
		</Modal>
	</div>
</template>

<script>
	import Table from '@/components/Crud/Table.vue'
	import Toolbar from '@/components/Crud/Toolbar.vue'
	import Modal from '@/components/Modal.vue'
	import Form from './Form.vue'

	import {
		mapGetters, mapState
	} from 'vuex'
  import videos from "@/store/modules/videos";
  import folderCoursesModules from "@/store/modules/folderCoursesModules";
  import coursesModules from "@/store/modules/coursesModules";

	export default {
		name: 'coursesModules',
		components: {
			Modal,
			Form,
			Table,
			Toolbar,
		},
		data() {
			return {
        toolBarButton: '',
				pageTitle: 'ModuloCorsi',

				modal: {
					id: 'coursesModulesModal',
					title: ''
				},
				form: {},
				apiRequest: 'post',
				bulkActions: false,
				isBusy: true,
				rows: []
			}
		},
		computed: {
			...mapGetters({
				filters       : 'coursesModules/getFilters',
				fields        : 'coursesModules/getFields',
				getCurrentPage: 'coursesModules/getCurrentPage',
				getPerPage    : 'coursesModules/getPerPage',
				sortBy        : 'coursesModules/getSortBy',
				sortDesc      : 'coursesModules/getSortDesc'
			}),
			...mapState({
				tableId      : state => state.coursesModules.tableId,
				toolBarButtonStudent: state => state.coursesModules.toolBarButtonStudent,
        toolBarButtonAdmin: state => state.coursesModules.toolBarButtonAdmin,
        toolBarButtonTutor: state => state.coursesModules.toolBarButtonTutor,
				apiModule    : state => state.coursesModules.apiModule,
				storeModule  : state => state.coursesModules.storeModule,
        apiModuleTable    : state => state.coursesModules.apiModuleTable,
			}),
		},
		methods: {
      async setOnCoursesModulesVideosApi(idCourse, idModule){
        videos.actions.setIdModules(idCourse, idModule);
      },
      async setOnFolderCoursesModulesApi(idCourse, idModule){
        folderCoursesModules.actions.setIdModules(idCourse, idModule);
      },
      async setToolBar(path, backOn, createOn){
        coursesModules.actions.setToolBar(path,backOn,createOn);
      },
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
			async info(item, index, button) {
				// Mostra il loader fintanto che i il form e i dati non sono stati
				// caricati tuti.
				const loader = await this.$store.dispatch('showLoader', this.$refs.main)
				if (!item) { // Operazione di aggiunta

					// Tipo di richiesta
					this.apiRequest = 'post';

					this.$store.commit(`${this.storeModule}/ITEM`, this.form)

					// Titolo della modale
					this.modal.title = `Aggiungi Modulo al Corso`

				} else { // Operazione di aggiunta
					this.apiRequest = 'put';

					this.modal.title = `Modifica Modulo: ${item.name}`

					// Recupera i dati dall'API
					const res = await this.$store.dispatch('getItem', {
						resource: `${this.apiModuleTable}`,
						slug: item.id
					})

					// Conserva i dati nello store del modulo
					this.$store.commit(`${this.storeModule}/ITEM`, res.data);
				}

				// mostra la modale
				this.$root.$emit('bv::show::modal', this.modal.id, button)

				// Rimuovi il loader
				loader.hide()
			},
			rowDbClicked(item) {
        if(['ROLE_TUTOR','ROLE_ADMIN'].includes(this.$store.getters['auth/user'].role)) {
          this.info(item)
        }
			},
			async itemDelete(item) {
				const deleted = await this.$store.dispatch('deleteItem', {
					apiModule: this.apiModuleTable,
					name: `${item.name}`,
					id: item.id
				});

				if (deleted) {
					this.$root.$emit('bv::refresh::table', this.tableId)
				}
			},
		},
		mounted() {
      if(['ROLE_ADMIN'].includes(this.$store.getters['auth/user'].role)){
        this.toolBarButton = this.toolBarButtonAdmin
      }else if(['ROLE_STUDENT'].includes(this.$store.getters['auth/user'].role)) {
        this.toolBarButton = this.toolBarButtonStudent
      }else{
        this.toolBarButton = this.toolBarButtonTutor
      }
			this.$nextTick(() => {
				this.provider();
			})
		},
	}
</script>
