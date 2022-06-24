import Vue from 'vue'
// Vue validate
import {
	ValidationObserver,
	ValidationProvider,
	extend,
	localize
} from "vee-validate";

import it from "vee-validate/dist/locale/it.json";
import * as rules from "vee-validate/dist/rules";

// Install VeeValidate rules and localization
Object.keys(rules).forEach(rule => {
	extend(rule, rules[rule]);
});

// Aggiungi regola per i campi booleani.
extend('isTruthy', value => {
	return value && true;
});

// -------------------------------

// Imposta la lingua di default per i messaggi
localize("it", it);

// Install VeeValidate components globally
Vue.component("ValidationObserver", ValidationObserver);
Vue.component("ValidationProvider", ValidationProvider);