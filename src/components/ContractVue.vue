<template>
  <div class="contract-vue">
    <MetamaskVue />
    <ConnectedChainVue :web3="web3" :returnHome="true" />
    <div class="topbar"><ConverterVue /></div>
    <div class="container" style="height: 100%">
      <ContractAbi
        v-if="contractValidated && !abiCode"
        class="container-abi"
        @interactWithContract="interact"
      />

      <div class="interactions" v-if="abiCode">
        <div class="search">
          <SearchBarVue
            v-on:value-change="findMethod"
            :debounce="false"
          ></SearchBarVue>
          <div class="sub">
            <a
              class="address-link"
              @click="
                () => {
                  copyText(web3.accounts[0]);
                }
              "
              >{{ web3.accounts ? web3.accounts[0] : "" }}</a
            >
            &nbsp;|&nbsp;
            <button class="btn btn-outline-warning" @click="resetAbi">
              Change the abi
            </button>
          </div>
        </div>
        <div class="group" v-for="method in Object.keys(methods)" :key="method">
          <form
            v-for="button in methods[method]"
            :key="button.name"
            class="basic-form"
            :id="`form-${button.name}`"
            @submit="
              (e) => {
                e.preventDefault();
                this.execute(button.name, e);
              }
            "
          >
            <input
              v-if="button.stateMutability === 'payable'"
              placeholder="WEI to send"
              class="form-control text-light place-light"
              style="background-color: rgba(25, 255, 25, 0.3)"
              type="number"
            />
            <input
              v-for="input in button.inputsFormatted"
              class="form-control"
              :type="input.form"
              :key="input.name"
              :placeholder="`${input.type}: ${input.name}`"
              :data-inputtype="input.type"
            />
            <button
              :class="`btn btn-${button.stateMutabilityColor}`"
              type="submit"
            >
              {{ button.name }}
            </button>
            <div class="result">
              <div
                class="d-flex align-items-center justify-content-between w-100"
              >
                <div class="text" :id="`text-${button.name}`"></div>
                <button
                  class="btn btn-dark btn-copy"
                  type="button"
                  @click="
                    () => {
                      copy(button.name);
                    }
                  "
                >
                  <i class="fa-solid fa-copy"></i>
                </button>
              </div>
              <div class="loader">
                <LoaderVue />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick } from "vue";

import { POSITION, useToast } from "vue-toastification";

import MetamaskVue from "./MetamaskVue.vue";
import ConnectedChainVue from "@/widgets/ConnectedChainVue.vue";
import ContractAbi from "@/widgets/ContractAbiVue.vue";
import LoaderVue from "../widgets/LoaderVue.vue";
import SearchBarVue from "@/widgets/SearchBarVue.vue";
import ConverterVue from "./ConverterVue.vue";

export default {
  setup() {
    // Get toast interface
    const toast = useToast();
    return { toast };
  },
  computed: {
    web3() {
      return this.$store.state.web3;
    },
    contractAddress() {
      return this.$route.params.address;
    },
  },
  data: () => ({
    contractValidated: null,
    abiCode: null,
    contract: null,
    methods: [],
  }),
  methods: {
    async retreiveContract() {
      if (this.web3.isInjected && this.web3.web3Instance) {
        const { eth } = this.web3.web3Instance();
        // eth.handleRevert = true;
        const { address } = this.$route.params;
        try {
          const contract = await eth.getCode(address);
          if (!contract || contract === "0x") {
            this.toast.error("Didn't found the contract..");
            this.$router.push("/");
            return;
          }
          this.contractValidated = !!contract;
        } catch (err) {
          if (err.code === -32603) {
            this.retreiveContract();
            return;
          }
          console.error(err);
          this.toast.error("The address checksum is invalid");
          this.$router.push("/");
        }
      }
    },
    async resetAbi() {
      localStorage.setItem(this.contractAddress, null);
      this.abiCode = null;
      this.contract = null;
    },
    async interact(abiCode) {
      this.abiCode = JSON.parse(abiCode);
      // Save it to the local storage
      const { address } = this.$route.params;
      localStorage.setItem(address, abiCode);

      if (this.web3.isInjected && this.web3.web3Instance) {
        const { eth } = this.web3.web3Instance();
        // Create the contract
        this.contract = new eth.Contract(this.abiCode, address);

        // const test = await this.contract.methods.symbol().call();
        let allMethods = this.abiCode.filter((el) => el.type === "function");
        allMethods.map((el) => {
          switch (el.stateMutability) {
            case "view":
              el.stateMutabilityColor = "primary";
              el.stateOrder = 0;
              break;
            case "nonpayable":
              el.stateMutabilityColor = "warning";
              el.stateOrder = 1;
              break;
            case "payable":
              el.stateMutabilityColor = "danger";
              el.stateOrder = 2;
              break;
            default:
              el.stateMutabilityColor = "dark";
              el.stateOrder = 3;
          }

          el.inputsFormatted = [];
          el.inputs.map((_, i) => {
            el.inputsFormatted[i] = { form: "text" };
            if (_.type.match(/uint.*/)) {
              el.inputsFormatted[i] = { form: "number" };
            }
            el.inputsFormatted[i] = {
              ...el.inputsFormatted,
              name: _.name,
              type: _.type,
            };
          });

          return el;
        });

        let allMethodsFiltered = {};
        allMethods.forEach((el) => {
          if (el.stateOrder === 0) {
            if (!allMethodsFiltered[0]) allMethodsFiltered[0] = [];
            allMethodsFiltered[0].push(el);
          }
          if (el.stateOrder === 1) {
            if (!allMethodsFiltered[1]) allMethodsFiltered[1] = [];
            allMethodsFiltered[1].push(el);
          }
          if (el.stateOrder === 2) {
            if (!allMethodsFiltered[2]) allMethodsFiltered[2] = [];
            allMethodsFiltered[2].push(el);
          }
          if (el.stateOrder === 3) {
            if (!allMethodsFiltered[3]) allMethodsFiltered[3] = [];
            allMethodsFiltered[3].push(el);
          }
        });

        this.methods = allMethodsFiltered;

        await nextTick();
        // Execute all the view methods without inputs data
        this.methods[0].forEach(async (el) => {
          if (el.inputsFormatted.length === 0) {
            const resultEl = document.querySelector(
              "#form-" + el.name + " .result"
            );
            const refresh = async () => {
              resultEl.classList.add("loading");
              try {
                const result = await this.contract.methods[el.name]().call({
                  from: this.web3.accounts[0],
                });
                resultEl.querySelector(".text").innerText = result;
              } catch (e) {}
              resultEl.classList.remove("loading");
            };
            setInterval(async () => {
              refresh();
            }, 5000);
            refresh();
          }
        });
      }
    },
    async execute(name, event) {
      const { target } = event;
      const values = [];
      const formData = Array.from(target.querySelectorAll("input") || []);
      formData.forEach((el) => {
        if (el.dataset.inputtype !== "string") {
          const value = Function('"use strict"; return ' + el.value + "")();
          values.push(value);
        } else {
          values.push(el.value);
        }
      });
      try {
        target.querySelector(".result").classList.add("loading");
        const method = this.abiCode.find((el) => el.name === name);
        let result;
        if (method.stateMutability === "view") {
          result = await this.contract.methods[name](...values).call({
            from: this.web3.accounts[0],
          });
        } else if (method.stateMutability === "payable") {
          let valuesWithoutPrice = values.slice(1);
          try {
            await this.contract.methods[name](
              ...valuesWithoutPrice
            ).estimateGas({
              from: this.web3.accounts[0],
              value: values[0],
            });
            result = await this.contract.methods[name](
              ...valuesWithoutPrice
            ).send({
              from: this.web3.accounts[0],
              value: values[0],
            });
            // Override to null
            result = null;
          } catch (e) {
            const errorFormatted = this.extractMetamaskError(e.message);
            this.toast.error(errorFormatted.message.toString());
            console.error(e.message);
          }
        } else {
          try {
            await this.contract.methods[name](...values).estimateGas({
              from: this.web3.accounts[0],
            });
            result = await this.contract.methods[name](...values).send({
              from: this.web3.accounts[0],
            });
            // Override to null
            result = null;
          } catch (e) {
            const errorFormatted = this.extractMetamaskError(e.message);
            this.toast.error(errorFormatted.message.toString());
            console.error(e.message);
          }
        }
        target.querySelector(".result .text").innerText = result;
      } catch (e) {
        if (e.code === -32603) {
          this.toast.warning("Please retry");
        } else if (e.message.indexOf("expected array value") !== -1) {
          this.toast.error("Expected an array");
        } else {
          this.toast.error(e.message);
          console.error(e.code, e.message);
        }
      }
      target.querySelector(".result").classList.remove("loading");
    },
    extractMetamaskError(error) {
      try {
        const regexp = /{(.|\s)*}/gm;
        const matches = error.match(regexp);
        const result = JSON.parse(matches[0]);
        return result;
      } catch (e) {
        return { message: error };
      }
    },
    copy(id) {
      const targetEl = document.querySelector(`#text-${id}`);
      navigator.clipboard.writeText(targetEl.innerText);
      this.toast.info("Copied !", {
        position: POSITION.BOTTOM_CENTER,
      });
    },
    copyText(text) {
      navigator.clipboard.writeText(text);
      this.toast.info("Copied !", {
        position: POSITION.BOTTOM_CENTER,
      });
    },
    findMethod(value) {
      const allForms = document.querySelectorAll(".basic-form");
      allForms.forEach((form) => {
        if (form.id.toLowerCase().includes(value.toLowerCase())) {
          form.classList.remove("d-none");
        } else {
          form.classList.add("d-none");
        }
      });
    },
  },
  watch: {
    web3: {
      deep: true,
      handler() {
        this.retreiveContract();
        const localAbiCode =
          localStorage.getItem(this.$route.params.address) || null;
        if (localAbiCode) {
          this.interact(localAbiCode);
        }
      },
    },
  },
  mounted() {
    this.retreiveContract();
    const localAbiCode =
      localStorage.getItem(this.$route.params.address) || null;
    if (localAbiCode) {
      this.interact(localAbiCode);
    }
  },
  components: {
    MetamaskVue,
    ConnectedChainVue,
    ContractAbi,
    LoaderVue,
    SearchBarVue,
    ConverterVue,
  },
};
</script>

<style scoped lang="sass">
.contract-vue
  height: 100%
  display: flex
  flex-direction: column
  overflow: auto
  gap: 1rem

  .topbar
    position: fixed
    width: 100%
    display: flex
    flex-direction: row
    justify-content: center
    z-index: 1000
    pointer-events: none

  .interactions
    display: flex
    flex-direction: column
    gap: 5rem

    .search
      display: flex
      flex-direction: column
      gap: .5rem

      .address-link
        color: var(--blue-0)
        text-decoration: none

        &:hover
          cursor: pointer
          color: var(--blue-50)

    .group
      display: grid
      grid-gap: .25rem
      justify-content: center
      grid-template-columns: repeat(auto-fill, 250px)

      .basic-form
        display: flex
        flex-direction: column
        gap: .25rem
        padding: 1rem
        border-radius: .5rem
        background-color: #333333
        justify-content: flex-end

        .result
          background-color: rgba(#333333, 10%)
          margin-top: .5rem
          border-radius: .5rem
          height: 2rem
          border: 1px solid gray
          display: flex
          flex-direction: column
          justify-content: center
          align-items: flex-start
          position: relative
          overflow: hidden

          > div
            padding: .75rem 0 .75rem .375rem

            .btn-copy
              opacity: 0.3
              position: absolute
              right: 0
              transition: opacity .3s ease-in-out

              &:hover
                opacity: 1

          .text
            overflow-x: auto
            overflow-y: hidden

            &::-webkit-scrollbar
              height: 3px

            &::-webkit-scrollbar-track
              background: transparent

            &::-webkit-scrollbar-thumb
              background: #fff
              border-radius: .5rem

              &:hover
                background: #888888

          .loader
            display: none
            position: absolute
            height: 100%
            aspect-ratio: 1
            left: 4px
            padding: 4px

          &.loading
            .loader
              display: block

  .place-light
    &::placeholder
      color: rgba(white, 50%)
</style>