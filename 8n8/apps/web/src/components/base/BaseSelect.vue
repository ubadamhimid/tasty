<template>
  <div class="w-full">
    <label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-300 mb-2">
      {{ label }}
      <span v-if="required" class="text-red-400">*</span>
    </label>
    
    <div class="relative">
      <select
        :id="selectId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="selectClasses"
        @change="handleChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="getOptionValue(option)"
          :value="getOptionValue(option)"
        >
          {{ getOptionLabel(option) }}
        </option>
      </select>
      
      <div class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3">
        <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </div>
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

type Option = string | { value: string | number; label: string }

interface Props {
  modelValue: string | number
  options: Option[]
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  valueKey?: string
  labelKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  valueKey: 'value',
  labelKey: 'label',
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const selectId = computed(() => `select-${Math.random().toString(36).substring(7)}`)

const selectClasses = computed(() => {
  const classes = ['input', 'appearance-none', 'pe-10']
  
  if (props.error) {
    classes.push('input-error')
  }
  
  return classes.join(' ')
})

const getOptionValue = (option: Option): string | number => {
  if (typeof option === 'string') return option
  return option[props.valueKey as keyof typeof option] as string | number
}

const getOptionLabel = (option: Option): string => {
  if (typeof option === 'string') return option
  return option[props.labelKey as keyof typeof option] as string
}

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
