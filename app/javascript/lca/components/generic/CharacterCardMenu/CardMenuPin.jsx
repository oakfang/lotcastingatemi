import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ListItemIcon, ListItemText } from 'material-ui/List'
import { MenuItem } from 'material-ui/Menu'
import Bookmark from 'material-ui-icons/Bookmark'
import BookmarkBorder from 'material-ui-icons/BookmarkBorder'

import { updateCharacter, updateQc, updateBattlegroup } from '../../../ducks/actions.js'
import { canIEdit } from '../../../selectors/'

function PinButton(props) {
  if(!canIEdit)
    return <div />

  let action
  switch(props.characterType) {
  case 'qcs':
    action = props.updateQc
    break
  case 'battlegroups':
    action = props.updateBattlegroup
    break
  case 'characters':
  default:
    action = props.updateCharacter
  }

  return <MenuItem button onClick={ () => action(props.id, 'pinned', !props.isPinned) }>
    <ListItemIcon>
      { props.isPinned ? <Bookmark /> : <BookmarkBorder /> }
    </ListItemIcon>
    <ListItemText inset primary={ props.isPinned ? 'Unpin' : 'Pin to Menu' } />
  </MenuItem>
}
PinButton.propTypes = {
  id: PropTypes.number.isRequired,
  characterType: PropTypes.string.isRequired,
  isPinned: PropTypes.bool,
  canIEdit: PropTypes.bool,
  updateCharacter: PropTypes.func,
  updateQc: PropTypes.func,
  updateBattlegroup: PropTypes.func,
}
function mapStateToProps(state, ownProps) {
  return {
    isPinned: state.entities[ownProps.characterType][ownProps.id].pinned,
    canEdit: canIEdit(state, ownProps.id, ownProps.characterType),
  }
}
function mapDispatchToProps(dispatch) {
  return {
    updateCharacter:   (id, trait, value) => dispatch(updateCharacter(id, trait, value)),
    updateQc:          (id, trait, value) => dispatch(updateQc(id, trait, value)),
    updateBattlegroup: (id, trait, value) => dispatch(updateBattlegroup(id, trait, value)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(PinButton)