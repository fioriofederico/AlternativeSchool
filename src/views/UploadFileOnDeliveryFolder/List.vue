<template>
	<div ref="main">

		<Toolbar :info="info" :idTable="tableId" :tools="toolBarButton" :bulk="bulkActions" :address-back-to="'/deliveryFolders/' + this.$route.params.idFolder"/>

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


      <template v-slot:cell(student)="row">
        {{row.item.student.surname}} {{row.item.student.name}}
      </template>

      <template v-slot:cell(score)="row">
        {{row.item.score}}
          <b-button
              v-b-tooltip.hover
              title="Assegna il Voto"
              size="sm"
              variant="link"
              data-crud="update"
              @click="score(row.item)"
          >
            <font-awesome-icon class="action--item action-edit text-primary" icon="pen"/>
          </b-button>
      </template>

			<!-- Bottoni di azione sulla riga della tabella -->
			<template v-slot:cell(action)="row">
				<div class="actions--menu">
          <div class="action--menu">
            <a target="_blank" :download=row.item.name :href= "'http://localhost:8080/courses/'+ $route.params.idCourse +'/delivery_folders/'+ $route.params.idFolder +'/assignments/' + row.item.id">
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
        :coursesId="this.$route.params.id"
			/>
		</Modal>


    <Modal
        :id="modalScore.id"
        :title="modalScore.title"
        modalSize="sm"
    >
      <FormScore
        :apiRequest="apiRequest"
        :apiModule="apiModule"
        :storeModule="storeModule"
        :apiModuleTable="apiModuleTable"
        :coursesId="idCourse">
      </FormScore>
    </Modal>
	</div>
</template>

<script>
	import Table from '@/components/Crud/Table.vue'
	import Toolbar from '@/components/Crud/Toolbar.vue'
	import Modal from '@/components/Modal.vue'
	import Form from './Form.vue'
  import FormScore from "./FormScore";

	import {
		mapGetters, mapState
	} from 'vuex'
  import moment from "moment";
  import axios from "axios";

	export default {
		name: 'deliveryFolder',
		components: {
			Modal,
			Form,
			Table,
			Toolbar,
      FormScore
		},
		data() {
			return {
				pageTitle: 'CartellaUploadFile',
				modal: {
          id: 'uploadFileDeliveryFolderModal',
          title: ''
        },
        modalScore: {
          id: 'scoreFileDeliveryFolderModal',
          title: ''
        },
				form: {},
				apiRequest: 'post',
				bulkActions: false,
				isBusy: true,
				rows: [],
        idCourse: '',
        toolBarButton:''
			}
		},
		computed: {
			...mapGetters({
				filters       : 'uploadFileOnDeliveryFolder/getFilters',
				fields        : 'uploadFileOnDeliveryFolder/getFields',
				getCurrentPage: 'uploadFileOnDeliveryFolder/getCurrentPage',
				getPerPage    : 'uploadFileOnDeliveryFolder/getPerPage',
				sortBy        : 'uploadFileOnDeliveryFolder/getSortBy',
				sortDesc      : 'uploadFileOnDeliveryFolder/getSortDesc'
			}),
			...mapState({
				tableId      : state => state.uploadFileOnDeliveryFolder.tableId,
				toolBarButtonStudent: state => state.uploadFileOnDeliveryFolder.toolBarButtonStudent,
        toolBarButtonAdmin: state => state.uploadFileOnDeliveryFolder.toolBarButtonAdmin,
				apiModule    : state => state.uploadFileOnDeliveryFolder.apiModule,
				storeModule  : state => state.uploadFileOnDeliveryFolder.storeModule,
        apiModuleTable    : state => state.uploadFileOnDeliveryFolder.apiModuleTable,
			}),
		},
		methods: {
      formatDate(date) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss');
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
      downloadFile (blob, fileName) {
        const link = document.createElement('a');
        // create a blobURI pointing to our Blob
        link.href = blob;
        link.download = fileName;
        // some browser needs the anchor to be in the docdocument.body.append(link);
        link.click();
        link.remove();
        // in case the Blob uses a lot of memorysetTimeout(() => URL.revokeObjectURL(link.href), 7000);
        this.isLoading = true;
      },
      async downloadFilePdf(idCourse, idFolder, idFile){
        let pathDownload =  'courses/'+ idCourse +'/delivery_folders/'+ idFolder +'/assignments/'+ idFile;
        await axios.get(pathDownload)
      },
			/**
			 * Al click sul icona di edit recupera tutte le info
			 * sulla riga corrispondente.
			 * per le operazioni di update recupera i dati sull'elelemnto dall'API e
			 * popola il form.
			 */
      async score(item, index, button) {
        // Mostra il loader fintanto che i il form e i dati non sono stati
        // caricati tuti.
        const loader = await this.$store.dispatch('showLoader', this.$refs.main)
        // Operazione di aggiunta
          this.apiRequest = 'put';
        this.idCourse = item.id

          this.modalScore.title = `Assegna Voto: ${item.name}`

          // Recupera i dati dall'API
          const res = await this.$store.dispatch('getItem', {
            resource: `${this.apiModuleTable}`,
            slug: item.id
          })

          // Conserva i dati nello store del modulo
          this.$store.commit(`${this.storeModule}/ITEM`, res.data);

        // mostra la modale
        this.$root.$emit('bv::show::modal', this.modalScore.id, button)

        // Rimuovi il loader
        loader.hide()
      },
      async info(item, index, button) {
        // Mostra il loader fintanto che i il form e i dati non sono stati
        // caricati tuti.
        const loader = await this.$store.dispatch('showLoader', this.$refs.main)
        if (!item) { // Operazione di aggiunta
          // Tipo di richiesta
          this.apiRequest = 'post';
          this.$store.commit(`${this.storeModule}/ITEM`, this.form)
          // Titolo della modale
          this.modal.title = `Aggiungi Cartella al Corso`
        } else { // Operazione di aggiunta
          this.apiRequest = 'put';
          this.modal.title = `Modifica Cartella: ${item.name}`
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
      if(['ROLE_TUTOR'].includes(this.$store.getters['auth/user'].role)){
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
