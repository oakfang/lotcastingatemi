// @flow
import * as React from 'react'
const { Component, Fragment, } = React
import { connect } from 'react-redux'
import { withRouter, Link, NavLink } from 'react-router-dom'

import { withStyles } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import List, { ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import Switch from 'material-ui/Switch'

import CharacterNavList from './characterNavList.jsx'
import ChronicleNavList from './chronicleNavList.jsx'
import DisplayNamePopup from '../generic/displayNamePopup.jsx'
import Discord from '../../icons/Discord-Logo.jsx'
import OctoCat from '../../icons/OctoCat.jsx'
import { logout, closeDrawer, switchTheme } from '../../ducks/actions.js'

const styles = theme => ({ // eslint-disable-line no-unused-vars
  themeLabel: {
    textTransform: 'capitalize',
  },
})

export type Props = {
  authenticated: boolean,
  history?: Object,
  theme: string,
  logout: Function,
  switchTheme: Function,
  closeDrawer: Function,
  drawerOpen: boolean,
  classes: Object,
}

export class NavPanel extends Component<Props> {
  constructor(props: Props) {
    super(props)
  }

  closeCheck = () => {
    if (this.props.drawerOpen)
      this.props.closeDrawer()
  }

  render() {
    const {
      authenticated, theme, switchTheme, classes, logout
    } = this.props
    const { closeCheck } = this

    return <div>
      <List component="nav">
        { authenticated && <DisplayNamePopup /> }

        <ListItem button component={ NavLink } to="/" onClick={ closeCheck }>
          <ListItemText primary="Home" />
        </ListItem>

        { !authenticated &&
          <ListItem button component="a" href="/auth/google_oauth2">
            <ListItemText primary="Log in with Google"
            />
          </ListItem>
        }
        { !authenticated && window.location.hostname === 'localhost' &&
          <ListItem button component="a" href="/auth/developer">
            <ListItemText primary="Log in (Developer)"
            />
          </ListItem>
        }

        { authenticated && <Fragment>
          <CharacterNavList closeDrawer={ closeCheck } />

          <ChronicleNavList closeDrawer={ closeCheck } />
        </Fragment> }

        <ListItem button component={ NavLink } to="/resources" onClick={ closeCheck }>
          <ListItemText primary="Resources" />
        </ListItem>

        <ListItem button onClick={ () => switchTheme(theme == 'light' ? 'dark' : 'light') }>
          <ListItemText primary={ `Current Theme: ${ theme }` } className={ classes.themeLabel }
          />
          <ListItemSecondaryAction>
            <Switch checked={ theme == 'dark' } onChange={ () => switchTheme(theme == 'light' ? 'dark' : 'light') } />
          </ListItemSecondaryAction>
        </ListItem>

        <Divider />

        { authenticated && <Fragment>
          <ListItem button component={ Link } to="/" onClick={ logout }>
            <ListItemText primary="Log Out" />
          </ListItem>

          <Divider />
        </Fragment> }

        <ListItem button component="a"
          href="https://github.com/makzu/lotcastingatemi"
          target="_blank" rel="noopener noreferrer"
          onClick={ closeCheck }
        >
          <ListItemIcon>
            <OctoCat />
          </ListItemIcon>

          <ListItemText primary="View Source on GitHub" />
        </ListItem>
        <ListItem button component="a"
          href="https://discord.gg/zmpWyMv"
          target="_blank" rel="noopener noreferrer"
          onClick={ closeCheck }
        >
          <ListItemIcon>
            <Discord />
          </ListItemIcon>
          <ListItemText primary="Discuss on Discord" />
        </ListItem>

      </List>
    </div>
  }
}

function mapStateToProps(state) {
  const { authenticated } = state.session
  const { theme, drawerOpen } = state.app

  return {
    authenticated,
    theme,
    drawerOpen,
  }
}

function mapDispatchToProps(dispatch: Function) {
  return {
    logout: () => dispatch(logout()),
    closeDrawer: () => dispatch(closeDrawer()),
    switchTheme: (theme) => dispatch(switchTheme(theme)),
  }
}

export default withStyles(styles)(withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(NavPanel)))
