<template>
  <div style="height: 100vh" class="p-d-flex p-flex-column">
    <ControlBar/>
    <Card class="p-br-0 main p-d-flex">
      <template #content>
        <Settings :settings="settings"/>
        <BackupList
            :backups="backups"
            v-on:reload-backups="readBackups"
            v-on:create-backup="createBackup"
            v-on:delete-backup="deleteBackup"
        />
      </template>
    </Card>
  </div>
</template>

<script>
import fs from "fs";
import ControlBar from "./components/ControlBar";
import BackupList from "./components/BackupList";
import Settings from "./components/Settings";
import * as path from "path";
import {format} from "date-fns";

export default {
  name: 'App',
  components: {
    Settings,
    BackupList,
    ControlBar,
  },
  data() {
    return {
      backups: [],
      settings: {
        leagueLocation: ''
      }
    }
  },
  methods: {
    readBackups: function () {
      fs.readdir("backups", (err, files) => {
        this.backups = files;
      })
    },
    createBackup: function () {
      let date = format(new Date(), "yyyy-MM-dd HH-mm-ss")

      if(!fs.existsSync(this.settings.leagueLocation)) {
        //FIXME: show settings when League is not located
      }

      fs.mkdirSync( path.join("backups", date), { recursive: true });

      fs.copyFileSync(
          path.join(this.settings.leagueLocation, "Config", "LCUAccountPreferences.yaml"),
          path.join("backups", date , "LCUAccountPreferences.yaml")
      )
      fs.copyFileSync(
          path.join(this.settings.leagueLocation, "Config", "LCULocalPreferences.yaml"),
          path.join("backups", date, "LCULocalPreferences.yaml")
      )

      this.backups.unshift(date);
    },
    deleteBackup: function (backup) {
      fs.rmdirSync(path.join("backups", backup), { recursive: true })

      this.backups = this.backups.filter(x => x !== backup);
    }
  },
  created() {
    if(fs.existsSync("settings.json")) {
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
