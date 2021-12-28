import { createApp } from 'vue'
import App from './App.vue'
import './axios.config';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/arya-blue/theme.css'; //theme
import 'primevue/resources/primevue.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
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
import InputNumber from "primevue/inputnumber";
import FileUpload from 'primevue/fileupload';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import ProgressBar from "primevue/progressbar";

const app = createApp(App);

app.use(PrimeVue, {ripple: true});
app.use(ConfirmationService);
app.use(ToastService);

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
app.component("InputNumber", InputNumber);
app.component("FileUpload", FileUpload);
app.component("ConfirmDialog", ConfirmDialog);
app.component("Toast", Toast);
app.component("ProgressBar", ProgressBar);

app.mount('#app');