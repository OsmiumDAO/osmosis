import { useMinswap } from "../utils/useMinswap";

const minswapSvc = useMinswap();

export default defineEventHandler(async (event) => {
  return await minswapSvc.verifiedFTs().catch(() => 0)
})
