type COLOR_MODE = 'system' | 'light' | 'dark'

const IMG_PLACEHOLDER_LIGHT = '/Klight.webp'
const IMG_PLACEHOLDER_DARK = '/Kdark.webp'
export const IMG_PLACEHOLDERS = [IMG_PLACEHOLDER_LIGHT, IMG_PLACEHOLDER_DARK]

export default function () {
  const colorMode = useColorMode()
  const { $i18n } = useNuxtApp()

  const isDarkMode = computed<boolean>(() => colorMode.value === 'dark')
  const isSystemMode = computed<boolean>(
    () => colorMode.preference === 'system',
  )

  const themeOptions = computed<
    { value: COLOR_MODE, icon: string, label: string }[]
  >(() => [
    {
      value: 'system',
      icon: 'i-mdi:desktop-classic',
      label: isSystemMode.value
        ? $i18n.t('profileMenu.systemMode', [
          isDarkMode.value
            ? $i18n.t('profileMenu.dark')
            : $i18n.t('profileMenu.light'),
        ])
        : $i18n.t('profileMenu.system'),
    },
    {
      value: 'light',
      icon: 'i-mdi:weather-sunny',
      label: $i18n.t('profileMenu.lightMode'),
    },
    {
      value: 'dark',
      icon: 'i-mdi:moon-waning-crescent',
      label: $i18n.t('profileMenu.darkMode'),
    },
  ])

  const currentModeIndex = computed(() =>
    themeOptions.value.findIndex(option => option.value === preference.value),
  )

  const currentMode = computed(
    () => themeOptions.value[currentModeIndex.value || 0],
  )

  const switchToNextMode = () => {
    const nextIndex = (currentModeIndex.value + 1) % themeOptions.value.length
    setColorMode(themeOptions.value[nextIndex].value)
  }

  const toggleColorMode = (): void => {
    if (colorMode.value === 'dark') {
      colorMode.preference = 'light'
    }
    else {
      colorMode.preference = 'dark'
    }
  }

  const preference = computed(() => colorMode.preference)

  const placeholder = computed(() => {
    return isDarkMode.value ? IMG_PLACEHOLDER_DARK : IMG_PLACEHOLDER_LIGHT
  })

  const setColorMode = (mode: 'light' | 'dark' | 'system') => {
    colorMode.preference = mode
  }

  return {
    themeOptions,
    currentMode,
    switchToNextMode,
    currentModeIndex,
    isDarkMode,
    isSystemMode,
    setColorMode,
    isLightMode: computed(() => !isDarkMode.value),
    preference,
    toggleColorMode,
    placeholder,
  }
}
