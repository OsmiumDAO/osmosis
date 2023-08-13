<script setup>
const NAV_LINkS = [
  {
    label: "Create Basket",
    to: "/baskets/create",
  },
  {
    label: "Explore Baskets",
    to: "/baskets",
  },
  {
    label: "Trade NFTs",
    to: "/nfts/swap",
  },
  {
    label: "Social",
    icon: "i-radix-icons-component-placeholder",
    children: [
      {
        label: "Twitter",
        icon: "i-fa-brands-twitter",
        to: "https://twitter.com/OsmiumDAO_",
      },
      {
        label: "Discord",
        icon: "i-fa-brands-discord",
        to: "https://discord.gg/5qzmc6wfcC",
      },
      {
        label: "Github",
        icon: "i-fa-brands-github",
        to: "https://github.com/OsmiumDAO",
      },
    ],
  },
];

const layoutUI = {
  padding: "py-4 px-4",
  header: {
    base: "",
    background: "bg-white dark:bg-purple-800",
    padding: "px-4",
  },
  footer: {
    base: "",
    background: "bg-white dark:bg-purple-800",
    padding: "",
  },
};
</script>

<template>
  <div class="w-screen min-h-screen">
    <UCard :ui="layoutUI">
      <template #header>
        <div
          class="w-screen shadow-md"
        >
          <div class="flex items-center justify-between w-full m-auto">
            <ULink to="/">
              <div class="flex items-center">
                <img src="/logo.png" class="w-16" />
                <div class="ml-4 relative">
                  <div class="text-xl leading-6 tracking-wide">Osmosis</div>
                  <div class="text-xs uppercase font-bold tracking-wider">
                    Basket DEX
                  </div>
                </div>
              </div>
            </ULink>

            <div class="items-center gap-8 h-full xl:flex m-auto">
              <div class="flex items-center gap-7 h-full">
                <NavLink v-for="link in NAV_LINkS" :key="link.name" :link="link" />
              </div>
            </div>

            <div class="items-center gap-4 h-full xl:flex mr-10">
                <!-- Dark/Light mode toggle -->
                <ColorMode />

                <!-- WalletConnect -->
                <WalletConnect />
            </div>

            <!-- Mobile right drawer -->
            <div class="xl:hidden">
              <UIcon name="i-mdi-arrow-expand-left" />
              <UIcon name="i-mdi-arrow-expand-right" />
            </div>
          </div>
        </div>
      </template>

      <slot />

      <template #footer>
        <div>
            <a
            color="gray"
            variant="ghost"
            aria-label="OsmiumDAO"
            href="https://osmiumdao.io"
            target="_blank"
            >
            OsmiumDAO
            </a>
        </div>
      </template>
    </UCard>
  </div>
</template>

<style scoped>
.header {
  background-color: #171150;
}
</style>
