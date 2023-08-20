import { useMinswap } from "../../utils/useMinswap";

const minswapSvc = useMinswap();

export default defineEventHandler(async (event) => {
  try {
    const {asset} = event.context.params;

    const price = await minswapSvc.tokenPrice(asset);
    if(!price) return null;
    // Cache seems to convert to strings?
    return {
        toADA: parseFloat(price.toADA), 
        toToken: parseFloat(price.toToken), 
    }
  } catch (e) {
    console.error(e)
    return null;
  }
})



