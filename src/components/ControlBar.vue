<template>
  <Toolbar class="p-br-0 toolbar p-p-0">
    <template #end>
      <Button icon="pi pi-minus" class="p-button-text p-button-plain p-mr-1" v-on:click="minimize"/>
      <Button icon="pi pi-stop" class="p-button-text p-button-plain p-mr-1" v-on:click="maximize"/>
      <Button icon="pi pi-times" class="p-button-text p-button-plain close-button" v-on:click="close"/>
    </template>
  </Toolbar>
</template>

<script>
import {ipcRenderer} from "electron";

export default {
  name: "ControlBar",
  methods: {
    close: function () {
      ipcRenderer.send('close');
    },
    maximize: function () {
      ipcRenderer.send('maximize');
    },
    minimize: function () {
      ipcRenderer.send('minimize');
    }
  }
}
</script>

<style scoped>
.toolbar {
  -webkit-app-region: drag;
  z-index: 9999999;
}

.toolbar * {
  -webkit-app-region: no-drag;
}

.close-button:hover {
  background: #b73131 !important;
}

.close-button:focus {
  box-shadow: 0 0 0 1px #b73131 !important;
}
</style>