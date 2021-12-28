<template>
  <div style="height: 100vh" class="p-d-flex p-flex-column">
    <ControlBar/>
    <Card class="p-br-0 main p-d-flex">
      <template #content>
        <HelloWorld/>
      </template>
    </Card>
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import ControlBar from "./components/ControlBar";

export default {
  name: 'App',
  components: {
    ControlBar,
    HelloWorld
  },
}
</script>

<style>
.main {
  flex: 1 1 0;
  overflow-y: auto;
  overflow-x: hidden;
  border-left: 1px solid #383838;
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
  background-color: var(--yellow-200);
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
