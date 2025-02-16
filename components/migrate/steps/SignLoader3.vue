<template>
  <div class="mb-5">
    <div class="is-flex is-align-items-center mb-4">
      <div class="mr-5">
        <NeoIcon v-bind="whichIcon()" class="fa-2x" />
      </div>
      <div>
        <p class="has-text-weight-bold">
          {{ $t('migrate.signStep.finalization') }}
        </p>
        <p class="is-size-7 has-text-grey">
          {{ $t('migrate.signStep.authorize') }}
        </p>
      </div>
    </div>
    <div class="is-flex is-size-7">
      <div class="v-border"></div>
      <div class="mb-4">1/1 {{ $t('migrate.signStep.left') }}</div>
    </div>
    <div class="is-flex is-size-7">
      <div class="v-border"></div>
      <div class="mb-4 is-flex">
        <NeoIcon v-bind="whichIcon()" class="mr-4" />
        <div>
          <p>{{ $t('migrate.signStep.finalizingItems', [itemCount]) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Prefix } from '@kodadot1/static'
import { NFTs } from '@/composables/transaction/types'
import { NeoIcon } from '@kodadot1/brick'
import {
  type Steps,
  iconIdle,
  iconLoading,
  iconSuccess,
} from '@/composables/useMigrate'

const route = useRoute()
const { transaction, status } = useTransaction()

const from = route.query.source as Prefix
const fromAccountId = route.query.accountId?.toString()
const fromCollectionId = route.query.collectionId?.toString()

const itemCount = route.query.itemCount?.toString()

type NftIds = {
  nfts?: {
    id: string
  }[]
}

const { steps, updateSteps } = inject('steps') as {
  steps: Ref<Steps>
  updateSteps: (step: Steps) => void
}

const whichIcon = () => {
  if (steps.value === 'step4') {
    return iconSuccess
  }

  if (steps.value === 'step3-burn' || steps.value === 'step3-burn-collection') {
    return iconLoading
  }

  return iconIdle
}

const { data } = useGraphql({
  queryName: 'nftIdListByCollection',
  clientName: from,
  variables: {
    id: fromCollectionId,
    search: [{ currentOwner_eq: fromAccountId }],
  },
})

const burnItems = async (ids: string[]) => {
  await transaction(
    {
      interaction: NFTs.BURN_MULTIPLE,
      nftIds: ids,
      urlPrefix: from,
    },
    from,
  )
  updateSteps('step3-burn')
}

// const burnCollection = async () => {
//   if (fromCollectionId) {
//     await transaction({
//       interaction: Collections.DELETE,
//       collectionId: fromCollectionId,
//       urlPrefix: from,
//     })
//     updateSteps('step3-burn-collection')
//   }
// }

const congratsPage = () => {
  updateSteps('step4')
  navigateTo({
    path: '/migrate/congrats',
    query: {
      ...route.query,
    },
  })
}

watchEffect(() => {
  const nfts = (data.value as NftIds)?.nfts

  if (steps.value === 'step3' && nfts?.length) {
    const ids = nfts.map((nft) => nft.id)
    burnItems(ids)
  }

  if (
    steps.value === 'step3-burn' &&
    status.value === TransactionStatus.Finalized
  ) {
    // burnCollection()
    congratsPage()
  }

  if (
    steps.value === 'step3-burn-collection' &&
    status.value === TransactionStatus.Finalized
  ) {
    congratsPage()
  }
})
</script>
