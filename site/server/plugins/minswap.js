import { useMinswap } from "../utils/useMinswap";
const minswapSvc = useMinswap();

export default async (_nitroApp) => {
	try {
        // Prime minswap pools cache
        minswapSvc.pools()
	} catch (e) {
		console.error(e);
	}
};
