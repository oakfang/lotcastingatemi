import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import { AppBar, Toolbar, Typography } from '@material-ui/core'
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'

import { drawerWidth } from 'containers/_drawerProperties'
import BattlegroupHeader from './BattlegroupHeader'
import CharacterHeader from './CharacterHeader'
import ChronicleHeader from './ChronicleHeader'
import LcaDrawerButton from './DrawerButton'
import QcHeader from './QcHeader'

const styles = (theme: Theme) =>
  createStyles({
    bar: {
      marginLeft: drawerWidth,
      position: 'absolute',
      [theme.breakpoints.up('lg')]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
    },
  })

export const GenericHeader = () => (
  <Toolbar>
    <LcaDrawerButton />

    <Typography variant="h6" color="inherit">
      Lot-Casting Atemi
    </Typography>
  </Toolbar>
)

const LcaHeader = ({ classes }: WithStyles<typeof styles>) => (
  <AppBar className={classes.bar} component="header">
    <Switch>
      <Route path="/chronicles/:chronicleId" component={ChronicleHeader} />
      <Route path="/characters/:characterId" component={CharacterHeader} />
      <Route path="/qcs/:qcId" component={QcHeader} />
      <Route
        path="/battlegroups/:battlegroupId"
        component={BattlegroupHeader}
      />
      <Route component={GenericHeader} />
    </Switch>
  </AppBar>
)

export default withStyles(styles)(LcaHeader)
