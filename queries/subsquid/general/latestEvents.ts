import { graphql } from '@/queries/clients/graphqlClients'

export default graphql(`query latestEvents(
  $limit: Int!
  $orderBy: [EventOrderByInput!]
  $where: EventWhereInput
) {
  events(limit: $limit, orderBy: $orderBy, where: $where) {
    meta
    nft {
      id
      name
      price
      sn
      currentOwner
      issuer
      meta {
        id
        name
        image
        animationUrl
      }
      collection {
        id
        name
      }
    }
    timestamp
  }
}`)
