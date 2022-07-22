<template>
  <div class="home">
    <ContractSearchBarVue />
  </div>
</template>

<script>
import ContractSearchBarVue from "@/components/ContractSearchBarVue.vue";
export default {
  components: {
    ContractSearchBarVue,
  },
};
</script>

<style scoped lang="sass">
.home
  height: 100%
</style>