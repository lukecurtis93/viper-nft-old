import Vue from 'vue'
import Vuex from 'vuex'
import Web3 from 'web3'
import contractAbi from '../contracts/abi';

import Viper1 from '../assets/Viper/1.png';
import Viper2 from '../assets/Viper/2.png';
import Viper3 from '../assets/Viper/3.png';
import Viper4 from '../assets/Viper/4.png';
import Viper5 from '../assets/Viper/5.png';
import Viper6 from '../assets/Viper/6.png';

const vipersMap = [null, Viper1, Viper2, Viper3, Viper4, Viper5, Viper6];

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    vipers: [],
    ethereum: null,
  },
  mutations: {
    storeViper(state, payload) {
      state.vipers.push({...payload, ...{ url: vipersMap[payload.genes]}})
    },
    removeViper(state, payload) {
      const index = state.vipers.indexOf(payload.id)
      state.vipers.splice(1, index)
    },
    storeEthereum(state, payload) {
      state.ethereum = payload
    },
    resetEthereum(state) {
      state.ethereum = null
    }
  },
  actions: {
    async initVipers({commit}) {

      const receipt = await this.state.ethereum.contractInstance.methods.ownedVipers().call({
        from: this.state.ethereum.account[0],
      })

      if(!receipt) return

      for(let r of receipt) {
        const viper = await this.state.ethereum.contractInstance.methods.getViperDetails(r).call({
          from: this.state.ethereum.account[0],
        })

        if(!viper) return

        commit('storeViper', {
          id: viper[0],
          genes: viper[1],
          matron: viper[2],
          sire: viper[3],
        })
      }
    },
    async initEthereum({commit}) {
      if (window.ethereum) {
       try {
          // Request account access if needed
          window.ethereum
              .request({method: 'eth_accounts'})
          // Accounts now exposed
          const web3 = new Web3(Web3.givenProvider)
          const contractAddress = process.env.VUE_APP_CONTRACT_ADDRESS
          const contractInstance = new web3.eth.Contract(contractAbi, contractAddress)
          const account = await web3.eth.getAccounts()
          commit('storeEthereum', { web3, contractInstance, contractAddress, account})

        } catch (error) {
          alert('Please allow access for the app to work')
        }
      } else {
        alert('Could not find Ethereum on this browser')
      }

      return true
    }
  },
  getters: {
    getEthereum: (state) => () => {
      return state.ethereum
    },
    getVipers: (state) => () => {
      return state.vipers
    }
  }
})
