<template>
  <div>
    <NeoField
      :variant="variant"
      :message="error"
      :label="$t(label)"
    >
      <NeoInput
        v-model="inputValue"
        :icon-right="inputIconRight"
        :placeholder="placeholder"
        data-testid="global-address-input"
        icon-right-clickable
        @icon-right-click="clearIconClick"
      />
    </NeoField>

    <AddressChecker
      v-if="withAddressCheck"
      :class="{ 'mt-4': !!inputValue }"
      :address="inputValue"
      @check="handleAddressCheck"
      @change="handleAddressChange"
    />
  </div>
</template>

<script lang="ts" setup>
import { checkAddress, isAddress } from '@polkadot/util-crypto'
import { NeoField, NeoInput } from '@kodadot1/brick'
import correctFormat from '@/utils/ss58Format'
import AddressChecker from '@/components/shared/AddressChecker.vue'

const emit = defineEmits(['update:modelValue', 'check'])
const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    emptyOnError?: boolean
    strict?: boolean
    iconRight?: string
    placeholder?: string
    disableError?: boolean
    isInvalid?: boolean
    withAddressCheck?: boolean
  }>(),
  {
    label: 'Insert Address',
    strict: true,
    iconRight: '',
    placeholder: '',
    emptyOnError: false,
  },
)

const { chainProperties } = useChain()
const error = ref<string | null>('')
const isAddressCheckValid = ref<boolean>()
const ss58Format = computed(() => chainProperties.value?.ss58Format)

const variant = computed(() => {
  const isNotEmpty = Boolean(inputValue.value)
  const isInvalidWithAddressCheck = props.withAddressCheck && !isAddressCheckValid.value && isNotEmpty

  if (props.isInvalid || error.value || isInvalidWithAddressCheck) {
    return 'danger'
  }

  const isValidAddress = isAddress(inputValue.value)
  const isSuccessWithAddressCheck = props.withAddressCheck && (!props.isInvalid || isAddressCheckValid.value)
  const isSuccesssWithoutAddressCheck = !props.withAddressCheck && isValidAddress

  if (isNotEmpty && (isSuccessWithAddressCheck || isSuccesssWithoutAddressCheck)) {
    return 'success'
  }

  return ''
})

const inputIconRight = computed(() => {
  if (inputValue.value && props.iconRight === 'close') {
    return 'close'
  }
  return ''
})
const inputValue = computed({
  get: () => props.modelValue,
  set: value => handleInput(value),
})

const emitUpdate = (value: string) => {
  emit('update:modelValue', value)
}

const clearIconClick = () => {
  inputValue.value = ''
  emitUpdate('')
}

const handleInput = (value: string) => {
  emitUpdate(value)

  if (props.disableError || props.withAddressCheck) {
    return value
  }

  if (props.strict) {
    const [, err] = checkAddress(value, correctFormat(ss58Format.value))
    error.value = value ? err : ''
  }
  else {
    if (!props.emptyOnError && !value) {
      error.value = ''
    }
    else {
      error.value = isAddress(value) ? '' : 'Invalid address'
    }
  }

  return props.emptyOnError && error.value ? '' : value
}

const handleAddressCheck = (isValid: boolean) => {
  emit('check', isValid)
  isAddressCheckValid.value = isValid
}

const handleAddressChange = (value: string) => {
  handleInput(value)
}
</script>
