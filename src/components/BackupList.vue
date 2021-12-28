<template>
  <h2>Backups</h2>
  <Accordion class="p-fluid">
    <AccordionTab v-for="backup in backups" :key="backup" :header="backup" class="p-fluid">

    </AccordionTab>
  </Accordion>
</template>

<script>

export default {
  name: "BackupList",
  props: {
    backups: Array
  },
}
</script>

<style scoped>

</style>