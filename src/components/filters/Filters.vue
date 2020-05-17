<template>
  <div class="q-pa-md">
    <q-btn-dropdown label="Filters">
      <div class="row no-wrap q-pa-md">
        <div class="column">
          <q-toggle v-model="bluetooth" label="Bluetooth" />
        </div>

        <q-separator vertical inset class="q-mx-lg" />

        <div class="column items-center"></div>
      </div>
    </q-btn-dropdown>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mobileData: true,
      bluetooth: true
    };
  }
};
</script>
