// Get prices for all verified FTs
import { useMinswap } from '../utils/useMinswap'

const minswapSvc = useMinswap()

export default defineEventHandler(async (event) => {
  const verifiedFTs = await minswapSvc.verifiedFTs().catch(() => 0)

  const prices = await Promise.all(
    Object.keys(verifiedFTs).map(async (asset) => {
      const price = await minswapSvc.tokenPrice(asset)
      if (!price) return asset
      return {
        asset,
        toADA: parseFloat(price.toADA),
        toToken: parseFloat(price.toToken)
      }
    })
  )

  return prices
})
