<template>
  <div class="form-wrap">
    <h3 class="form-title">{{title}}</h3>
    <p class="form-description">{{description}}</p>
    <div class="login--wrap">
      <div class="signin-form-wrap">
        <ValidationObserver v-slot="{ invalid }">
          <b-form id="formContainer" ref="formContainer">
            <slot name="formInputs" :invalid="invalid"></slot>
          </b-form>

        <div class="after-form">
          <slot name="afterForm"></slot>
        </div>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Form',
  props: {
    title: {
      type: String
    },
    description: {
      type: String
    }
  }
}
</script>

<style scope>
.form-title {
  color: var(--grey);
  font-size: 1rem;
  letter-spacing: .5px;
  margin-bottom: 2rem;
  text-align: center;
  text-transform: uppercase;
}

.form-description {
  text-align: center;
  margin-bottom: 2rem;
}

.btn.btn-submit {
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.btn.btn-submit:hover {
  opacity: .8
}
</style>