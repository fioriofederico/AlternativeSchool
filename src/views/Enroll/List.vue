<template>
	<div ref="main">

		<Toolbar :info="info" :idTable="tableId" :tools="toolBarButton" :bulk="bulkActions"/>

		<Table
			:apiModule="apiModuleTableStudent"
			:storeModule="apiModuleTableStudent"
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
                title="Rimuovi dal Corso"
                size="sm"
                variant="link"
                @click="itemDelete(row.item)"
            >
              <font-awesome-icon class="action--item action-delete text-danger" icon="user-minus" />
            </b-button>
          </div>
				</div>
			</template>
      <template v-slot:cell(certificateEnabled)="row">
        <div class="action--menu">
          <b-form-checkbox v-model="row.item.certificateEnabled" name="check-button" switch @change="changeStateRenewPaid(row.item)" >
          </b-form-checkbox>
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
  import {api} from "@/scripts/api-service";
	export default {
		name: 'enroll',
		components: {
			Modal,
			Form,
			Table,
			Toolbar,
		},
		data() {
			return {
        toolBarButton : '',
        apiModuleForScore: '',
        apiModuleForEnroll: '',
        apiModuleForRemove: '',
				pageTitle: 'Iscritti',
				modal: {
					id: 'enrollModal',
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
				filters       : 'enroll/getFilters',
				fields        : 'enroll/getFields',
        fieldsRoll    : 'enroll/getFieldsRoll',
				getCurrentPage: 'enroll/getCurrentPage',
				getPerPage    : 'enroll/getPerPage',
				sortBy        : 'enroll/getSortBy',
				sortDesc      : 'enroll/getSortDesc'
			}),
			...mapState({
				tableId      : state => state.enroll.tableId,
				toolBarButtonTutor: state => state.enroll.toolBarButton,
        toolBarButtonAdmin: state => state.enroll.toolBarButtonAdmin,
				apiModule    : state => state.enroll.apiModule,
				storeModule  : state => state.enroll.storeModule,
        apiModuleTableRemoveStudent: state => state.enroll.apiModuleTableRemoveStudent,
        apiModuleTableStudent: state => state.enroll.apiModuleTableStudent,
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
      async changeStateRenewPaid(item) {
        const loader = await this.$store.dispatch('showLoader', this.$refs.formContainer ?? null);
        let path = 'courses/' + this.$route.params.id + '/enable_certificate/' + item.id
        let res =await api["post"](path)
        if(res.status==200) {
          this.$bvToast.toast(`L'operazione appena eseguita si è conclusa con successo.`, {
            title: 'Operazione riuscita',
            autoHideDelay: 2000,
            appendToast: true,
            variant: 'success'
          })
          await this.$root.$emit('bv::refresh::table', this.tableId)
        }else {
          this.$bvToast.toast(`L'operazione non è stata conclusa.`, {
            title: 'Operazione non Riuscita',
            autoHideDelay: 9000,
            appendToast: true,
            variant: 'danger'
          })
          await this.$root.$emit('bv::refresh::table', this.tableId)
        }
        loader.hide()
      },
			async itemDelete(item) {
				const deleted = await this.$store.dispatch('deleteItem', {
					apiModule: this.apiModuleTableRemoveStudent,
					name: `Rimuovi da Corso ${item.name} | ${item.surname}`,
					id: item.id
				});

				if (deleted) {
					this.$root.$emit('bv::refresh::table', this.tableId)
				}
			},
		},
		mounted() {
      if(['ROLE_ADMIN'].includes(this.$store.getters['auth/user'].role)) {
        this.toolBarButton = this.toolBarButtonAdmin
      }else if(['ROLE_TUTOR'].includes(this.$store.getters['auth/user'].role)){
        this.toolBarButton = this.toolBarButtonTutor
      }
			this.$nextTick(() => {
				this.provider();
			})
		},
	}
</script>
