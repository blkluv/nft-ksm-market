<template>
  <div class="tag-container flex py-1 px-2 justify-between items-center bg-background-color text-text-color border-k-shade">
    <span
      v-if="isInLessThan24Hours && !isMintingLive"
      class="mr-2 capitalize"
    >{{ $t('opensIn') }}</span>
    <span>{{ displayText }}</span>
  </div>
</template>

<script lang="ts" setup>
import { DropStatus } from './useDrops'
import { formatDropStartTime, toDropScheduledDurationString } from './utils'

const { $i18n } = useNuxtApp()
const props = defineProps<{
  dropStartTime?: Date | null
  dropStatus: DropStatus
  withTime?: boolean
}>()

const isMintingLive = computed(
  () =>
    props.dropStatus === DropStatus.MINTING_LIVE
    || props.dropStatus === DropStatus.COMING_SOON,
)
const isInLessThan24Hours = computed(
  () => props.dropStatus === DropStatus.SCHEDULED_SOON,
)

const displayText = computed(() => {
  switch (props.dropStatus) {
    case DropStatus.COMING_SOON:
      return $i18n.t('drops.comingSoon')
    case DropStatus.MINTING_LIVE:
      return $i18n.t('drops.mintingNow')
    case DropStatus.SCHEDULED_SOON:
      return toDropScheduledDurationString(props.dropStartTime as Date, true)
    case DropStatus.SCHEDULED:
      return formatDropStartTime(
        props.dropStartTime as Date,
        $i18n.locale,
        Boolean(props.withTime),
      )
    case DropStatus.UNSCHEDULED:
      return
    default:
      return ''
  }
})
</script>
