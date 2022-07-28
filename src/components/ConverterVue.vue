<template>
  <div :class="`ConverterVue ${deployed ? 'deployed' : ''}`">
    <div class="toolbox" @click="toggle">
      <i class="fa-solid fa-arrows-rotate"></i>
    </div>
    <div class="content">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Eth unit converter</h5>
          <div class="units-selection">
            <select class="form-select" v-model="from">
              <option>Wei</option>
              <option>Kwei</option>
              <option>Mwei</option>
              <option>Gwei</option>
              <option>Szabo</option>
              <option>Finney</option>
              <option selected>Ether</option>
              <option>Kether</option>
              <option>Mether</option>
              <option>Gether</option>
              <option>Tether</option>
            </select>
            <i class="fa-solid fa-arrow-right"></i>
            <select class="form-select" v-model="to">
              <option selected>Wei</option>
              <option>Kwei</option>
              <option>Mwei</option>
              <option>Gwei</option>
              <option>Szabo</option>
              <option>Finney</option>
              <option>Ether</option>
              <option>Kether</option>
              <option>Mether</option>
              <option>Gether</option>
              <option>Tether</option>
            </select>
          </div>
          <input
            class="form-control"
            type="number"
            placeholder="Enter the amount"
            v-model="amount"
          />
          <div class="copy-div">
            <input
              class="form-control"
              type="number"
              disabled
              v-model="amountConverted"
            />
            <button
              class="btn btn-dark btn-copy"
              type="button"
              @click="
                () => {
                  copyText(amountConverted);
                }
              "
            >
              <i class="fa-solid fa-copy"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { POSITION, useToast } from "vue-toastification";

const BigNumber = require("bignumber.js");

const conversionTable = {
  Wei: 0,
  Kwei: 3,
  Mwei: 6,
  Gwei: 9,
  Szabo: 12,
  Finney: 15,
  Ether: 18,
  Kether: 21,
  Mether: 24,
  Gether: 27,
  Tether: 30,
};

export default {
  setup() {
    // Get toast interface
    const toast = useToast();
    return { toast };
  },
  data() {
    return {
      deployed: false,
      amount: null,
      amountConverted: null,
      from: "Ether",
      to: "Wei",
    };
  },
  watch: {
    amount(value) {
      this.updateConversionValue(value);
    },
    from() {
      this.updateConversionValue(this.amount);
    },
    to() {
      this.updateConversionValue(this.amount);
    },
  },
  methods: {
    deploy() {
      if (!this.deployed) this.deployed = true;
    },
    hide() {
      if (this.deployed) this.deployed = false;
    },
    toggle() {
      this.deployed = !this.deployed;
    },
    updateConversionValue(value) {
      this.amountConverted = new BigNumber(
        (value * 10 ** conversionTable[this.from]) /
          10 ** conversionTable[this.to]
      ).toFixed();
    },
    copyText(text) {
      navigator.clipboard.writeText(text);
      this.toast.info("Copied !", {
        position: POSITION.BOTTOM_CENTER,
      });
    },
  },
  mounted() {
    const mainContainer = document.querySelector(".ConverterVue");
    document.addEventListener("mouseup", (e) => {
      if (
        !mainContainer.isEqualNode(e.target) &&
        !mainContainer.contains(e.target)
      ) {
        this.hide();
      }
    });
  },
};
</script>

<style scoped lang="sass">
.ConverterVue
  display: flex
  flex-direction: column-reverse
  align-items: center
  transition: transform ease-in-out .5s
  pointer-events: all
  transform: translateY(-220px)

  &.deployed
    transform: translateY(0)

  .toolbox
    width: 50px
    height: 50px
    border-radius: 0 0 .25rem .25rem
    background-color: #4AA53B
    display: flex
    justify-content: center
    align-items: center
    font-size: x-large
    transition: opacity ease-in-out .2s

    &:hover
      opacity: .8

  .content
    top: 0
    height: 220px

    .card
      background-color: #4AA53B
      border: none
      border-radius: 0 0 1rem 1rem
      height: 100%

      .card-body
        gap: .75rem
        display: flex
        flex-direction: column

        .units-selection
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center
          gap: .5rem

  .copy-div
    position: relative

    .btn-copy
      opacity: 0.3
      position: absolute
      right: 0
      top: 0
      transition: opacity .3s ease-in-out

      &:hover
        opacity: 1
</style>