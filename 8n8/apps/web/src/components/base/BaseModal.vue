<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="closeModal"
      >
        <div class="flex min-h-screen items-center justify-center p-4">
          <!-- Backdrop -->
          <div
            class="fixed inset-0 bg-black/70 transition-opacity"
            @click="closeModal"
          ></div>
          
          <!-- Modal -->
          <div
            :class="[
              'relative bg-dark-800 rounded-lg shadow-xl border border-gray-700 w-full max-h-[90vh] overflow-hidden flex flex-col',
              sizeClasses
            ]"
          >
            <!-- Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-700">
              <h3 class="text-xl font-semibold text-white">
                {{ title }}
              </h3>
              <button
                type="button"
                class="text-gray-400 hover:text-white transition-colors p-1"
                @click="closeModal"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            <!-- Body -->
            <div class="flex-1 overflow-y-auto p-6">
              <slot></slot>
            </div>
            
            <!-- Footer -->
            <div v-if="$slots.footer" class="border-t border-gray-700 p-6">
              <slot name="footer"></slot>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

interface Props {
  modelValue: boolean
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnEscape?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closeOnEscape: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-md'
    case 'md':
      return 'max-w-2xl'
    case 'lg':
      return 'max-w-4xl'
    case 'xl':
      return 'max-w-6xl'
    default:
      return 'max-w-2xl'
  }
})

const closeModal = () => {
  emit('update:modelValue', false)
  emit('close')
}

// Handle escape key
watch(() => props.modelValue, (newValue) => {
  if (newValue && props.closeOnEscape) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div > div:last-child,
.modal-leave-active > div > div:last-child {
  transition: transform 0.3s ease;
}

.modal-enter-from > div > div:last-child,
.modal-leave-to > div > div:last-child {
  transform: scale(0.95);
}
</style>
