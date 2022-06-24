<template>
	<validation-observer ref="observer" v-slot="{ invalid }">
		<b-form @submit.stop.prevent="" autocomplete="off" class="vld-parent" ref="formContainer">
			<!-- Video Upload -->
      <b-row>
        <!-- Upload video-->
        <b-col lg="12">
          <label for="description">
            Video Upload
          </label>
            <b-form-group>
              <b-form-file
                  accept="video/*"
                  type="file"
                  id="video"
                  v-model="form.url"
                  placeholder="Scegliere il Video da Caricare o Trascinalo Qui..."
                  drop-placeholder="Trascina qui il Tuo Video..."
                  @change="onFileChange(item, $event)"
              ></b-form-file>

            </b-form-group>
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
			inModal: {
				type: Boolean,
				default: true
			},
		},
		data() {
			return {
        items: [{ image: false}],
        selectedFile: null
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
		methods: {
      onFileChange(item, e) {
        var files = e.target.files;
        console.log(e.target.files[0]),
            this.selectedFile = e.target.files[0];
        console.log(files)
        if (!files.length)
          return;
        this.createImage(item, files[0]);
      },
      createImage(item, file) {
        var image = new Image();
        console.log(image)
        var reader = new FileReader();
        reader.onload = (e) => {
          item.image = e.target.result;
        };
        reader.readAsDataURL(file);
        //console.log(reader)
        //console.log(reader.readAsDataURL(file))
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
        const formData = new FormData();
        formData.append('file', this.selectedFile);



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
					this.$root.$emit('bv::refresh::table', 'videosTable')

				} else {
          this.$bvToast.toast(`L'operazione non è stata conclusa.`, {
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
