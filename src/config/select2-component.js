import Vue from 'vue'
import Select2 from 'v-select2-component';
import 'select2/dist/js/i18n/it'

Vue.component('Select2', Select2);

$.fn.select2.defaults.set("width", "100%");
$.fn.select2.defaults.set("language", "it");
$.fn.select2.defaults.set("allowClear", true);