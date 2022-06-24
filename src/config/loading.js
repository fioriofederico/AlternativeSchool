import Vue from 'vue'
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.use(Loading, {
    loader: 'dots',
    color: '#e77204'
});