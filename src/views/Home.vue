<template>
  <div v-if="getEthereum()" class="home">
    <v-row no-gutters>
      <v-col>
        <v-btn
            elevation="2"
            :loading="loading"
            @click="buyViper"
        >
          Buy Viper (0.02ETH+GAS)
        </v-btn>
      </v-col>
      <v-col>
        <v-btn
            elevation="2"
            :loading="loading"
            @click="breedVipers"
        >
          Breed Viper (0.05ETH+GAS)
        </v-btn>
        <v-text-field
            v-model="sire"
            hide-details
            single-line
            type="number"
        />
        <v-text-field
            v-model="matron"
            hide-details
            single-line
            type="number"
        />
      </v-col>
      <v-col>
        <v-btn
            elevation="2"
            :loading="loading"
            @click="withdraw"
        >
          Withdraw Contract Fees to Account Owner (0ETH+GAS)
        </v-btn>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col
          v-for="viper in getVipers()"
          :key="viper.id"
          cols="12"
          sm="4"
      >
        <ViperCard :viper="viper" />
      </v-col>
    </v-row>
  </div>
  <div v-else>
      Ethereum hasn't been linked locally please wait or try using Metamask!
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import ViperCard from "../components/ViperCard";

export default {
  name: 'Home',
  components: {ViperCard},
  computed: {
    ...mapGetters([
      'getEthereum',
      'getVipers'
    ]),
  },
  data() {
    return {
      loading: false,
      sire: null,
      matron: null,
    }
  },
  methods: {
    ...mapMutations([
      'storeViper'
    ]),
    async buyViper() {
      this.loading = true

      const receipt = await this.getEthereum().contractInstance.methods.buyViper().send({
        from: this.getEthereum().account[0],
        value: this.getEthereum().web3.utils.toWei('0.02', 'ether'),
      })

      this.handleNewViper(receipt)

    },
    async breedVipers() {
      this.loading = true;
      const receipt = await this.getEthereum().contractInstance.methods.breedVipers(this.matron, this.sire).send({
        from: this.getEthereum().account[0],
        value: this.getEthereum().web3.utils.toWei('0.05', 'ether'),
      })

      this.handleNewViper(receipt)
    },
    async withdraw() {
      this.loading = true;
      const receipt = await this.getEthereum().contractInstance.methods.withdraw().send({
        from: this.getEthereum().account[0],
      })

      if(receipt) {
        console.log(receipt)
        this.loading = false;
      }
    },
    handleNewViper(receipt)
    {
      if(!receipt) {
        this.loading = false
        return
      }

      this.storeViper({
        id: receipt.events.Birth.returnValues.viperId,
        genes: receipt.events.Birth.returnValues.genes,
        matron: receipt.events.Birth.returnValues.matronId,
        sire: receipt.events.Birth.returnValues.sireId,
      });
      this.loading = false;
    }
  }
}
</script>
