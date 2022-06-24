<template>
	<validation-observer ref="observer" v-slot="{ invalid }">
		<b-form @submit.stop.prevent="" autocomplete="off" class="vld-parent" ref="formContainer">
			<!-- Corso -->
			<b-row>
				<b-col lg="12">
					<label for="score">
						Voto Assegnato <small class="text-danger">*</small>
					</label>
					<validation-provider name="Voto Assegnato" :rules="{ required: true }"
						v-slot="validationContext">
						<b-form-group>
							<b-form-input id="score" v-model="form.score" type="text"
								:state="getValidationState(validationContext)">
							</b-form-input>
							<b-form-invalid-feedback id="input-name-feedback">
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
      return this.apiRequest == 'put' && this.coursesId ? `${this.apiModuleTable}/${this.coursesId}` : this.apiModuleTable;
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
      const formData = {
        score: this.form.score,
      };
      console.log(this.coursesId)
       var path = this.apiModuleTable + '/' + this.coursesId
      // Inizializza il loader
      const loader = await this.$store.dispatch('showLoader', this.$refs.formContainer ?? null);
      // Invia i dati all'api
      const res = await this.$store.dispatch(this.apiRequest, {
        resource: path,
        params: formData
      })

      // Risposta
      if(res.status== 200) {
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
        this.$root.$emit('bv::refresh::table', 'uploadFileOnDeliveryFoldersTable')

      } else {
        this.$bvToast.toast(`Riprovare più tardi ad assegnare un voto`, {
          title: 'Operazione non Riuscita',
          autoHideDelay: 2000,
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
