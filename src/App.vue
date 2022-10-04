<template>
  <div style="height: 100vh" class="p-d-flex p-flex-column">
    <ControlBar/>
    <Toast class="p-mt-5"/>
    <Card class="p-br-0 main p-d-flex">
      <template #content>
        <Settings :settings="settings" v-on:save-settings="saveSettings"/>
        <BackupList
            :backups="backups"
            v-on:reload-backups="readBackups"
            v-on:create-backup="createBackup"
            v-on:delete-backup="deleteBackup"
            v-on:restore-backup="restoreBackup"
            v-on:open-folder="openInFolder"
        />
      </template>
    </Card>
  </div>
  <Dialog :modal="true" v-model:visible="showProgress" :show-header="false" :style="{width: '50vw'}">
    <div class="p-d-flex p-justify-center">
      <h2>Restoring backup...</h2>
    </div>
    <div class="p-d-flex p-justify-center">
      <ProgressSpinner style="width:100px;height:100px"/>
    </div>
  </Dialog>
</template>

<script>
import fs from "fs";
import ControlBar from "./components/ControlBar";
import BackupList from "./components/BackupList";
import Settings from "./components/Settings";
import * as path from "path";
import yaml from "js-yaml";
import axios from "axios";
import {ipcRenderer} from "electron";
import {execSync} from "child_process";

export default {
  name: 'App',
  components: {
    Settings,
    BackupList,
    ControlBar,
  },
  data() {
    return {
      showProgress: false,
      backups: [],
      //Default settings
      settings: {
        leagueLocation: 'C:\\Riot Games\\League of Legends',
        maxBackups: 5,
        automaticBackups: {
          enabled: false,
          time: "18:00",
          frequency: null
        }
      }
    }
  },
  methods: {
    openInFolder: function (backup) {
      ipcRenderer.invoke("open-folder", backup)
    },
    readBackups: function () {
      fs.readdir("backups", (err, files) => {
        this.backups = files.sort().reverse();
      })
    },
    createBackup: function () {
      ipcRenderer.invoke("create-backup")
          .then(backup => {
            if (backup) {
              this.backups.unshift(backup)
              if (this.settings.maxBackups > 0 && this.backups.length > this.settings.maxBackups)
                this.backups.pop();
            }
          })
          .catch(e => this.$toast.add({severity: 'error', summary: 'Backup failed!', detail: e.message, life: 10000}))
    },
    deleteBackup: function (backup) {
      fs.rmdirSync(path.join("backups", backup), {recursive: true})

      this.backups = this.backups.filter(x => x !== backup);
    },
    restoreBackup: async function (backup) {
      if (fs.existsSync(path.join(this.settings.leagueLocation, "lockfile"))) {
        try {
          this.showProgress = true;
          const lockfileData = fs.readFileSync(
              path.join(this.settings.leagueLocation, "lockfile"),
              {encoding: "utf-8"}
          ).split(':');

          const accountPrefs = yaml.load(
              fs.readFileSync(
                  path.join("backups", backup, "LCUAccountPreferences.yaml"),
                  {encoding: "utf-8"}
              )
          )

          const localPrefs = yaml.load(
              fs.readFileSync(
                  path.join("backups", backup, "LCULocalPreferences.yaml"),
                  {encoding: "utf-8"}
              )
          )

          let token = Buffer.from(`riot:${lockfileData[3]}`, 'ascii').toString("base64");

          let promises = Promise.all(
              Object.entries(accountPrefs).map(value => axios.put(
                  `${lockfileData[4]}://127.0.0.1:${lockfileData[2]}/lol-settings/v1/account/${value[0]}`,
                  value[1],
                  {
                    headers: {
                      'Authorization': `Basic ${token}`
                    }
                  }
              )).concat(
                  Object.entries(localPrefs).map(value => axios.patch(
                      `${lockfileData[4]}://127.0.0.1:${lockfileData[2]}/lol-settings/v2/local/${value[0]}`,
                      value[1],
                      {
                        headers: {
                          'Authorization': `Basic ${token}`
                        }
                      }
                  ))
              )
          );

          await promises;

          this.showProgress = false;

          this.$toast.add({
            severity: 'success',
            summary: 'Backup restored',
            detail: "The backup has successfully been restored!",
            life: 5000
          });
        } catch (e) {
          this.showProgress = false;
        }
      } else {
        this.$toast.add({
          severity: 'error',
          summary: 'League client unavailable!',
          detail: "The League client needs to be running in order to restore backups!",
          life: 5000
        });
        this.showProgress = false;
      }
    },
    saveSettings: function (newSettings) {
      if (JSON.stringify(newSettings.automaticBackups) !== JSON.stringify(this.settings.automaticBackups)){
        try {
          if (newSettings.automaticBackups?.enabled) {
            execSync(`schtasks /Create /RU SYSTEM /TN timewinder /TR "'${path.resolve('.', 'timewinder.exe')}' --headless --create-backup"`
                + ` /SC ${newSettings.automaticBackups.frequency.frequency} /ST ${newSettings.automaticBackups.time} /F`)
            this.$toast.add({
              severity: 'success',
              summary: 'Automatic backups setup',
              detail: 'Automatic backups have been setup successfully.',
              life: 5000
            });
          } else {
            execSync(`schtasks /Delete /TN timewinder /F`);
            this.$toast.add({
              severity: 'success',
              summary: 'Automatic backups disabled',
              detail: 'Automatic backups have been disabled successfully.',
              life: 5000
            });
          }
        } catch (e) {
          this.$toast.add({
            severity: 'error',
            summary: 'An error has occurred with Automatic backups!',
            detail: e.message,
            life: 5000
          });
          throw e;
        }
      }

      fs.writeFileSync("settings.json", JSON.stringify(newSettings), () => {});

      this.settings = JSON.parse(JSON.stringify(newSettings));
      ipcRenderer.send("save-settings");
    },
  },
  created() {
    if (fs.existsSync("settings.json")) {
      Object.assign(
          this.settings,
          JSON.parse(
              fs.readFileSync("settings.json", {encoding: "utf-8", flag: "r"})
          ) || {}
      )
    }

    this.readBackups();
  }
}
</script>

<style>
.main {
  flex: 1 1 0;
  overflow-y: auto;
  overflow-x: hidden;
  border-left: 1px solid #383838;
  background: var(--surface-b) !important;
}

.main > .p-card-body {
  width: 100%;
}

.main > .p-card-body > .p-card-content {
  padding: 0 0 1rem 0;
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: var(--surface-b);
  border-radius: 5px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background-color: var(--primary-color);
  border-radius: 5px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background-color: var(--blue-400);
}

.p-br-0 {
  border-radius: 0 !important;
}

.p-br-50 {
  border-radius: 50% !important;
}

.p-button.p-button-plain:focus {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.6);
}

body {
  margin: 0;
}
</style>
