import { ChSortable, Sortable } from 'utils'

export interface WithId {
  id: number
}

export interface PlayerAsset extends WithId, ChSortable, Sortable {
  player_id: number
  chronicle_id: number
}
