// import BrowserWallet
import { BrowserWallet } from '@meshsdk/core'
import { useEventBus } from '@vueuse/core'
import { toHex } from "@/lib/utils.js"
import { useKoios } from './useKoios'

const POLICY_ADA_HANDLE = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a'

export const useWallet = (default_provider_key = 'walletprovider', default_handle_key = 'adahandle') =>
  useState('wallet', () => {
    // Internal State
    const updateInterval = ref(null)

    // State
    const walletAPI = ref(null)
    const connectedWallet = ref(null)
    const walletState = reactive({
      assets: null,
      address: null,
      lovelace: 0,
      network: null,
      handle: null,
      assetsDetails: null,
    })

    // Event Bus
    const bus = useEventBus('wallet')

    bus.on((ev, val) => {
      switch (ev) {
        case 'wallet:connected':
          onConnected()
          break
        case 'wallet:disconnected':
          onDisconneted()
          break
        case 'wallet:updated':
          const { key, newVal, oldVal } = val
          if(key === 'assets' && newVal) {
            loadAssetsDetails();
          }
          break
      }
    })

    const updateState = async (key, newVal) => {
      const oldVal = walletState[key]
      if (oldVal !== newVal) {
        walletState[key] = newVal
        bus.emit('wallet:updated', { key, newVal, oldVal })
      }
    }

    // Computed
    const connected = computed(() => !!walletAPI.value)
    const availableWallets = computed(() => BrowserWallet.getInstalledWallets())

    const network = computed(() => {
      // NOTE: Assuming Testnet is PreProd, not going through the hasle of checking the network
      return walletState.network === null ? null : walletState.network === 1 ? 'Mainnet' : 'PreProd'
    })
    const currencySymbol = computed(() => {
      return walletState.network === null ? null : walletState.network === 1 ? '₳' : 't₳'
    })
    const shortAddress = computed(() => {
      return !walletState.address ? '...' : walletState.address.slice(0, 5) + '...' + walletState.address.slice(-6)
    })

    // ADAHandle
    const setDefaultHandle = (handle) => {
      updateState('handle', handle)
      if (handle) {
        localStorage.setItem(default_handle_key, walletState.handle);
      } else {
        localStorage.removeItem(default_handle_key);
      }
    };

    const handles = computed(() => {
      if(!walletState.assets) return [];

      // Pull out the handles from the list of assets
      const handles = walletState.assets
        .filter((asset) => asset.policyId === POLICY_ADA_HANDLE)
        .map((asset) => {
          return asset.assetName.indexOf('@') > 0
            ? asset.assetName.substring(asset.assetName.indexOf('@') + 1)
            : asset.assetName
        })

        // Since the handle have been updated, verify that the default handle is still valid and set it if it is
        const savedHandle = localStorage.getItem(default_handle_key);
        setDefaultHandle(handles.includes(savedHandle) ? savedHandle : null);

        return handles;
    })
    
    // One place to refresh everything
    const refreshState = async () => {
      walletAPI.value.getChangeAddress().then((address) => {
        updateState('address', address)
      })

      walletAPI.value.getAssets().then((assets) => {
        updateState('assets', assets)
      })

      walletAPI.value.getLovelace().then((lovelace) => {
        updateState('lovelace', lovelace)
      })

      walletAPI.value.getNetworkId().then((network) => {
        updateState('network', network)
      })

      // Not sure if I have any use cases for these yet
      // const balance = await wallet.getBalance();
      // const collateralUtxos = await wallet.getCollateral();
      // const rewardAddresses = await wallet.getRewardAddresses();
      // const unusedAddresses = await wallet.getUnusedAddresses();
      // const usedAddresses = await wallet.getUsedAddresses();
      // const utxos = await wallet.getUtxos();
      // const policyIds = await wallet.getPolicyIds();
    }

    const loadAssetsDetails = async () => {
      if(!walletState.assets) return [];
      if(walletState.assetsDetails) return walletState.assetsDetails;

      const koios = useKoios(network.value);

      const assets_list = walletState.assets.map((asset) => [asset.policyId, toHex(asset.assetName)]);
      const assetsInfo = await koios.getAssetInfoBulk(assets_list);

      const asssetsDetails = assetsInfo.map((asset) => {
        let tokenMetadata = {};
        if(asset.minting_tx_metadata) {
          // 721 metadata (CIP25?)
          if(asset.minting_tx_metadata[721] && 
              asset.minting_tx_metadata[721][asset.policy_id] &&
              asset.minting_tx_metadata[721][asset.policy_id][asset.asset_name_ascii]) {
                tokenMetadata = asset.minting_tx_metadata[721][asset.policy_id][asset.asset_name_ascii];
          }
        } else if(asset.token_registry_metadata) {
          // Old Metadata standard
          tokenMetadata = {...asset.token_registry_metadata, image: asset.token_registry_metadata.logo};
        }

        // NOTE: Should never be the case where we can't find it
        const simpleAsset = walletState.assets.find((a) => a.fingerprint === asset.fingerprint)
        const qty = (simpleAsset?.quantity || 0) / Math.pow(10, tokenMetadata?.decimals || 0);

        return {
          policyId: asset.policy_id,
          name: asset.asset_name_ascii,
          nameHex: asset.asset_name,
          quantity: qty,
          fingerprint: asset.fingerprint,
          supply: asset.total_supply,
          isFungible: asset.total_supply > 1,
          isFT: asset.total_supply > 1,
          isNFT: asset.total_supply === 1,
          mintDate: new Date(asset.creation_time * 1000),
          metadata: tokenMetadata,
          
        }
      })

      updateState('assetsDetails', asssetsDetails);
    }

    // Events
    const onConnected = async () => {
      refreshState()
      updateInterval.value = setInterval(refreshState, 1000 * 60 * 5) // 5 minutes? MeshJS seems pretty fast but maybe longer?
    }

    // Reset everything
    const onDisconneted = () => {
      if (updateInterval.value) clearInterval(updateInterval.value)
      updateInterval.value = null

      walletAPI.value = null
      connectedWallet.value = null

      // Reset state
      updateState('assets', null)
      updateState('address', null)
      updateState('lovelace', 0)
      updateState('network', null)
      updateState('handle', null)
      updateState('assetsDetails', null)

      localStorage.removeItem(default_provider_key)
    }

    const connect = async (provider) => {
      disconnect()

      try {
        walletAPI.value = await BrowserWallet.enable(provider)
        connectedWallet.value = availableWallets.value.filter((w) => w.name === provider)[0]

        // Store the provider for next time
        localStorage.setItem(default_provider_key, provider)

        bus.emit('wallet:connected')
      } catch (e) {
        disconnect()
        console.error(e)
        console.log('Connection Failed')
      }
    }

    const disconnect = async () => {
      bus.emit('wallet:disconnected')
    }

    const toggle = async (provider) => {
      connected.value ? disconnect() : connect(provider)
    }

    const init = async () => {
      // Check localStorage for a wallet provider (reconnect)
      const default_provider = localStorage.getItem(default_provider_key)
      if (default_provider) await connect(default_provider)
    }

    init()

    return readonly({
      walletAPI,
      connectedWallet,

      // State
      availableWallets,
      connected,
      assets: computed(() => walletState.assets),
      assetsDetails: computed(() => walletState.assetsDetails),
      address: computed(() => walletState.address),
      shortAddress,
      lovelace: computed(() => walletState.lovelace),
      networkID: computed(() => walletState.network),
      network,
      currencySymbol,
      handles,
      handle: computed(() => walletState.handle),

      // Methods
      connect,
      disconnect,
      toggle,
      setDefaultHandle,
      loadAssetsDetails,
    })
  })
