import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/arya-blue/theme.css'; //theme
import 'primevue/resources/primevue.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css';
import ScrollPanel from 'primevue/scrollpanel';
import ProgressSpinner from 'primevue/progressspinner';
import Panel from 'primevue/panel';
import Card from 'primevue/card';
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Dialog from 'primevue/dialog';
import InputText from "primevue/inputtext";
import FileUpload from 'primevue/fileupload';

const app = createApp(App);

app.use(PrimeVue, {ripple: true});

app.component("ScrollPanel", ScrollPanel);
app.component("ProgressSpinner", ProgressSpinner);
app.component("Panel", Panel);
app.component("Card", Card);
app.component("Toolbar", Toolbar);
app.component("Button", Button);
app.component("Accordion", Accordion);
app.component("AccordionTab", AccordionTab);
app.component("Dialog", Dialog);
app.component("InputText", InputText);
app.component("FileUpload", FileUpload);

app.mount('#app');