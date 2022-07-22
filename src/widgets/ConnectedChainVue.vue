<template>
  <div
    class="connected-chain"
    :style="returnHome ? 'justify-content: space-between' : ''"
  >
    <div class="return-home" v-if="returnHome">
      <router-link to="/" class="nav-link"
        ><i class="fa-solid fa-chevron-left"></i> Return home</router-link
      >
    </div>
    <div class="content">
      {{ chain }}
    </div>
  </div>
</template>

<script>
import { NETWORKS } from "@/util/constants/network";

export default {
  props: {
    web3,
    returnHome: {
      default: false,
    },
  },
  computed: {
    chain() {
      if (this.web3.isInjected) {
        return NETWORKS[this.web3.chainId];
      }
      return null;
    },
  },
};
</script>

<style lang="sass" scoped>
.connected-chain
  display: flex
  justify-content: flex-end
  align-items: center
  padding: 1rem

.content
  width: 200px
  border-radius: 10px
  height: 40px
  background-color: var(--blue-50)
  display: flex
  justify-content: center
  align-items: center
  overflow: hidden
</style>