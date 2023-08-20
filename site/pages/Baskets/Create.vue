<script setup>
    const wallet = useWallet()
    const basket = ref({})
    const {data: verifiedFTs} = await useAPI(`/api/verifiedFTs`);
    
    const fungibleTokens = computed(() => {
        return !wallet.value?.assetsDetails ? 
        [] :
        wallet.value?.assetsDetails
            .filter((asset) => asset.isFT && !asset.isNFT)  // is an FT
            .filter((asset) => verifiedFTs.value[asset.policyId])  // is verified
    })

    const normalizeImage = (url = "") => {
        if(!url.includes("://")) {  // DATA URLs (mostly old registry)
            return `data:image/png;base64,${url}`
        } else {
            return url.replace("ipfs://", "https://ipfs.io/ipfs/")
        }
    }

    const addToBasket = (asset) => {
        basket.value[asset.fingerprint] = asset
    }

    const removeFromBasket = (asset) => {
        delete basket.value[asset.fingerprint]
    }
</script>
    
<template>
    <div>
        <p>A Basket is a group of FTs and an amount for each.  We'll calculate the current price in ADA</p>
        <p>The general flow is:
            <ul>
                <li>list all the FTs in their wallet TODO: Need to reference "verified" list</li>
                <li>let them select the FTs they want to include in the basket and the qty of each</li>
                <li>calculate the current ADA price of the basket TODO: Need to fetch prices from minswap</li>
                <li>let them set a time limit for the basket to be active?</li>
                <li>build a tx to lock the tokens into a contract</li>
            </ul>
        </p>

        <UContainer>
            <UCard class="text-center m-auto h-full">
                <template #header>
                    Your Basket
                </template>
                    <div class="max-w-5xl mx-auto py-16">
            <article class="overflow-hidden">
            <div class="rounded-b-md">
                <div class="p-9">
                <div class="flex flex-col mx-0 mt-8">
                <table class="min-w-full divide-y divide-slate-500">
                <thead>
                    <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-normal text-slate-700 sm:pl-6 md:pl-0">
                    Token
                    </th>
                    <th scope="col" class="hidden py-3.5 px-3 text-right text-sm font-normal text-slate-700 sm:table-cell">
                    Quantity
                    </th>
                    <th scope="col" class="py-3.5 pl-3 pr-4 text-right text-sm font-normal text-slate-700 sm:pr-6 md:pr-0">
                    Amount ({{ wallet.currencySymbol }})
                    </th>
                    <th scope="col" class="py-3.5 pl-3 pr-4 text-right text-sm font-normal text-slate-700 sm:pr-6 md:pr-0">
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="[key, asset] in Object.entries(basket)" :key="key">
                    <td class="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                    <div class="font-medium text-slate-700">{{ asset.metadata?.ticker || asset.name }}</div>
                    </td>
                    <td class="hidden px-3 py-4 text-sm text-right text-slate-500 sm:table-cell">
                        {{ parseFloat(asset.qtySelected).toLocaleString() }}
                    </td>
                    <td class="py-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                        TODO {{ wallet.currencySymbol }}
                    </td>
                    <td class="py-4 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                        <UButton @click="removeFromBasket(asset)">Remove</UButton>
                    </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                    <th scope="row" colspan="3" class="hidden pt-6 pl-6 pr-3 text-sm font-light text-right text-slate-500 sm:table-cell md:pl-0">
                    Discount
                    </th>
                    <th scope="row" class="pt-6 pl-4 pr-3 text-sm font-light text-left text-slate-500 sm:hidden">
                    Discount
                    </th>
                    <td class="pt-6 pl-3 pr-4 text-sm text-right text-slate-500 sm:pr-6 md:pr-0">
                    $0.00
                    </td>
                    </tr>
                    <tr>
                    <th scope="row" colspan="3" class="hidden pt-4 pl-6 pr-3 text-sm font-normal text-right text-slate-700 sm:table-cell md:pl-0">
                    Total
                    </th>
                    <th scope="row" class="pt-4 pl-4 pr-3 text-sm font-normal text-left text-slate-700 sm:hidden">
                    Total
                    </th>
                    <td class="pt-4 pl-3 pr-4 text-sm font-normal text-right text-slate-700 sm:pr-6 md:pr-0">
                    $0.00
                    </td>
                    </tr>
                </tfoot>
                </table>
                </div>
                </div>
            </div>
            </article>
                    <!-- <UCard v-for="[key, asset] in Object.entries(basket)" :key="key" class="text-center m-auto h-full">
                        <template #header>
                            <div class="text-center m-auto h-full">
                                <div class="grid grid-flow-row-dense grid-cols-2">
                                    <UAvatar v-if="asset.metadata?.image" :src="normalizeImage(asset.metadata?.image)" size="xl" />
                                    <div class="text-left">
                                        <span>{{ parseFloat(asset.qtySelected).toLocaleString() }} {{ asset.metadata?.ticker || asset.name }}</span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <UInput color="white" variant="outline" v-model="asset.qtySelected" />
                        <template #footer>
                            <UButton @click="removeFromBasket(asset)">Remove</UButton>
                        </template>
                    </UCard> -->
                </div>
                <template #footer>
                    TODO: Total ADA Value
                    <UButton>Sell Basket</UButton>
                </template>
            </UCard>
        </UContainer>

        <UContainer>
            <UCard class="text-center m-auto h-full">
                <template #header>
                    Build Your Basket
                </template>
                <div class="grid grid-flow-row-dense grid-cols-4">
                    <UCard v-for="asset in fungibleTokens" :key="asset.fingerprint" class="text-center m-auto h-full">
                        <template #header>
                            <div class="text-center m-auto h-full">
                                <div class="grid grid-flow-row-dense grid-cols-2">
                                    <UAvatar v-if="asset.metadata?.image" :src="normalizeImage(asset.metadata?.image)" size="xl" />
                                    <div class="text-left">
                                        <span v-if="asset.metadata?.ticker">[{{ asset.metadata?.ticker }}] </span> {{asset.name}}
                                        <div v-if="asset.metadata?.description" class="text-xs opacity-50">{{asset.metadata?.description}}</div>
                                    </div>
                                </div>
                            </div>
                        </template>

                        
                            <div class="grid grid-flow-row-dense grid-cols-2">
                            <UInput color="white" variant="outline" v-model="asset.qtySelected" :placeholder="`0 of ${parseFloat(asset.quantity).toLocaleString()}`" />
                            <UButton @click="asset.qtySelected = asset.quantity">All</UButton>
                            
                            <UButton @click="addToBasket(asset)">Add</UButton>
                            </div>
                        <template #footer>
                            <!-- TODO: aprox. ADA values -->
                            <div class="text-xs opacity-50">0 / 1.23456₳</div>
                            
                        </template>
                    </UCard>
                </div>
            </UCard>
        </UContainer>
    </div>
</template>

<style></style>
