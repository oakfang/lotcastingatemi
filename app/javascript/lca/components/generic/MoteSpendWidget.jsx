import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Button from 'material-ui/Button'
import ButtonBase from 'material-ui/ButtonBase'
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog'
import Checkbox from 'material-ui/Checkbox'
import { FormControlLabel } from 'material-ui/Form'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'

import RatingField from './ratingField.jsx'
import { spendMotes } from '../../ducks/actions.js'
import { canIEditCharacter, canIEditQc } from '../../selectors'
import { prettyAnimaLevel } from '../../utils/calculated'

const WillRaiseAnima = ({ current, spending }) => {
  if (spending < 5 || current == 3)
    return <Typography>No change to anima</Typography>

  const newLevel = Math.min(current + Math.floor(spending / 5), 3)
  return <Typography>
    Will raise anima from { prettyAnimaLevel(current) } to { prettyAnimaLevel(newLevel) }
  </Typography>
}
WillRaiseAnima.propTypes = { current: PropTypes.number, spending: PropTypes.number }

class MoteSpendWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = { open: false, toSpend: 0, commit: false, commitName: '' }

    this.max = this.max.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  max() {
    const { peripheral, character } = this.props
    return peripheral ? character.motes_personal_total : character.motes_personal_current
  }

  handleOpen() {
    this.setState({ open: true })
  }

  handleClose() {
    this.setState({ open: false })
  }

  handleAdd(motes) {
    this.setState({ toSpend: Math.min(this.state.toSpend + motes, this.max()) })
  }

  handleChange(e) {
    const { name, value } = e.target
    this.setState({ [name]: value })
  }

  handleCheck() {
    this.setState({ commit: !this.state.commit })
  }

  handleSubmit() {
    const { toSpend, commit, commitName } = this.state
    const { character, qc, peripheral } = this.props
    const pool = peripheral ? 'peripheral' : 'personal'

    const characterType = qc ? 'qc' : 'character'
    let committments
    if (commit) {
      committments = this.props.character.motes_committed.concat([{
        pool: pool, label: commitName, motes: toSpend
      }])
    }

    this.props.spendMotes(character.id, toSpend, pool, characterType, committments)

    this.setState({ open: false, toSpend: 0, commit: false, commitName: '' })
  }

  render() {
    const { toSpend, commit, commitName, open } = this.state
    const {
      handleOpen, handleClose, handleAdd, handleChange, handleCheck, handleSubmit
    } = this
    const { canEdit, children, character, peripheral } = this.props

    if (!canEdit) {
      return children
    }

    const max =  peripheral ? character.motes_personal_total : character.motes_personal_current

    return <React.Fragment>
      <ButtonBase onClick={ handleOpen }>
        { children }
      </ButtonBase>
      <Dialog
        open={ open }
        onClose={ handleClose }
      >
        <DialogTitle>
          Spend { peripheral ? 'Peripheral' : 'Personal' } Motes
        </DialogTitle>

        <DialogContent>
          <RatingField trait="toSpend" value={ toSpend }
            label="Motes" narrow margin="dense"
            max={ max }
            onChange={ handleChange }
          />

          <Button variant="raised" size="small" onClick={ () => handleChange({ target: { name: 'toSpend', value: 0 }})}>
            0
          </Button>

          <Button variant="raised" size="small" onClick={ () => handleAdd(1) }>+1</Button>
          <Button variant="raised" size="small" onClick={ () => handleAdd(5) }>+5</Button>
          <Button variant="raised" size="small" onClick={ () => handleAdd(10) }>+10</Button>

          <div>
            <FormControlLabel label="Commit?"
              control={
                <Checkbox checked={ commit } onChange={ handleCheck } />
              }
            />
            { commit &&
              <TextField name="commitName" value={ commitName }
                label="Commit label" margin="dense"
                onChange={ handleChange }
              />
            }
          </div>

          { peripheral &&
            <WillRaiseAnima current={ character.anima_level } spending={ toSpend } />
          }
        </DialogContent>

        <DialogActions>
          <Button onClick={ handleClose }>
            Cancel
          </Button>
          <Button variant="raised" color="primary" onClick={ handleSubmit }>
            Spend
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  }
}
MoteSpendWidget.propTypes = {
  children: PropTypes.node.isRequired,
  character: PropTypes.object.isRequired,
  peripheral: PropTypes.bool,
  qc: PropTypes.bool,
  canEdit: PropTypes.bool,
  spendMotes: PropTypes.func,
}
function mapStateToProps(state, props) {
  return {
    canEdit: props.qc ? canIEditQc(state, props.character.id) : canIEditCharacter(state, props.character.id)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    spendMotes: (id, motes, pool, characterType, committments) => dispatch(spendMotes(id, motes, pool, characterType, committments)),
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(MoteSpendWidget)
