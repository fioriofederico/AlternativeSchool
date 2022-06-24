<template>
	<validation-observer ref="observer" v-slot="{ invalid }">
		<b-form @submit.stop.prevent="" autocomplete="off" class="vld-parent" ref="formContainer">
			<!-- Utente -->
			<b-row>
				<b-col lg="6">
					<label for="name">
						Nome <small class="text-danger">*</small>
					</label>
					<validation-provider name="Nome" :rules="{ required: true, min: 3 }"
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
					<label for="surname">
						Cognome <small class="text-danger">*</small>
					</label>
					<validation-provider name="Cognome" :rules="{ required: true, min: 3 }"
						v-slot="validationContext">
						<b-form-group>
							<b-form-input id="surname" v-model="form.surname" type="text"
								:state="getValidationState(validationContext)"
								></b-form-input>
							<b-form-invalid-feedback id="input-name-feedback">
								{{ validationContext.errors[0] }}
							</b-form-invalid-feedback>

						</b-form-group>
					</validation-provider>
				</b-col>
        <b-col lg="6">
          <label for="username">
            Username <small class="text-danger">*</small>
          </label>
          <validation-provider name="Username" :rules="{ required: true, min: 3 }"
                               v-slot="validationContext">
            <b-form-group>
              <b-form-input id="surname" v-model="form.username" type="text"
                            :state="getValidationState(validationContext)"
              ></b-form-input>
              <b-form-invalid-feedback id="input-name-feedback">
                {{ validationContext.errors[0] }}
              </b-form-invalid-feedback>

            </b-form-group>
          </validation-provider>
        </b-col>

				<!-- Email -->
				<b-col lg="6">
					<label for="Email">
						Email <small class="text-danger">*</small>
					</label>
					<validation-provider name="Email" :rules="{ required: true, email: true }"
						v-slot="validationContext">
						<b-form-group>
							<b-form-input id="Email" v-model="form.email" type="text"
								:state="getValidationState(validationContext)"
								></b-form-input>
							<b-form-invalid-feedback id="input-email-feedback">
								{{ validationContext.errors[0] }}
							</b-form-invalid-feedback>

						</b-form-group>
					</validation-provider>
				</b-col>

				<!-- Ruolo -->
				<b-col lg="6">
					<label for="role">
						Ruolo <small class="text-danger">*</small>
					</label>
					<validation-provider name="Ruolo" :rules="{ required: true }" v-slot="validationContext">
						<b-form-group>
							<b-form-select
								v-model="form.roles[0]"
								:options="userRoles"
								:size="formSize"
							></b-form-select>
							<b-form-invalid-feedback id="input-role-feedback">
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
				userRoles: [
					{value: null, text: "Seleziona un ruolo", disabled: true, selected: true },
					{value: "TUTOR", text: "Tutor" },
					{value: "STUDENT", text: "Studente" },
          {value: "ROLE_ADMIN", text: "Amministrazione" }
				],
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
			async generatePassword() {
				this.randomPwd =  await this.$store.dispatch('generatePassword', 4);
			},
			async onSubmit() {
				// Data da passare alle API
				const formData = {
					name: this.form.name,
					surname: this.form.surname,
          username: this.form.username,
					email: this.form.email,
					password: 'GPOVkhLOcZ!ww'
				}

        formData.roles[0] = this.form.roles[0];

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
          this.$bvToast.toast(`L'operazione non è stata conclusa.`, {
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
