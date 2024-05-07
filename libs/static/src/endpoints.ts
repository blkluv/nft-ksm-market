import { Config } from './types'

type WS_URL = `wss://${string}` | `ws://${string}`
type HTTP_URL = `https://${string}` | `http://${string}`

type ENDPOINT_URL = WS_URL | HTTP_URL

const KUSAMA_ENDPOINTS: WS_URL[] = [
  'wss://rpc.ibp.network/kusama',
  'wss://rpc.dotters.network/kusama',
  'wss://1rpc.io/ksm',
  'wss://kusama-rpc.dwellir.com',
]

const POLKADOT_ENDPOINTS: WS_URL[] = [
  'wss://rpc.dotters.network/polkadot',
  'wss://polkadot.public.curie.radiumblock.co/ws',
  'wss://rpc.ibp.network/polkadot',
  'wss://1rpc.io/dot',
  'wss://polkadot-rpc.dwellir.com',
]

// Someone from HydraDX team told me that Polkadot API takes Array of endpoints
export const ALTERNATIVE_ENDPOINT_MAP: Config<ENDPOINT_URL[]> = {
  rmrk: KUSAMA_ENDPOINTS,
  ksm: KUSAMA_ENDPOINTS,
  ahk: [
    'wss://kusama-asset-hub-rpc.polkadot.io',
    'wss://statemine-rpc.dwellir.com',
    'wss://sys.dotters.network/statemine',
    'wss://rpc-asset-hub-kusama.luckyfriday.io',
    'wss://statemine.public.curie.radiumblock.co/ws',
  ],
  dot: POLKADOT_ENDPOINTS,
  ahp: [
    'wss://sys.ibp.network/statemint',
    'wss://statemint-rpc.dwellir.com',
    'wss://statemint-rpc-tn.dwellir.com',
    'wss://sys.dotters.network/statemint',
  ],
  imx: ['https://rpc.immutable.com'],
  base: ['https://mainnet.base.org'],
  // ahr: ['wss://rococo-asset-hub-rpc.polkadot.io'],
  // glmr: ['wss://public-rpc.pinknode.io/moonbeam'],
  // movr: ['wss://wss.api.moonriver.moonbeam.network'],
}

export const ENDPOINT_MAP: Config<ENDPOINT_URL> = {
  rmrk: KUSAMA_ENDPOINTS[0],
  ksm: KUSAMA_ENDPOINTS[0],
  ahk: 'wss://kusama-asset-hub-rpc.polkadot.io',
  dot: POLKADOT_ENDPOINTS[0],
  ahp: 'wss://sys.ibp.network/statemint',
  imx: 'https://rpc.immutable.com',
  base: 'https://mainnet.base.org',
  // ahr: 'wss://rococo-asset-hub-rpc.polkadot.io',
  // glmr: 'wss://public-rpc.pinknode.io/moonbeam',
  // movr: 'wss://wss.api.moonriver.moonbeam.network',
}
