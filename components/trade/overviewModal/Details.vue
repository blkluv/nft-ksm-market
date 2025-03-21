<template>
  <div class="flex flex-col gap-2">
    <div
      v-if="isOffer"
      class="flex justify-between items-center"
    >
      <span class="text-k-grey text-xs">
        {{ $t('amount') }}
      </span>

      <p class="flex gap-2 items-center">
        <span>{{ formmatedOffer }}</span>
        <span class="text-k-grey text-xs">({{ offerUsd }})</span>
      </p>
    </div>

    <div class="flex justify-between items-center">
      <span class="text-k-grey text-xs">
        {{ $t('expiration') }}
      </span>

      <TradeExpiration
        :trade="trade"
        :blank="$t('expired')"
      />
    </div>

    <div
      v-if="isOffer && isIncomingTrade && desired"
      class="flex justify-between items-center"
    >
      <span class="text-k-grey text-xs">
        {{ $t('offer.floorDifference') }}
      </span>

      <span>
        {{ diff }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIsTradeOverview } from './utils'
import { blank } from '@/components/collection/activity/events/eventRow/common'
import { type TradeNftItem } from '@/components/trade/types'
import type { NFT } from '@/types'

const props = defineProps<{
  trade: TradeNftItem
  desired?: NFT
}>()

const { decimals, chainSymbol } = useChain()
const { isIncomingTrade } = useIsTradeOverview(computed(() => props.trade))
const { isOffer } = useTradeType(computed(() => props.trade))

const getFormattedDifference = (a: number, b: number) => {
  if (b === 0 && a === 0) {
    return blank
  }

  if (b === 0 && a > 0) {
    return '+100%'
  }

  const diff = ((b - a) / b) * 100

  return diff > 0
    ? `-${diff.toFixed()}%`
    : `+${Math.abs(diff).toFixed()}%`
}

const floorPrice = computed(() => Number(props.desired?.collection.floorPrice[0]?.price) || 0)
const diff = computed(() => getFormattedDifference(Number(props.trade.price || 0), floorPrice.value))

const { formatted: formmatedOffer, usd: offerUsd } = useAmount(
  computed(() => props.trade?.price),
  decimals,
  chainSymbol,
)
</script>
