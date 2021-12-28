<template>
  <div class="p-fluid p-d-flex p-justify-end">
    <Button icon="pi pi-cog" class="p-button-text p-button-rounded p-button-plain" v-on:click="showSettings = !showSettings"/>
    <Dialog header="Settings" :draggable="false" v-model:visible="showSettings" :style="{width: '50vw'}">
      <div class="p-fluid">
        <div class="p-field">
          <label for="LeagueLocation">League of Legends folder</label>
          <div class="p-inputgroup">
            <InputText id="LeagueLocation" placeholder="C:\Riot Games\League of Legends" :model-value="pr_settings.leagueLocation"/>
            <Button icon="pi pi-folder" v-on:click="openFileDialog"/>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" class="p-button-text" v-on:click="showSettings = false"/>
        <Button :disabled="saving" label="Save" :icon="saving ? 'pi pi-spin pi-spinner' : 'pi pi-save'" autofocus v-on:click="saveSettings"/>
      </template>
    </Dialog>
  </div>
</template>

<script>
import {remote} from "electron";
import fs from "fs";

export default {
  name: "Settings",
  props: {
    settings: Object
  },
  data() {
    return {
      pr_settings: this.settings,
      showSettings: false,
      saving: false,
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
    saveSettings: function () {
      this.saving = true;
      fs.writeFile("settings.json", JSON.stringify(this.pr_settings), () => {
        this.saving = false;
        this.showSettings = false;
      })
    }
  },
}
</script>

<style scoped>

</style>