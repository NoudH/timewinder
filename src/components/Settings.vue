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
          <br>
          <br>
          <label for="AutomaticBackups">Automatic Backups</label>
          <br>
          <InputSwitch
              id="AutomaticBackups"
              v-model="pr_settings.automaticBackups.enabled"
              :disabled="!pr_isAdmin"
          />
          <div v-if="pr_settings.automaticBackups.enabled">
            <br>
            <label for="AutomaticBackups_Frequency">Frequency</label>
            <Dropdown
                id="AutomaticBackups_Frequency"
                v-model="pr_settings.automaticBackups.frequency"
                :options="automaticOptions"
                optionLabel="name"
                placeholder="Automatic backups"
                :disabled="!pr_isAdmin"
            />
            <br>
            <label for="AutomaticBackups_Time">Time</label>
            <InputMask
                id="AutomaticBackups_Time"
                v-model="pr_settings.automaticBackups.time"
                mask="99:99"
                placeholder="18:00"
                :disabled="!pr_isAdmin"
            />
          </div>
          <br>
          <span v-if="!pr_isAdmin" style="font-size: small; color: var(--text-color-secondary)"><i>(Requires Admin privileges)</i></span>
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
import {exec} from "child_process";

export default {
  name: "Settings",
  props: {
    settings: Object
  },
  emits: ["save-settings"],
  data() {
    return {
      pr_settings: JSON.parse(JSON.stringify(this.settings)),
      pr_isAdmin: false,
      showSettings: false,
      automaticOptions: [
        {name: "Daily", frequency: "DAILY"},
        {name: "Weekly", frequency: "WEEKLY"},
        {name: "Monthly", frequency: "MONTHLY"},
      ]
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
    },
  },
  created() {
    exec('NET SESSION', null, (error, stdout, stderr) => {
      this.pr_isAdmin = (stderr.length === 0);
    })
  }
}
</script>

<style scoped>

</style>