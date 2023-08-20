import { BlockFrostAPI } from '@blockfrost/blockfrost-js'
import { BlockfrostAdapter } from '@minswap/sdk'

const config = useRuntimeConfig()

export const useMinswap = () => {
  // Always use mainnet for minswap
  const minswapSvc = new BlockfrostAdapter({
    blockFrost: new BlockFrostAPI({
      projectId: config.blockfrost['mainnet'].PROJECT_ID,
      network: 'mainnet'
    })
  })

  // Pools don't change often and are expensive so cache them for a while (1 hour)
  const getPools = cachedFunction(
    async () => {
      const ADAPoolIDs = {}

      for (let i = 1; ; i++) {
        const pools = await minswapSvc.getPools({ page: i })
        if (pools.length === 0) break // last page

        pools
          .filter((p) => p.assetA === 'lovelace')
          .forEach((p) => {
            ADAPoolIDs[p.assetB] = p.id
          })
      }
      return ADAPoolIDs
    },
    {
      maxAge: 60 * 60, // Cache pools for 1 hour
      getKey: () => 'minswapPools'
    }
  )

  // Token prices change often but accuracy isn't hugely important so cache them for a short time (30 seconds)
  const tokenPrice = cachedFunction(
    async (asset) => {
      // Get list of pools
      const ADAPoolIDs = await pools()
      // Find the pool id for the asset we want
      const poolID = ADAPoolIDs[asset]
      if (!poolID) return null

      // Get the pool for the pool id of the asset
      const pool = await minswapSvc.getPoolById({ id: poolID })
      if (!pool) return null
      // Get the price from the pool
      const [toADA, toToken] = await minswapSvc.getPoolPrice({ pool })

      return { toADA, toToken }
    },
    {
      maxAge: 30,
      getKey: (asset) => `${asset}-price`
    }
  )

  const pools = async () => {
    return await getPools().catch(() => 0)
  }

  // Return
  return {
    api: minswapSvc,

    pools,
    tokenPrice
  }
}
