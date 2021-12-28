<template>
  <div class="p-fluid p-d-flex p-justify-end">
    <Button icon="pi pi-github" class="p-button-text p-button-rounded p-button-plain" v-on:click="openWebPage('https://github.com/NoudH/timewinder')"/>
    <Button icon="pi pi-cog" class="p-button-text p-button-rounded p-button-plain" v-on:click="showSettings = !showSettings"/>
    <Dialog header="Settings" :draggable="false" v-model:visible="showSettings" :style="{width: '50vw'}">
      <div class="p-fluid">
        <div class="p-field">
          <label for="LeagueLocation">League of Legends folder</label>
          <div class="p-inputgroup">
            <InputText :disabled="true" id="LeagueLocation" placeholder="C:\Riot Games\League of Legends" v-model="pr_settings.leagueLocation"/>
            <Button icon="pi pi-folder" v-on:click="openFileDialog"/>
          </div>
          <br>
          <label for="MaxBackups">Max backups</label>
          <InputNumber id="MaxBackups" placeholder="0" :min="0" v-model="pr_settings.maxBackups" showButtons/>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" v-on:click="showSettings = false"/>
        <Button
            label="Save" :icon="'pi pi-save'"
            v-on:click="() => {$emit('save-settings', pr_settings); this.showSettings = false;}"
            autofocus
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import {remote, shell} from "electron";

export default {
  name: "Settings",
  props: {
    settings: Object
  },
  emits: ["save-settings"],
  data() {
    return {
      pr_settings: this.settings,
      showSettings: false,
    }
  },
  methods: {
    openFileDialog: function () {
      remote.dialog.showOpenDialog({ properties: ['openDirectory'] })
        .then(response => {
          if(!response.canceled) {
            this.pr_settings.leagueLocation = response.filePaths[0]
          }
        });
    },
    openWebPage: function (page) {
      shell.openExternal(page);
    }
  },
}
</script>

<style scoped>

</style>