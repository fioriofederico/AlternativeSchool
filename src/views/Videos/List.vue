<template>
	<div ref="main">

		<Toolbar :info="info" :idTable="tableId" :tools="toolBarButton" :bulk="bulkActions" :address-back-to="'/coursesModules/' + this.$route.params.moduleId"/>

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

			<!-- Bottoni di azione sulla riga della tabella -->
			<template v-slot:cell(action)="row">
				<div class="actions--menu">
          <div class="action--menu">
            <b-button
                v-b-tooltip.hover
                title="Avvia visione"
                size="sm"
                variant="link"
                @click="openPlayer(row.item.url)"
            >
              <font-awesome-icon class="action--item action-edit text-success" icon="play" />
            </b-button>
          </div>
					<!--<div class="action--menu">
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
					</div>-->
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


    <Modal
      :id="player.id"
      :title="player.title"
      modalSize="lg"
      >
      <vue-plyr>
        <div data-plyr-provider="vimeo"
             :data-plyr-embed-id="link"></div>
      </vue-plyr>
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

	export default {
		name: 'videos',
		components: {
			Modal,
			Form,
			Table,
			Toolbar,
		},
		data() {
			return {
        toolBarButton: '',
        videoID: 'some-id',
        height: 500,
        options: {
          muted: true,
          autoplay: true,
        },
        playerReady: false,
				pageTitle: 'Video',
				modal: {
					id: 'videosModal',
					title: ''
				},
        player: {
          id: 'videosModalPlayer',
          title: 'Player'
        },
				form: {},
				apiRequest: 'post',
				bulkActions: false,
				isBusy: true,
				rows: [],
        link: '',
			}
		},
		computed: {
			...mapGetters({
				filters       : 'videos/getFilters',
				fields        : 'videos/getFields',
				getCurrentPage: 'videos/getCurrentPage',
				getPerPage    : 'videos/getPerPage',
				sortBy        : 'videos/getSortBy',
				sortDesc      : 'videos/getSortDesc'
			}),
			...mapState({
				tableId      : state => state.videos.tableId,
				toolBarButtonStudent: state => state.videos.toolBarButtonStudent,
        toolBarButtonAdmin: state => state.videos.toolBarButtonAdmin,
				apiModule    : state => state.videos.apiModule,
				storeModule  : state => state.videos.storeModule,
        apiModuleTable    : state => state.videos.apiModuleTable,
			}),
		},
		methods: {
      onReady() {
        this.playerReady = true
      },
      play () {
        this.$refs.player.play()
      },
      pause () {
        this.$refs.player.pause()
      },
      openPlayer(item, index, button){
        this.link = item;
        this.$root.$emit('bv::show::modal', this.player.id, button)
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
					this.modal.title = `Aggiungi Video`

				} else { // Operazione di aggiunta
					this.apiRequest = 'put';

					this.modal.title = `Modifica Video: ${item.name}`

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
