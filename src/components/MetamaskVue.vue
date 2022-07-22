<template>
  <div class="metamask-vue"></div>
</template>

<script>
export default {
  beforeCreate() {
    console.log("registerWeb3 Action dispatched from MetamaskVue.vue");
    this.$store.dispatch("registerWeb3");
  },
};
</script>

<style lang="sass" scoped>
.metamask-vue
  display: none
</style>