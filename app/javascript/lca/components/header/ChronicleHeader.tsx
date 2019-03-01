import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { compose } from 'recompose'

import { Hidden, Tab, Tabs, Toolbar, Typography } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

import { amIStOfChronicle, getSpecificChronicle } from 'selectors'
import { IChronicle } from 'types'
import LcaDrawerButton from './DrawerButton'
import { GenericHeader } from './Header'
import { styles } from './HeaderStyles'

interface Props extends RouteComponentProps<any> {
  id: number
  chronicle: IChronicle
  path: string
  isST: boolean
  classes: any
}

const LinkTab = props => <Tab {...props} component={Link as any} />

function ChronicleHeader(props: Props) {
  if (props.chronicle == null || props.chronicle.name == null) {
    return <GenericHeader />
  }

  const { chronicle, path, classes } = props

  const tabBasePath = `/chronicles/${chronicle.id}`

  let tabValue = 0
  if (path.includes('/combat')) {
    tabValue = 1
  } else if (path.includes('/details')) {
    tabValue = 2
  }

  const tabs = (
    <Tabs className={classes.tabs} value={tabValue} centered>
      <LinkTab label="Characters" to={tabBasePath} />
      <LinkTab label="Combat" to={tabBasePath + '/combat'} />
      <LinkTab label="Details" to={tabBasePath + '/details'} />
    </Tabs>
  )

  return (
    <>
      <Toolbar>
        <LcaDrawerButton />

        <Typography variant="h6" color="inherit" className={classes.title}>
          {chronicle.name}
        </Typography>

        <Hidden xsDown>{tabs}</Hidden>
      </Toolbar>

      <Hidden smUp>{tabs}</Hidden>
    </>
  )
}

function mapStateToProps(state, ownProps: RouteComponentProps<any>) {
  const id = ownProps.match.params.chronicleId
  const chronicle = getSpecificChronicle(state, id)
  const isST = amIStOfChronicle(state, id)
  const path = ownProps.location.pathname

  return {
    chronicle,
    id,
    isST,
    path,
  }
}

export default compose<Props, RouteComponentProps<any>>(
  connect(mapStateToProps),
  withStyles(styles)
)(ChronicleHeader)
