import * as React from 'react'
import { connect } from 'react-redux'

import {
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Switch
} from '@material-ui/core'

import { State } from 'ducks'
import { switchTheme } from 'ducks/actions.js'

const NavPanelThemeSwitch = ({ theme }) => {
  return (
    <ListItem
      button
      onClick={() => switchTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <ListItemText
        primary={`Current Theme: ${theme}`}
        style={{ textTransform: 'capitalize' }}
      />
      <ListItemSecondaryAction>
        <Switch
          checked={theme === 'dark'}
          onChange={() => switchTheme(theme === 'light' ? 'dark' : 'light')}
        />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

const mapState = (state: State) => ({
  theme: state.app.theme,
})

export default connect(
  mapState,
  { action: switchTheme }
)(NavPanelThemeSwitch)
