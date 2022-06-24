import Vue from 'vue';
import VueSweetalert2 from 'vue-sweetalert2';

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-bootstrap-4';

const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
  customClass: {
    confirmButton: 'btn btn-success m-1 rounded-0',
    cancelButton: 'btn btn-danger m-1 rounded-0'
  },
  buttonsStyling: false
};

Vue.use(VueSweetalert2, options);