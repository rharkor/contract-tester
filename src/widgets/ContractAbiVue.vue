<template>
  <div class="contract-abi">
    <div class="form-floating">
      <textarea
        class="form-control"
        placeholder="Enter the smart contract ABI here"
        id="smart-contract-abi"
        v-model="abiCode"
      ></textarea>
      <label for="smart-contract-abi"
        >Enter the smart contract json abi here</label
      >
    </div>
    <button
      :class="`btn btn-primary ${abiCode ? 'visible' : ''}`"
      @click="this.$emit('interactWithContract', abiCode)"
    >
      Interact !
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      abiCode: null,
    };
  },
};
</script>

<style scope lang="sass">
.contract-abi
  display: flex
  flex-direction: column
  gap: 2rem
  height: 100%
  padding-bottom: 2rem

  label
    color: rgba(#212529, 70%)

  .form-floating, textarea
    height: 100% !important

  button
    transition: height .5s ease-in-out
    height: 0px
    overflow: hidden
    padding: 0px
    border: none

    &.visible
      height: 70px
</style>