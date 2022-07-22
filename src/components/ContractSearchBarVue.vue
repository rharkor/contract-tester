<template>
  <div class="contract-search-bar">
    <MetamaskVue />
    <ConnectedChainVue :web3="web3" />
    <div class="content">
      <div class="form">
        <SearchBarVue
          place-holder="Enter a contract address"
          v-on:value-change="retreiveContract"
        />
        <button
          class="continue btn btn-success"
          v-if="contractFound"
          @click="accessContractDetails"
        >
          Continue <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";

import MetamaskVue from "./MetamaskVue.vue";
import ConnectedChainVue from "@/widgets/ConnectedChainVue.vue";
import SearchBarVue from "@/widgets/SearchBarVue.vue";

export default {
  setup() {
    // Get toast interface
    const toast = useToast();
    return { toast };
  },
  data: () => ({ contractAddress: null, contractFound: false }),
  computed: {
    web3() {
      return this.$store.state.web3;
    },
  },
  methods: {
    async retreiveContract(value) {
      this.contractAddress = value;
      const addressRegex = new RegExp(/^0x[a-fA-F0-9]{40}$/);
      if (this.web3.isInjected && value && addressRegex.test(value)) {
        const { eth } = this.web3.web3Instance();
        try {
          const contract = await eth.getCode(
            // "0x623D21efF769ff08f8018C78f86F03CCaA11a2eD" // Swingswiss
            // "0x4E6485eBDd882d5F1f10Ed77922C428A718Dd576" // Oyabun
            // ""
            value
          );

          if (contract && contract !== "0x") {
            this.toast.success("Contract found!");
            this.contractFound = true;
          } else {
            this.toast.error("Didn't found the contract..");
            console.log(this.web3);
            this.contractFound = false;
          }
        } catch (err) {
          this.toast.error("The address checksum is invalid");
          this.contractFound = false;
        }
      }
    },
    accessContractDetails() {
      this.$router.push(`/contract/${this.contractAddress}`);
    },
  },
  components: {
    MetamaskVue,
    SearchBarVue,
    ConnectedChainVue,
  },
};
</script>

<style scoped lang="sass">
.contract-search-bar
  height: 100%
  .content
    height: 100%
    display: flex
    justify-content: center
    align-items: center
    margin-top: -3.5rem

    .form
      width: 80%
      display: flex
      flex-direction: row
      gap: .5rem

      .continue
        animation: enter-smooth .3s
        white-space: nowrap
        overflow: hidden
        width: 130px

      @keyframes enter-smooth
        0%
          width: 0px
</style>