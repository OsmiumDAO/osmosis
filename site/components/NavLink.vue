<script setup>
const props = defineProps({
  activeClass: {
    type: String,
    default: "text-black dark:text-white",
  },
  exactActiveClass: {
    type: String,
    default: "text-black dark:text-white",
  },
  link: {
    type: Object,
    default: () => {},
  },
});
</script>

<template>
  <div
    class="flex items-center"
  >
    <div class="text-sm font-bold h-full">
      <UPopover v-if="link.children">
        <ULink class="flex items-center gap-2 h-full group">
          <UIcon v-if="link.icon" :name="link.icon" />
          <span>{{ link.label }}</span>
        </ULink>
        <template #panel>
          <UVerticalNavigation :links="link.children" />
        </template>
      </UPopover>

      <ULink v-else :to="link.to" class="flex items-center gap-2 h-full group">
        <UIcon v-if="link.icon" :name="link.icon" />
        <span>{{ link.label }}</span>
      </ULink>
    </div>
  </div>
</template>

<style></style>
