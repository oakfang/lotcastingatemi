import { normalize } from 'normalizr'
import { getJSON } from 'redux-api-middleware'

import * as schemas from './_schemas.js'
import { callApi } from '../../utils/api.js'

const PLA_FETCH =         'lca/player/FETCH'
const PLA_FETCH_SUCCESS = 'lca/player/FETCH_SUCCESS'
const PLA_FETCH_ERROR =   'lca/player/FETCH_ERROR'

export default function reducer(state, action) {
  switch(action.type) {
  case PLA_FETCH_SUCCESS:
    return {
      ...state,
      characters: { ...state.characters, ...action.payload.entities.characters },
      players:    { ...state.players,    ...action.payload.entities.players    },
      merits:     { ...state.merits,     ...action.payload.entities.merits     },
      weapons:    { ...state.weapons,    ...action.payload.entities.weapons    },
      qcs:        { ...state.qcs,        ...action.payload.entities.qcs        },
      qc_merits:  { ...state.qc_merits,  ...action.payload.entities.qcMerits   },
      qc_attacks: { ...state.qc_attacks, ...action.payload.entities.qcAttacks  }
    }
  default:
    return state
  }
}

export function fetchCurrentPlayer() {
  return callApi({
    endpoint: '/api/v1/players',
    method: 'GET',
    types: [
      PLA_FETCH,
      {
        type: PLA_FETCH_SUCCESS,
        payload: (action, state, res) => {
          return getJSON(res).then((json) => normalize(json, schemas.player))
        }
      },
      PLA_FETCH_ERROR
    ]
  })
}