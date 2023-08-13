import { useKoios } from './useKoios'
import { toHex, isHex } from "@/lib/utils.js"

export const useAsset = (network, policyId, assetName) =>
  useState(`${network}:${policyId}:${assetName}`, () => {
    const koios = useKoios(network)

    // Internal state
    const _metadata = ref(null)

    // Computed
    const hexAssetName = computed(() => {
      return isHex(assetName) ? assetName : toHex(assetName)
    })

    const metadata = computed(() => {
        return !_metadata.value ? {} : _metadata.value[0]
    })

    const tokenMetadata = computed(() => {
        if(metadata.value.minting_tx_metadata) {
            // 721 metadata (CIP25?)
            if(metadata.value.minting_tx_metadata[721] && 
                metadata.value.minting_tx_metadata[721][metadata.value.policy_id] &&
                metadata.value.minting_tx_metadata[721][metadata.value.policy_id][metadata.value.asset_name_ascii]) {
                    return metadata.value.minting_tx_metadata[721][metadata.value.policy_id][metadata.value.asset_name_ascii];
            } else {
                return {}
            }
        } else if(metadata.value.token_registry_metadata) {
            // Old Metadata standard
            return metadata.value.token_registry_metadata
        } else {
            return {}
        }
    })

    const init = async () => {
      _metadata.value = await koios.getAssetInfo(policyId, hexAssetName.value)
    }

    init()

    return readonly({
      policyId: computed(() => metadata.value.policy_id),
      name: computed(() => metadata.value.asset_name_ascii),
      nameHex: computed(() => metadata.value.asset_name),
      fingerprint: computed(() => metadata.value.fingerprint),
      supply: computed(() => metadata.value.total_supply),
      isFungible: computed(() => metadata.value.total_supply > 1),
      isFT: computed(() => metadata.value.total_supply > 1),
      isNFT: computed(() => metadata.value.total_supply === 1),
      mintDate: computed(() => new Date(metadata.value.creation_time * 1000)),
      metadata: tokenMetadata,
    })
  })
