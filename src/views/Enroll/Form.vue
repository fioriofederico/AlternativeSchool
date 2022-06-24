<template>
	<validation-observer ref="observer" v-slot="{ invalid }">
		<b-form @submit.stop.prevent="" autocomplete="off" class="vld-parent" ref="formContainer">
			<!-- Corso -->
			<b-row>
				<b-col lg="12">
					<label for="name">
						Nome del Corso <small class="text-danger">*</small>
					</label>
					<validation-provider name="Nome del Corso" :rules="{ required: true, min: 3 }"
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
				<b-col lg="12">
					<label for="description">
						Descrizione
					</label>
					<validation-provider name="Descrizione" :rules="{ required: false, min: 0 }"
						v-slot="validationContext">
						<b-form-group>
							<b-form-textarea id="description" v-model="form.description" type="text"
								:state="getValidationState(validationContext)"
								></b-form-textarea>
							<b-form-invalid-feedback id="input-description-feedback">
								{{ validationContext.errors[0] }}
							</b-form-invalid-feedback>

						</b-form-group>
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

	export default {
		props: {
			apiRequest: String,
			apiModule: String,
			storeModule: String,
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
			tableId() {
				return this.$store.state[`${this.storeModule}`].tableId
			},
			form() {
				return this.$store.getters[`${this.storeModule}/item`]
			},
			resource() {
				return this.apiRequest == 'put' && this.form.id ? `${this.apiModule}/${this.form.id}` : this.apiModule;
			}
		},
		methods: {
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
        const formData = {};
        if(this.apiRequest === 'post') {
          formData.name = this.form.name,
              formData.description = this.form.description,
              formData.ownerId = this.$store.getters['auth/user'].id
        }else{
          formData.name = this.form.name,
              formData.description = this.form.description,
              formData.userId = this.$store.getters['auth/user'].id
        }



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
					this.$root.$emit('bv::refresh::table', this.tableId)

				} else {
          this.$bvToast.toast(`L'operazione si è interrotta senza successo`, {
            title: 'Operazione non Riuscita',
            autoHideDelay: 9000,
            appendToast: true,
            variant: 'danger'
          })
					console.errro(`[AMV] api ${this.storeModule}: request ${this.apiRequest}`);
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
