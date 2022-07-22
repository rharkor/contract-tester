<template>
  <div class="searchbar">
    <i class="fa-solid fa-magnifying-glass"></i>
    <input
      class="form-control form-input"
      :placeholder="placeHolder"
      v-bind="contractAddress"
      v-on:input="
        (value) => {
          if (debounce) debounceInput(value);
          else emitInput(value);
        }
      "
    />
  </div>
</template>

<script>
const debounce = require("debounce");

export default {
  props: {
    placeHolder: {
      default: "",
      type: String,
    },
    debounce: {
      default: true,
      type: Boolean,
    },
  },
  data: () => ({
    contractAddress: null,
  }),
  methods: {
    debounceInput: debounce(function (e) {
      this.$emit("valueChange", e.target.value);
    }, 500),
    emitInput(e) {
      this.$emit("valueChange", e.target.value);
    },
  },
};
</script>

<style lang="sass" scoped>
.searchbar
  position: relative
  width: 100%

  i
    position: absolute
    left: 20px
    color: var(--blue)
    top: 50%
    transform: translateY(-50%)

  input
    height: 100%
    min-height: 55px
    text-indent: 33px
    border-radius: 10px
</style>
