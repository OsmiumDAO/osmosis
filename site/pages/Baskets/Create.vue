<script setup>
    const wallet = useWallet()
    const basket = ref([])

    const fungibleTokens = computed(() => {
        return !wallet.value?.assetsDetails ? 
            [] :
            wallet.value?.assetsDetails.filter((asset) => asset.isFT && !asset.isNFT)
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
                <div class="grid grid-flow-row-dense grid-cols-4">
                    <UCard v-for="[_, asset] in Object.entries(basket)" :key="asset.fingerprint" class="text-center m-auto h-full">
                        <template #header>
                            <div class="text-center m-auto h-full">
                                <div class="grid grid-flow-row-dense grid-cols-2">
                                    <UAvatar v-if="asset.metadata?.image" :src="normalizeImage(asset.metadata?.image)" size="xl" />
                                    <div class="text-left">
                                        <span v-if="asset.metadata?.ticker">[{{ asset.metadata?.ticker }}] </span> {{asset.name}}
                                        <UButton @click="removeFromBasket(asset)">Remove {{asset.qtySelected}}</UButton>
                                    </div>
                                </div>
                            </div>
                        </template>

                        
                            <div class="grid grid-flow-row-dense grid-cols-2">
                            <UButton @click="removeFromBasket(asset)">Remove {{asset.qtySelected}}</UButton>
                            </div>
                    </UCard>
                </div>
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
