import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/arya-blue/theme.css'; //theme
import 'primevue/resources/primevue.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css';
import ScrollPanel from 'primevue/scrollpanel';
import ProgressSpinner from 'primevue/progressspinner';

const app = createApp(App);

app.use(PrimeVue, {ripple: true});

app.component("ScrollPanel", ScrollPanel);
app.component("ProgressSpinner", ProgressSpinner);

app.mount('#app');