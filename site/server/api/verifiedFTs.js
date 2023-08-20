const getVerifiedFTs = cachedFunction(
  async () => {
    return JSON.parse(await $fetch('https://github.com/minswap/verified-tokens/raw/main/tokens.json'));
  },
  {
    maxAge:  60 * 60, // Cache for 1 hour
    getKey: () => 'verifiedFTs'
  }
)

export default defineEventHandler(async (event) => {
  return await getVerifiedFTs().catch(() => 0)
})
