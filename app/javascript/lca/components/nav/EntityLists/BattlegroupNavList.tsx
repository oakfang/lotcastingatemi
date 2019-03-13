import * as React from 'react'
import { connect } from 'react-redux'

import { State } from 'ducks'
import { getMyPinnedBattlegroups } from 'ducks/entities'
import { Battlegroup } from 'types'
import EntityList from './EntityList'
import EntityListItem from './EntityListItem'

interface StateProps {
  battlegroups: Battlegroup[]
}

interface OuterProps {
  closeDrawer(): void
}

interface Props extends StateProps, OuterProps {}

const mapBattlegroupToListItem = (battlegroup: Battlegroup) => (
  <EntityListItem
    key={battlegroup.id}
    link={`/battlegroups/${battlegroup.id}`}
    name={battlegroup.name}
  />
)

const BattlegroupNavList = ({ battlegroups, closeDrawer }: Props) => {
  return (
    <EntityList
      label="Battlegroups"
      link="/battlegroups"
      children={battlegroups.map(mapBattlegroupToListItem)}
      onClick={closeDrawer}
    />
  )
}

const mapState = (state: State): StateProps => ({
  battlegroups: getMyPinnedBattlegroups(state),
})

export default connect(mapState)(BattlegroupNavList)
