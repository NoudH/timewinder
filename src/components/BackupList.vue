<template>
  <ConfirmDialog/>
  <div class="p-d-flex p-fluid p-justify-between">
    <h2>Backups</h2>
    <div class="p-as-center">
      <Button icon="pi pi-refresh" class="p-button-text p-button-rounded p-button-plain" v-on:click="$emit('reload-backups')"/>
    </div>
  </div>
  <div v-if="backups.length > 0">
    <Accordion class="">
      <AccordionTab v-for="backup in backups" :key="backup" :header="backup">
        <div class="p-d-flex p-jc-end">
          <Button icon="pi pi-folder-open" label="Open in folder" class="p-button-outlined p-button-warning p-mr-2" v-on:click="$emit('open-folder', backup)"/>
          <Button icon="pi pi-trash" label="Delete" class="p-button-outlined p-button-danger p-mr-2" v-on:click="confirmDelete(backup)"/>
          <Button icon="pi pi-sync" label="Restore" class="p-button-outlined p-button-success" v-on:click="confirmRestore(backup)"/>
        </div>
      </AccordionTab>
    </Accordion>
    <Button icon="pi pi-plus" label="Backup" class="p-mt-2" v-on:click="$emit('create-backup')"/>
  </div>
  <Card v-else>
    <template #content>
      <div class="p-d-flex p-justify-center">
        <h3>No backups found!</h3>
      </div>
      <div class="p-d-flex p-justify-center">
        <Button icon="pi pi-plus" label="Create backup" v-on:click="$emit('create-backup')"/>
      </div>
    </template>
  </Card>
</template>

<script>

export default {
  name: "BackupList",
  props: {
    backups: Array
  },
  emits: [
    "reload-backups",
    "create-backup",
    "restore-backup",
    "delete-backup",
    "open-folder"
  ],
  methods: {
    confirmDelete: function (backup) {
      this.$confirm.require({
        message: `Are you sure you want to delete backup '${backup}'?`,
        header: 'Delete backup',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.$emit('delete-backup', backup);
        },
      });
    },
    confirmRestore: function (backup) {
      this.$confirm.require({
        message: `Are you sure you want to restore to backup '${backup}'?`,
        header: 'Restore backup',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.$emit('restore-backup', backup);
        },
      });
    },
  }
}
</script>

<style scoped>

</style>