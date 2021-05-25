<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    {{ getEthereum() ? getEthereum().contractAddress : 'No Contract Address Found' }}
  </div>
</template>

<script>
// @ is an alias to /src
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'getEthereum',
    ]),
    ...mapMutations([
        'storeViper'
    ])
  },
  methods: {
    buyViper() {
      const receipt = this.getEthereum().contractInstance.methods.buyViper().send({
        from: this.getEthereum().account,
        value: this.getEthereum().web3.toWei(0.02, 'ether'),
      })
      if(!receipt) return
      this.storeViper({
        id: receipt.events.Birth.returnValues.viperId,
        genes: receipt.events.Birth.returnValues.genes,
        matron: receipt.events.Birth.returnValues.matronId,
        sire: receipt.events.Birth.returnValues.sireId,
      });

    },
  }
}
</script>
