<template>
  <div
    :class="[
      'card',
      { 'card-hover': hoverable, 'cursor-pointer': clickable },
      cardClass
    ]"
    @click="handleClick"
  >
    <div v-if="$slots.header || title" class="border-b border-gray-700 pb-4 mb-4">
      <slot name="header">
        <div class="flex items-center justify-between">
          <div>
            <h3 v-if="title" class="text-lg font-semibold text-white">{{ title }}</h3>
            <p v-if="subtitle" class="text-sm text-gray-400 mt-1">{{ subtitle }}</p>
          </div>
          <slot name="actions"></slot>
        </div>
      </slot>
    </div>
    
    <div :class="bodyClass">
      <slot></slot>
    </div>
    
    <div v-if="$slots.footer" class="border-t border-gray-700 pt-4 mt-4">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  hoverable?: boolean
  clickable?: boolean
  cardClass?: string
  bodyClass?: string
}

withDefaults(defineProps<Props>(), {
  hoverable: false,
  clickable: false,
  cardClass: 'p-6',
  bodyClass: '',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>
