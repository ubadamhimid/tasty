<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    
    <div class="relative">
      <div
        v-if="icon"
        class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
      >
        <component :is="icon" class="h-5 w-5 text-gray-400" />
      </div>
      
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="handleInput"
        @blur="emit('blur')"
        @focus="emit('focus')"
      />
    </div>
    
    <p v-if="error" class="mt-1 text-sm text-red-400">
      {{ error }}
    </p>
    
    <p v-else-if="hint" class="mt-1 text-sm text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  icon?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  blur: []
  focus: []
}>()

const inputId = computed(() => `input-${Math.random().toString(36).substring(7)}`)

const inputClasses = computed(() => {
  const classes = ['input']
  
  if (props.icon) {
    classes.push('ps-10')
  }
  
  if (props.error) {
    classes.push('input-error')
  }
  
  return classes.join(' ')
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
