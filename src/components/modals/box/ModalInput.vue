<template>
  <div class="flex flex-col">
    <label :for="id" class="block mb-2 text-base text-black dark:text-gray-300">
      {{label}}
    </label>
    <input 
      type="text" 
      :id="id"
      class=" bg-gray-50 border border-gray-300 !text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
     
      :class="{ 'is-invalid': invalid }"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      v-on:keyup="$emit('keyup')"
    >
  </div>
</template>

<script setup>
const props = defineProps({
  label: {type: String, default: ''},
  id: {type: [String, Number]},
  invalid: {type: Boolean},
  modelValue : {type: String}
})
</script>