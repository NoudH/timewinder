import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/arya-orange/theme.css'; //theme
import 'primevue/resources/primevue.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css';
import ScrollPanel from 'primevue/scrollpanel';
import ProgressSpinner from 'primevue/progressspinner';
import Panel from 'primevue/panel';
import Card from 'primevue/card';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';

const app = createApp(App);

app.use(PrimeVue, {ripple: true});

app.component("ScrollPanel", ScrollPanel);
app.component("ProgressSpinner", ProgressSpinner);
app.component("Panel", Panel);
app.component("Card", Card);
app.component("Toolbar", Toolbar);
app.component("Button", Button);

app.mount('#app');