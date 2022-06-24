<template>
	<div ref="main">

		<Toolbar :info="info" :idTable="tableId" :tools="toolBarButton" :bulk="bulkActions"/>

		<Table
			:apiModule="apiModuleTableMyCourses"
			:storeModule="storeModuleTableMyCourses"
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
			<template v-slot:cell(owner)="row">
				{{row.item.owner.surname}}	{{row.item.owner.name}}
			</template>

			<!-- Bottoni di azione sulla riga della tabella -->
			<template v-slot:cell(action)="row">
				<div class="actions--menu">
          <div class="action--menu">
            <router-link :to="'/coursesModules/' + row.item.id ">
              <b-button
                  v-b-tooltip.hover
                  title="Mostra Moduli del Corso"
                  size="sm"
                  variant="link"
                  @click="setOnCoursesModulesApi(row.item)"
              >
                <font-awesome-icon class="action--item action-edit text-info" icon="bars" />
              </b-button>
            </router-link>
          </div>
          <div class="action--menu">
            <router-link :to="'/deliveryFolders/' + row.item.id ">
              <b-button
                  v-b-tooltip.hover
                  title="Gestione Cartella di Consegna"
                  size="sm"
                  variant="link"
                  @click="setOnDeliveryFolderModulesApi(row.item)"
              >
                <font-awesome-icon class="action--item action-edit text-secondary" icon="folder-open" />
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
          <div class="action--menu" v-if="['ROLE_STUDENT','ROLE_ADMIN'].includes($store.getters['auth/user'].role)">
            <b-button
                v-b-tooltip.hover
                title="Vota il Corso"
                size="sm"
                variant="link"
                @click="score(row.item)"
            >
              <font-awesome-icon class="action--item action-delete text-warning" icon="star" />
            </b-button>
          </div>
          <div class="action--menu" v-if="['ROLE_STUDENT','ROLE_ADMIN'].includes($store.getters['auth/user'].role)">
            <a target="_blank" :download=row.item.name :href= "'http://localhost:8080/courses/'+ row.item.id +'/certificate/'+ $store.getters['auth/user'].id">
              <b-button
                  v-b-tooltip.hover
                  title="Ottini Attestazione del Completamento del Corso"
                  size="sm"
                  variant="link"
              >
                <font-awesome-icon class="action--item action-delete text-success" icon="certificate" />
              </b-button>
            </a>
          </div>
          <div class="action--menu" v-if="['ROLE_STUDENT','ROLE_ADMIN'].includes($store.getters['auth/user'].role)">
            <b-button
                v-b-tooltip.hover
                title="Rimuoviti dal Corso"
                size="sm"
                variant="link"
                @click="unEnroll(row.item, $store.getters['auth/user'].id)"
            >
              <font-awesome-icon class="action--item action-delete text-dark" icon="user-minus" />
            </b-button>
          </div>
          <div class="action--menu" v-if="['ROLE_TUTOR','ROLE_ADMIN'].includes($store.getters['auth/user'].role)">
            <router-link :to="'/enRoll/' + row.item.id ">
              <b-button
                  v-b-tooltip.hover
                  title="Gestione Iscritti al Corso"
                  size="sm"
                  variant="link"
                  @click="setOnEnrollApi(row.item)"
              >
                <font-awesome-icon class="action--item action-delete text-dark" icon="users" />
              </b-button>
            </router-link>
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
			/>
		</Modal>

    <Modal
        :id="modalScore.id"
        :title="modalScore.title"
        modalSize="md"
    >
      <FormScore
          :apiRequest="apiRequest"
          :apiModule="apiModule"
          :apiModuleStore="apiModuleForScore"
          :storeModule="storeModule"
      />
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
  import coursesModules from "@/store/modules/coursesModules";
  import deliveryFolders from "@/store/modules/deliveryFolder";
  import courses from "@/store/modules/myCourses";
  import enroll from "@/store/modules/enroll";

	export default {
		name: 'courses',
		components: {
      FormScore,
			Modal,
			Form,
			Table,
			Toolbar,
		},
		data() {
			return {
        toolBarButton: '',
        apiModuleTableRemoveStudent: '',
        apiModuleForScore: '',
        apiModuleForEnroll: '',
        apiModuleForRemove: '',
				pageTitle: 'Corsi',

				modal: {
					id: 'coursesModal',
					title: ''
				},
        modalScore: {
          id: 'scoreCoursesModal',
          title: ''
        },
        modalUserRoll: {
          id: 'rollCoursesModal',
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
				filters       : 'courses/getFilters',
				fields        : 'courses/getFields',
        fieldsRoll    : 'courses/getFieldsRoll',
				getCurrentPage: 'courses/getCurrentPage',
				getPerPage    : 'courses/getPerPage',
				sortBy        : 'courses/getSortBy',
				sortDesc      : 'courses/getSortDesc'
			}),
			...mapState({
				tableId      : state => state.myCourses.tableId,
				toolBarButtonStudent: state => state.myCourses.toolBarButtonStudent,
        toolBarButtonTutorAdmin: state => state.myCourses.toolBarButtonAdmin,
				apiModule    : state => state.myCourses.apiModule,
				storeModule  : state => state.myCourses.storeModule,
        apiModuleScore: state => state.myCourses.apiModuleScore,
        apiModuleTableMyCourses: state => state.myCourses.apiModuleTableMyCourses,
        storeModuleTableMyCourses: state => state.myCourses.storeModuleTableMyCourses,
			}),
		},
		methods: {
      setPathEnRollRemoveStudentCourses(item){
        return this.apiModuleTableRemoveStudent = 'courses/' + item + '/unenroll';
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
      setOnEnrollApi(item){
        this.setPathForEnRoll(item)
        this.setPathForRemoveStudent(item)
      },
      async setPathForRemoveStudent(item){
        enroll.actions.setPathEnRollRemoveStudentCourses(item.id);
      },
      async setPathForEnRoll(item){
        enroll.actions.setPathEnRollStudentCourses(item.id);
      },
      setPathForScore(item){
        courses.actions.setPathScoreCourses(item.id);
      },
      async setOnCoursesModulesApi(item){
        coursesModules.actions.setIdModules(item.id);
      },
      async setOnDeliveryFolderModulesApi(item){
        deliveryFolders.actions.setIdModules(item.id);
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
      async downloadFilePdf(idCourse, nameFile){
        let pathDownload =  'courses/'+ idCourse +'/certificate';
        var exportGo = await this.$store.dispatch('downloadFile', {
          resource: pathDownload,
          slug: this.$store.getters['auth/user'].id
        })
        if(exportGo.status == 400) {
          this.$bvToast.toast(`Il Certificato non è stato ancora abilitato dal Docente del Corso`, {
            title: 'Operazione non riuscita',
            autoHideDelay: 9000,
            appendToast: true,
            variant: 'danger'
          })
        }else if(exportGo.status == 404){
            this.$bvToast.toast(`Errore nella creazione del certificato`, {
              title: 'Operazione non riuscita',
              autoHideDelay: 9000,
              appendToast: true,
              variant: 'danger'
            })
        }else if(exportGo.status == 200){
          nameFile = nameFile + '.pdf';
          this.$bvToast.toast(`Il Download del PDF sta per avviarsi`, {
            title: 'Operazione riuscita',
            autoHideDelay: 9000,
            appendToast: true,
            variant: 'success'
          })
          this.downloadFile(exportGo, nameFile)
        }
      },
      async enroll(idCourse, idUser){
        let pathEnrool =  'courses/'+ idCourse +'/enroll/' + idUser ;
        await this.$store.dispatch('postEnroll', {
          resource: pathEnrool
        })

        this.$bvToast.toast(`Iscrizione Completa con Successo.`, {
          title: 'Operazione riuscita',
          autoHideDelay: 2000,
          appendToast: true,
          variant: 'success'
        })

          this.$root.$emit('bv::refresh::table', this.tableId)
      },

      async unEnroll(idResurce, item) {
        this.setPathEnRollRemoveStudentCourses(idResurce.id)
        const deleted = await this.$store.dispatch('deleteItem', {
          apiModule: this.apiModuleTableRemoveStudent,
          name: `Vuoi Rimuoverti dal Corso ${idResurce.name}`,
          id: item
        });

        if (deleted) {
          this.$root.$emit('bv::refresh::table', this.tableId)
        }
      },
      async enRollUser(item, index, button) {
        this.apiModuleForEnroll = 'courses/' + item.id + '/students';
        await this.setPathForRole(item);
        // Mostra il loader fintanto che i il form e i dati non sono stati
        // caricati tuti.
        const loader = await this.$store.dispatch('showLoader', this.$refs.main)
        // Operazione di aggiunta
        this.apiRequest = 'post';

        this.modalUserRoll.title = `Gestione dei Partecipanti al Corso: ${item.name}`

        // mostra la modale
        this.$root.$emit('bv::show::modal', this.modalUserRoll.id, button)

        // Rimuovi il loader
        loader.hide()
      },
      async score(item, index, button) {
        this.apiModuleForScore = 'courses/' + item.id + '/rate';
         await this.setPathForScore(item);
        // Mostra il loader fintanto che i il form e i dati non sono stati
        // caricati tuti.
        const loader = await this.$store.dispatch('showLoader', this.$refs.main)
        // Operazione di aggiunta
        this.apiRequest = 'post';

        this.modalScore.title = `Assegna Voto al Corso: ${item.name}`

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
					this.modal.title = `Aggiungi Corso`

				} else { // Operazione di aggiunta
					this.apiRequest = 'put';

					this.modal.title = `Modifica Corso: ${item.name} | ${item.owner.surname} ${item.owner.name}`

					// Recupera i dati dall'API
					const res = await this.$store.dispatch('getItem', {
						resource: `${this.apiModule}`,
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
        if(['ROLE_TUTOR','ROLE_ADMIN'].includes(this.$store.getters['auth/user'].role)){
          this.info(item)
        }
			},
			async itemDelete(item) {
				const deleted = await this.$store.dispatch('deleteItem', {
					apiModule: this.apiModule,
					name: `${item.name} | ${item.owner.surname} ${item.owner.name}`,
					id: item.id
				});

				if (deleted) {
					this.$root.$emit('bv::refresh::table', this.tableId)
				}
			},
		},
		mounted() {
      if(['ROLE_ADMIN', 'ROLE_TUTOR'].includes(this.$store.getters['auth/user'].role)){
        this.toolBarButton = this.toolBarButtonTutorAdmin
      }else{
        this.toolBarButton = this.toolBarButtonStudent
      }
			this.$nextTick(() => {
				this.provider();
			})
		},
	}
</script>
