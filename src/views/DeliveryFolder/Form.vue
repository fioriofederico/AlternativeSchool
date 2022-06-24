<template>
	<validation-observer ref="observer" v-slot="{ invalid }">
		<b-form @submit.stop.prevent="" autocomplete="off" class="vld-parent" ref="formContainer">
			<!-- Delivery -->
			<b-row>
				<b-col lg="12">
					<label for="name">
						Nome della Cartella <small class="text-danger">*</small>
					</label>
					<validation-provider name="Nome della Cartella" :rules="{ required: true, min: 3 }"
						v-slot="validationContext">
						<b-form-group>
							<b-form-input id="name" v-model="form.name" type="text"
								:state="getValidationState(validationContext)">
							</b-form-input>
							<b-form-invalid-feedback id="input-name-feedback">
								{{ validationContext.errors[0] }}
							</b-form-invalid-feedback>

						</b-form-group>
					</validation-provider>
				</b-col>

				<!-- Cognome -->
        <b-col lg="6">
          <label for="description">
            Data di Inizio <small class="text-danger">*</small>
          </label>
          <validation-provider name="Data di Inizio" :rules="{ required: true}"
                               v-slot="validationContext">
            <datetime format="DD-MM-YYYY" v-model="form.startDeliveryDay"></datetime>
            <b-form-invalid-feedback id="input-name-feedback">
              {{ validationContext.errors[0] }}
            </b-form-invalid-feedback>
          </validation-provider>
        </b-col>

        <b-col lg="6">
          <label for="description">
            Ora di Inizio <small class="text-danger">*</small>
          </label>
          <validation-provider name="Ora di Inizio" :rules="{ required: true}"
                               v-slot="validationContext">
            <datetime format="H:i:s" v-model="form.startDeliveryTime"></datetime>
            <b-form-invalid-feedback id="input-name-feedback">
              {{ validationContext.errors[0] }}
            </b-form-invalid-feedback>
          </validation-provider>
        </b-col>

        <hr>
        <b-col lg="6">
        <label for="description">
          Data di Consegna <small class="text-danger">*</small>
        </label>
        <validation-provider name="Data di Consegna" :rules="{ required: true}"
                             v-slot="validationContext">
          <datetime format="DD-MM-YYYY" v-model="form.endDeliveryDay"></datetime>
          <b-form-invalid-feedback id="input-name-feedback">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </validation-provider>
      </b-col>

        <b-col lg="6">
          <label for="description">
            Ora di Consegna <small class="text-danger">*</small>
          </label>
          <validation-provider name="Ora di Consegna" :rules="{ required: true}"
                               v-slot="validationContext">
            <datetime format="H:i:s" v-model="form.endDeliveryTime"></datetime>
            <b-form-invalid-feedback id="input-name-feedback">
              {{ validationContext.errors[0] }}
            </b-form-invalid-feedback>
          </validation-provider>
        </b-col>
      </b-row>

      <!--Bottone-->
			<b-row>
				<b-col>
					<hr>
					<div class="submit-wrap text-right" v-if="!invalid">
						<b-button
							block
							squared
							type="submit"
							:variant="invalid ? 'danger' : 'success'" @click="onSubmit">
							Salva
						</b-button>
					</div>

					<b-alert class="text-center" variant="warning" show v-else>
						Ci sono alcuni campi che non sono compilati in maniera corretta.
					</b-alert>
				</b-col>
			</b-row>
		</b-form>
	</validation-observer>
</template>

<script>
	import {bus} from '@/main';
	import {
		mapState
	} from 'vuex';
  import datetime from 'vuejs-datetimepicker';
  import moment from "moment";

	export default {
    components: { datetime },
		props: {
			apiRequest: String,
			apiModule: String,
			storeModule: String,
      apiModuleTable: String,
      coursesId: String,
			inModal: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
			}
		},
		computed: {
			...mapState({
				formSize : state => state.formSize
			}),
			form() {
				return this.$store.getters[`${this.storeModule}/item`]
			},
			resource() {
				return this.apiRequest == 'put' && this.form.id ? `${this.apiModuleTable}/${this.form.id}` : this.apiModuleTable;
			}
		},
    mounted() {
      if(this.form.startDeliveryTime != null) {
        this.form.startDeliveryDay = moment(this.form.startDeliveryTime).format("DD-MM-YYYY");
        this.form.startDeliveryTime = moment(this.form.startDeliveryTime).format("H:m:s");
      }
      if(this.form.endDeliveryTime != null) {
        this.form.endDeliveryDay = moment(this.form.endDeliveryTime).format("DD-MM-YYYY");
        this.form.endDeliveryTime = moment(this.form.endDeliveryTime).format("H:m:s");
      }
    },
    methods: {
      formatDate(date) {
        return moment(date).format('DD/MM/YYYY HH:mm:ss');
      },
			getValidationState({
				dirty,
				validated,
				valid = null
			}) {
				const isValidate = dirty || validated ? valid : null;
				return isValidate
			},
			async onSubmit() {
				// Data da passare alle API
        this.form.startDeliveryDayChange = moment(this.form.startDeliveryDay, "DD-MM-YYYY").format("YYYY-MM-DD");
        this.form.startDeliveryTimeChange = moment(this.form.startDeliveryTime, "H:m:s").format("HH:mm:ss");
        this.form.startDeliveryTimeChange = this.form.startDeliveryDayChange + "T" + this.form.startDeliveryTimeChange;
        this.form.endDeliveryDayChange = moment(this.form.endDeliveryDay, "DD-MM-YYYY").format("YYYY-MM-DD");
        this.form.endDeliveryTimeChange = moment(this.form.endDeliveryTime, "H:m:s").format("HH:mm:ss");
        this.form.endDeliveryTimeChange = this.form.endDeliveryDayChange + "T" + this.form.endDeliveryTimeChange;

        const formData = {
          name: this.form.name,
          startDeliveryTime: this.form.startDeliveryTimeChange,
          endDeliveryTime: this.form.endDeliveryTimeChange,
        };



        // Inizializza il loader
				const loader = await this.$store.dispatch('showLoader', this.$refs.formContainer ?? null);

				// Invia i dati all'api

				const res = await this.$store.dispatch(this.apiRequest, {
					resource: this.resource,
					params: formData
				})

				// Risposta
				if(res.status == 200) {
					this.$bvToast.toast(`L'operazione appena eseguita si è conclusa con successo.`, {
						title: 'Operazione riuscita',
						autoHideDelay: 2000,
						appendToast: true,
						variant: 'success'
					})

					// Invoca la chiusara della modale in cui il form è incluso
					if(this.inModal) {
						bus.$emit('modalEvent', 'close');
					}

					// Aggiorna la tabella che contiene i dati del modulo
					this.$root.$emit('bv::refresh::table', 'deliveryFoldersTable')

				} else {
          this.$bvToast.toast(`L'operazione di creazione della cartella non si è concluso con successo riprovare tra qualche secondo`, {
            title: 'Operazione non Riuscita',
            autoHideDelay: 9000,
            appendToast: true,
            variant: 'danger'
          })
					console.error(`[AMV] api ${this.storeModule}: request ${this.apiRequest}`);
				}

				loader.hide();
			},
		}
	}
</script>

<style>
	.discount-type {
		margin-bottom: 0.4rem;
		font-size: 14px;
		font-weight: bold;
		text-transform: uppercase;
		color: #cb9818;
	}

	.group-label {
		font-weight: 600;
		padding-bottom: 1px;
		border-bottom: 1px solid #eee;
		margin-bottom: 10px;
		color: gray;
	}
</style>
