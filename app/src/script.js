import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Aragon, { events } from '@aragon/api'
import {
  PROPOSAL_STATUS_OPEN,
  PROPOSAL_STATUS_ACCEPTED,
} from './proposal-utils'

const app = new Aragon()

app.store(async (state, { event }) => {
  let nextState = { ...state }

  // Initial state
  if (state == null) {
    nextState = {
      proposals: [
        {
          id: '0',
          title: 'Example proposal',
          description: 'It is a hardcoded proposal',
          creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          state: PROPOSAL_STATUS_OPEN,
        },
        {
          id: '1',
          title: 'Another proposal',
          description: 'It is another hardcoded proposal',
          creator: '0xb4124cEB3451635DAcedd11767f004d8a28c6eE7',
          state: PROPOSAL_STATUS_ACCEPTED,
        },
      ],
    }
  }

  switch (event) {
    case events.SYNC_STATUS_SYNCING:
      nextState = { ...nextState, isSyncing: true }
      break
    case events.SYNC_STATUS_SYNCED:
      nextState = { ...nextState, isSyncing: false }
      break
  }

  return nextState
})
