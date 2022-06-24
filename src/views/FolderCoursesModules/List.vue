<template>
	<div ref="main">

		<Toolbar :info="info" :idTable="tableId" :tools="toolBarButton" :bulk="bulkActions" :address-back-to="'/coursesModules/' + this.$route.params.idCourse" />

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
		>

      <template v-slot:cell(dateInsert)="row">
        {{formatDate(row.item.dateInsert)}}
      </template>

			<!-- Bottoni di azione sulla riga della tabella -->
      <template v-slot:cell(action)="row">
        <div class="actions--menu">
          <div class="action--menu"  >
            <a target="_blank" :download=row.item.name :href= "'http://localhost:8080/courses/'+ $route.params.idCourse +'/modules/'+ $route.params.idModule +'/attachments/' + row.item.id">
            <b-button
                v-b-tooltip.hover
                title="Scarica il File"
                size="sm"
                variant="link"
                data-crud="update"
            >
              <font-awesome-icon class="action--item action-edit text-info" icon="download" />
            </b-button>
            </a>
          </div>
          <div class="action--menu"  v-if="['ROLE_TUTOR','ROLE_ADMIN'].includes($store.getters['auth/user'].role)">
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
  import moment from "moment";

	export default {
		name: 'folderCoursesModules',
		components: {
			Modal,
			Form,
			Table,
			Toolbar,
		},
		data() {
			return {
        toolBarButton:'',
				pageTitle: 'Allegati del Modulo',
				modal: {
					id: 'foldersCoursesModulesModal',
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
				filters       : 'folderCoursesModules/getFilters',
				fields        : 'folderCoursesModules/getFields',
				getCurrentPage: 'folderCoursesModules/getCurrentPage',
				getPerPage    : 'folderCoursesModules/getPerPage',
				sortBy        : 'folderCoursesModules/getSortBy',
				sortDesc      : 'folderCoursesModules/getSortDesc'
			}),
			...mapState({
				tableId      : state => state.folderCoursesModules.tableId,
				toolBarButtonStudent: state => state.folderCoursesModules.toolBarButtonStudent,
        toolBarButtonAdmin: state => state.folderCoursesModules.toolBarButtonAdmin,
				apiModule    : state => state.folderCoursesModules.apiModule,
				storeModule  : state => state.folderCoursesModules.storeModule,
        apiModuleTable    : state => state.folderCoursesModules.apiModuleTable,
			}),
		},
		methods: {
      formatDate(date) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss');
      },
      downloadFile (blob, fileName) {
        const link = document.createElement('a');
        // create a blobURI pointing to our Blob
        link.href = blob;
        link.download = fileName;
        // some browser needs the anchor to be in the docdocument.body.append(link);
        link.click();
      },
      async downloadFilePdf(idCourse, idModules, idFile, nameFile){
        let pathDownload =  'courses/'+ idCourse +'/modules/'+ idModules +'/attachments';
        var exportGo = await this.$store.dispatch('downloadFile', {
          resource: pathDownload,
          slug: idFile
        })
        this.downloadFile(exportGo, nameFile)
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
				this.info(item)
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
      if(['ROLE_ADMIN', 'ROLE_TUTOR'].includes(this.$store.getters['auth/user'].role)){
        this.toolBarButton = this.toolBarButtonAdmin
      }else{
        this.toolBarButton = this.toolBarButtonStudent
      }
			this.$nextTick(() => {
				this.provider();
			})
		},
	}
</script>
