import { getJSON } from 'redux-api-middleware'
import { BEGIN, COMMIT, REVERT } from 'redux-optimistic-ui'
import { createReducer } from 'redux-starter-kit'

import { callApi } from 'utils/api.js'
import { characterTraitTypes as entityTypes, crudAction } from './_lib'

type parentTypes = 'character' | 'qc' | 'battlegroup'

/** Creates an entity reducer 'slice' for the specified entity */
export const createTraitReducer = (
  entityType: entityTypes,
  parentType: parentTypes = 'character'
) => {
  const pluralType = entityType + 's'
  const parent = parentType + 's'
  return createReducer(undefined, {
    /* Create actions */
    [crudAction(entityType, 'CREATE').success.toString()]: (state, action) => {
      const { character_id, id } = action.payload
      const assoc = traitAssoc(state, entityType, id)

      state[parent][character_id][assoc].push(id)
      state[pluralType][id] = action.payload
    },

    /* Update actions */
    /* redux-optimistic-ui has us updating the state on _START rather than _SUCCESS */
    [crudAction(entityType, 'UPDATE').start.toString()]: (state, action) => {
      const { id } = action.meta

      for (const key in action.payload) {
        if (action.payload.hasOwnProperty(key)) {
          state[pluralType][id][key] = action.payload[key]
        }
      }
    },

    /* Destroy actions */
    [crudAction(entityType, 'DESTROY').start.toString()]: (state, action) => {
      const { charId, id } = action.meta
      const assoc = traitAssoc(state, entityType, id)

      state[parent][charId][assoc] = state[parent][charId][assoc].filter(
        (w: number) => w !== id
      )
      delete state[pluralType][id]
    },
  })
}

/** Creates a tuple of API actions for array destructuring assignment
 *  shaped like [create, update, destroy]
 */
export const createApiActions = (
  entityType: entityTypes,
  parentType: parentTypes = 'character'
): [CreateAction, UpdateAction, DestroyAction] => [
  createTraitCreateAction(entityType, parentType),
  createTraitUpdateAction(entityType, parentType),
  createTraitDestroyAction(entityType, parentType),
]

interface CreateActionOptions {
  type?: string
  parent?: parentTypes
}
type CreateAction = (charId: number, options?: CreateActionOptions) => void
/** Creates an API-Calling Action to create the specified entity */
const createTraitCreateAction = (
  entityType: entityTypes,
  parentType: parentTypes = 'character'
) => (charId: number, options: CreateActionOptions = {}): CreateAction => {
  const action = crudAction(entityType, 'CREATE')
  const parent = options.parent || parentType
  const createObj = {}
  if (options.type) {
    createObj[entityType].type = options.type
  }

  return callApi({
    body: JSON.stringify(createObj),
    endpoint: `/api/v1/${parent}s/${charId}/${entityType}s`,
    method: 'POST',
    types: [
      action.start(),
      action.success((_0: any, _1: any, res: any) => getJSON(res)),
      action.failure(),
    ],
  })
}

type UpdateAction = (
  id: number,
  charId: number,
  trait: { [x: string]: any },
  parent?: parentTypes
) => void

let nextTransactionId = 0
/** Creates an API-Calling Action to update the specified entity */
const createTraitUpdateAction = (
  entityType: entityTypes,
  parentType: parentTypes = 'character'
) => (
  id: number,
  charId: number,
  trait: object,
  parent: parentTypes = parentType
): UpdateAction => {
  const transactionId = entityType + nextTransactionId++
  const action = crudAction(entityType, 'UPDATE')
  return callApi({
    body: JSON.stringify(trait),
    endpoint: `/api/v1/${parent}s/${charId}/${entityType}s/${id}`,
    method: 'PATCH',
    types: [
      action.start(trait, {
        id,
        optimistic: { id: transactionId, type: BEGIN },
      }),
      action.success((_0: any, _1: any, res: object) => getJSON(res), {
        id,
        optimistic: { id: transactionId, type: COMMIT },
      }),
      action.failure(null, {
        id,
        optimistic: { id: transactionId, type: REVERT },
      }),
    ],
  })
}

type DestroyAction = (id: number, charId: number) => void
/** Creates an API-Calling Action to destroy the specified entity */
const createTraitDestroyAction = (
  entityType: entityTypes,
  parentType: parentTypes = 'character'
) => (
  id: number,
  charId: number,
  parent: parentTypes = parentType
): DestroyAction => {
  const transactionId = entityType + nextTransactionId++
  const action = crudAction(entityType, 'DESTROY')
  return callApi({
    endpoint: `/api/v1/${parent}s/${charId}/${entityType}s/${id}`,
    method: 'DELETE',
    types: [
      action.start(null, {
        charId,
        id,
        optimistic: { id: transactionId, type: BEGIN },
      }),
      action.success(null, {
        charId,
        id,
        optimistic: { id: transactionId, type: COMMIT },
      }),
      action.failure(null, {
        id,
        optimistic: { id: transactionId, type: REVERT },
      }),
    ],
  })
}

const traitAssoc = (state, type: entityTypes, id: number) => {
  if (type !== 'charm') {
    return type + 's'
  }

  const charm = state.charms[id]
  switch (charm.charm_type) {
    case 'MartialArts':
      return 'martial_arts_charms'
    case 'Spirit':
      return 'spirit_charms'
    case 'Evocation':
      return 'evocations'
    default:
      return 'charms'
  }
}
