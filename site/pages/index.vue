<script setup>
const wallet = useWallet()
</script>

<template>
  <div>
    <h1>Welcome to the homepage</h1>

    <h2>For FTs</h2>

    <ul>
      <li>
        List baskets of tokens for exchange in the marketplace for ADA (Example
        INDY, LQ, Meld, Lenfi for ADA). The ADA equivalent will be based on the
        live trading prices of the commulative tokens in the bundle tracked from
        Minswap or any other dex. This allows you to trade a collection of
        tokens without slippage and paying a one time fee instead of buying
        individually on a DEX and also help in seamless trading of tokens with
        low liquidity (Unrealized profits solved through this).
      </li>
      <li>Exchange X asset for Y asset.</li>
    </ul>

    <h2>For NFTs</h2>
    <ul>
      <li>Filter of NFTs will be based on traits and or rarity.</li>
      <li>NFT for NFT swaps (By traits and or rarity).</li>
      <li>
        Purchase NFTs with any agreed Currency by the seller i.e NFT to FT swap
        (The sale contract will come with the accepted currency by the seller).
        Imagine selling a clay and accepting payment in OSM or SNEK or any other
        token aside from ADA.
      </li>
    </ul>
    <hr />
  </div>
</template>

<style></style>
