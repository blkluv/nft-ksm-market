import { defineStore } from 'pinia'
import { isDateWithinLastDays } from '@/utils/datetime'
import type { ChainVM, Prefix } from '@kodadot1/static'
import { ss58Of } from '@/utils/config/chain.config'

type Wallet = {
  address: string
  vm: ChainVM
  name?: string
  extension?: string
}

type WalletHistory = { [key: string]: Date }

interface State {
  selected: Wallet | undefined
  history: WalletHistory | undefined
}

const RECENT_WALLET_DAYS_PERIOD = 30

export const walletHistory = useLocalStorage<WalletHistory>(
  'wallet-history',
  {},
)

export const useWalletStore = defineStore('wallet', {
  state: (): State => ({
    selected: undefined,
    history: { ...walletHistory.value },
  }),
  getters: {
    getIsSubstrate: (state) => state.selected?.vm === 'SUB',
    getIsEvm: (state) => state.selected?.vm === 'EVM',
    getHasWalletSelected: (state) => Boolean(state.selected),
    getSelectedWalletAddrress: (state) => state.selected?.address,
    getWalletName: (state) => state.selected?.name,
    getRecentWallet: (state) => {
      let recent: undefined | { key: string; date: Date }
      let maxDate = new Date(0)

      Object.entries(state.history || {}).forEach(([key, isoString]) => {
        const date = new Date(isoString)

        if (date > maxDate) {
          maxDate = date
          recent = { key, date }
        }
      })

      return recent &&
        isDateWithinLastDays(recent.date, RECENT_WALLET_DAYS_PERIOD)
        ? recent.key
        : null
    },
  },
  actions: {
    setWallet(wallet: Wallet) {
      this.selected = wallet
      if (wallet.extension) {
        this.setRecentWallet(wallet.extension)
      }
    },
    setRecentWallet(extensionName: string) {
      // saving only last connected wallet
      const history = { [extensionName]: new Date() }
      this.history = history
      walletHistory.value = history
    },
    clear() {
      this.selected = undefined
    },
    setCorrectAddressFormat(urlPrefix: Prefix) {
      const wallet = this.selected

      if (!wallet) {
        return
      }

      if (this.getIsSubstrate) {
        const address = formatAddress(wallet.address, ss58Of(urlPrefix))

        if (address === wallet.address) {
          return
        }

        this.setWallet({ ...wallet, address: address })
      }
    },
  },
  persist: true,
})
