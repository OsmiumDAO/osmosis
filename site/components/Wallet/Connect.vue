<script setup>
const wallet = useWallet()

const isWalletChooserOpen = ref(false)
</script>

<template>
  <div class="flex items-center h-10">
    <!-- <div v-if="!connected">
      class="w-[350px] h-screen fixed top-0 transition-all bg-white
      dark:bg-dark-gray dark:text-white text-black duration-500 shadow-md
      z-[150] p-5 py-10 -right-full" >
      <div
        class="font-bold flex items-center gap-2 text-sm border-b dark:border-turqoise-focus py-3"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          class="text-lg text-primary dark:text-turqoise"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M461.2 128H80c-8.84 0-16-7.16-16-16s7.16-16 16-16h384c8.84 0 16-7.16 16-16 0-26.51-21.49-48-48-48H64C28.65 32 0 60.65 0 96v320c0 35.35 28.65 64 64 64h397.2c28.02 0 50.8-21.53 50.8-48V176c0-26.47-22.78-48-50.8-48zM416 336c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"
          ></path></svg
        ><span>Choose a wallet</span>
      </div>
      <div class="flex flex-col gap-2 mt-4">
        <div
          class="flex items-center text-sm px-3 py-1.5 hover:bg-fadedBlue bg-lighter-gray dark:bg-black dark:hover:bg-fadedTurqoise rounded-lg cursor-pointer"
        >
          <div class="flex items-center rounded-full p-2">
            <img
              src="/assets/images/wallets/eternl.png"
              alt="eternl"
              class="w-6"
            />
          </div>
          <span class="capitalize font-bold">Eternl</span>
        </div>
        <div
          class="flex items-center text-sm px-3 py-1.5 hover:bg-fadedBlue bg-lighter-gray dark:bg-black dark:hover:bg-fadedTurqoise rounded-lg cursor-pointer"
        >
          <div class="flex items-center rounded-full p-2">
            <img
              src="/assets/images/wallets/flint.svg"
              alt="flint"
              class="w-6"
            />
          </div>
          <span class="capitalize font-bold">Flint Wallet</span>
        </div>
        <div
          class="flex items-center text-sm px-3 py-1.5 hover:bg-fadedBlue bg-lighter-gray dark:bg-black dark:hover:bg-fadedTurqoise rounded-lg cursor-pointer"
        >
          <div class="flex items-center rounded-full p-2">
            <img src="/assets/images/wallets/nami.svg" alt="nami" class="w-6" />
          </div>
          <span class="capitalize font-bold">Nami</span>
        </div>
        <div
          class="flex items-center text-sm px-3 py-1.5 hover:bg-fadedBlue bg-lighter-gray dark:bg-black dark:hover:bg-fadedTurqoise rounded-lg cursor-pointer"
        >
          <div class="flex items-center rounded-full p-2">
            <img
              src="/assets/images/wallets/gero.ico"
              alt="gerowallet"
              class="w-6"
            />
          </div>
          <span class="capitalize font-bold">Gero Wallet</span>
        </div>
        <div
          class="flex items-center text-sm px-3 py-1.5 hover:bg-fadedBlue bg-lighter-gray dark:bg-black dark:hover:bg-fadedTurqoise rounded-lg cursor-pointer"
        >
          <div class="flex items-center rounded-full p-2">
            <img
              src="/assets/images/wallets/typhon.png"
              alt="typhoncip30"
              class="w-6"
            />
          </div>
          <span class="capitalize font-bold">Typhon Wallet</span>
        </div>
        <div
          class="flex items-center text-sm px-3 py-1.5 hover:bg-fadedBlue bg-lighter-gray dark:bg-black dark:hover:bg-fadedTurqoise rounded-lg cursor-pointer"
        >
          <div class="flex items-center rounded-full p-2">
            <img
              src="/assets/images/wallets/vespr.jpg"
              alt="vespr"
              class="w-6"
            />
          </div>
          <span class="capitalize font-bold">Vespr</span>
        </div>
        <div
          class="flex items-center text-sm px-3 py-1.5 hover:bg-fadedBlue bg-lighter-gray dark:bg-black dark:hover:bg-fadedTurqoise rounded-lg cursor-pointer"
        >
          <div class="flex items-center rounded-full p-2">
            <img src="/assets/images/wallets/lace.svg" alt="lace" class="w-6" />
          </div>
          <span class="capitalize font-bold">Lace</span>
        </div>
        <div
          class="flex items-center text-sm px-3 py-1.5 hover:bg-fadedBlue bg-lighter-gray dark:bg-black dark:hover:bg-fadedTurqoise rounded-lg cursor-pointer"
        >
          <div class="flex items-center rounded-full p-2">
            <img src="/assets/images/wallets/nufi.png" alt="nufi" class="w-6" />
          </div>
          <span class="capitalize font-bold">Nufi</span>
        </div>
        <div
          class="flex items-center text-sm px-3 py-1.5 hover:bg-fadedBlue bg-lighter-gray dark:bg-black dark:hover:bg-fadedTurqoise rounded-lg cursor-pointer"
        >
          <div class="flex items-center rounded-full p-2">
            <img
              src="/assets/images/wallets/begin.png"
              alt="begin"
              class="w-6"
            />
          </div>
          <span class="capitalize font-bold">Begin Wallet</span>
        </div>
      </div>
      <div
        class="w-full my-4 text-center font-bold text-sm border-y border-light-gray py-4"
      >
        (or)
      </div>
      <div
        class="flex items-center text-sm px-3 py-1.5 hover:bg-fadedBlue bg-lighter-gray dark:bg-black dark:hover:bg-fadedTurqoise rounded-lg cursor-pointer"
      >
        <div class="flex items-center rounded-full p-2">
          <img
            src="/assets/images/wallets/walletconnect.svg"
            alt="walletConnect"
            class="w-6"
          />
        </div>
        <span class="capitalize font-bold">Wallet Connect</span>
      </div>
      <div class="absolute top-4 right-4 text-xl cursor-pointer">
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"
          ></path>
        </svg>
      </div>
    </div> -->

    <div v-if="!wallet.connected">
      <UTooltip text="Connect Wallet">
        <UButtonGroup size="lg" @click="isWalletChooserOpen = !isWalletChooserOpen">
          <UButton label="Connect Wallet" color="primary" square />
          <UButton icon="i-mdi-wallet-outline" color="primary" square />
        </UButtonGroup>
      </UTooltip>

      <USlideover v-model="isWalletChooserOpen" prevent-close>
        <UCard
          class="flex flex-col flex-1"
          :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }"
        >
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                <UIcon name="i-mdi-wallet-outline" /> Choose a Wallet
              </h3>
              <UButton
                color="gray"
                variant="ghost"
                icon="i-heroicons-x-mark-20-solid"
                class="-my-1"
                @click="isWalletChooserOpen = false"
              />
            </div>
          </template>

          <div class="h-full">
            <div
              v-for="availableWallet in wallet.availableWallets"
              :key="availableWallet.name"
              class="flex items-center text-sm px-3 py-1.5 hover:bg-fadedBlue bg-lighter-gray dark:bg-black dark:hover:bg-fadedTurqoise rounded-lg cursor-pointer"
            >
              <UButton
                block
                padded
                size="xl"
                class="flex items-center rounded-full p-2"
                @click="wallet.connect(availableWallet.name)"
              >
                <template #leading>
                  <UAvatar :src="availableWallet.icon" size="sm" class="w-6" />
                </template>
                <span class="capitalize font-bold">{{ availableWallet.name }}</span>
              </UButton>
            </div>
          </div>
        </UCard>
      </USlideover>
    </div>
    <div
      v-else
      class="bg-primary dark:bg-turqoise text-white dark:hover:bg-turqoise-focus hover:bg-primary-focus h-full px-4 flex items-center justify-center relative rounded-lg rounded-r-none cursor-pointer"
    >
      <UButtonGroup size="lg" @click="isWalletChooserOpen = !isWalletChooserOpen">
        <UTooltip text="Profile">
          <UButton variant="outline" class="h-full text-white bg-primary dark:bg-turqoise dark:hover:bg-turqoise-focus flex items-center justify-center hover:bg-primary-focus">
            <div class="flex gap-2 items-center justify-center relative">
              <img :src="wallet.connectedWallet.icon" class="w-8" />
              <div class="flex flex-col font-bold">
                <div class="text-s">
                    <span v-if="wallet.handle"><UIcon name="i-mdi-currency-usd" class="text-green-500" />{{ wallet.handle }}</span>
                    <span v-else>${{ wallet.shortAddress }}</span>
                </div>
                <div class="text-[10px]">View Profile</div>
              </div>
            </div>
          </UButton>
        </UTooltip>
        <UTooltip text="Disconnect">
          <UButton icon="i-mdi-link-variant-off" color="primary" variant="outline" @click="wallet.disconnect()"/>
        </UTooltip>
      </UButtonGroup>
    </div>
  </div>
</template>

<style></style>
