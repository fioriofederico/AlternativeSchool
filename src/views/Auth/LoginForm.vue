<template>
  <Form
    :title="formTitle"
    :description="formDescription"
  >
    <template v-slot:formInputs="state">
      <validation-provider
        name="Username"
        :rules="{ required: true }"
        v-slot="validationContext"
      >
        <b-form-group>
          <b-form-input
            id="username"
            type="text"
            placeholder="Username"
            v-model.trim="form.username"
            :state="getValidationState(validationContext)"
          >
          </b-form-input>

          <b-form-invalid-feedback id="input-username-feedback">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <validation-provider
        name="Password"
        :rules="{ required: true }"
        v-slot="validationContext"
      >
        <b-form-group>
          <b-input-group>
            <b-form-input
              id="password"
              :type="!showPassword ? 'password' : 'text'"
              placeholder="Password"
              v-model.trim="form.password"
              :state="getValidationState(validationContext)"
            ></b-form-input>

            <b-input-group-append>
              <b-button variant="success" squared @click="showPassword = !showPassword">
                <font-awesome-icon icon="eye"></font-awesome-icon>
              </b-button>
            </b-input-group-append>
          </b-input-group>

          <b-form-invalid-feedback id="input-password-feedback">
            {{ validationContext.errors[0] }}
          </b-form-invalid-feedback>
        </b-form-group>
      </validation-provider>

      <b-button block squared type="submit" class="btn-submit" @click="onSubmit"
        :variant="state.invalid == true ? 'danger' : 'success'" :disabled="state.invalid == true ? true : false">
        Accedi
      </b-button>

    </template>

    <template v-slot:afterForm>
      <div class="after-form--link resetLink mt-3">
        <b-button block squared href="#" type="submit" class="btn-submit" @click="$store.state.auth.toShow = 'Register'">
          Registrati
        </b-button>
      </div>
    </template>
  </Form>
</template>

<script>
  import Form from '../../components/Auth/Form.vue'
  export default {
    name: 'LoginForm',
    components: {
      Form
    },
    data() {
      return {
        formTitle: "Richiesta di accesso",
        formDescription: "Inserisci username e password per accedere alla piattaforma.",
        form: {
          fullname: '',
          email: '',
          phone: ''
        },
        showPassword: false
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
      async onSubmit(ev) {
        ev.preventDefault();

        const loader = await this.$store.dispatch('showLoader')

        const res = await this.$store.dispatch('auth/login', {
          username: this.form.username,
          password: this.form.password
        });

        loader.hide();

        if (res?.status && res.status == 200) {
          // Resetta i campi del form
          this.form = {};
        }

      }
    }
  }
</script>
