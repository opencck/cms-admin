import Vue from 'vue';
import VueSweetalert2 from '../lib/vueSweetalert2.js';

//import 'sweetalert2/dist/sweetalert2.min.css';
import '@sweetalert2/theme-dark/dark.scss';

Vue.use(VueSweetalert2);

/**
 * https://forum.vuejs.org/t/nuxt-how-to-use-vue-swal-plugin-in-middleware/21135/3
 * https://github.com/avil13/vue-sweetalert2/pull/99/commits/c1b1a67d19f8e05be446033e71ba6d5854abe650
 * @param ctx
 * @param inject
 */
export default (ctx, inject) => {
    inject('swal', Vue.swal);
};
