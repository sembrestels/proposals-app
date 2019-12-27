import React, { useCallback, useMemo } from 'react'
import { AragonApi, useApi, useAppState, usePath } from '@aragon/api-react'
import appStateReducer from './app-state-reducer'
import usePanelState from './hooks/usePanelState'
import { noop } from './utils'

const PROPOSAL_ID_PATH_RE = /^\/proposal\/([0-9]+)\/?$/
const NO_PROPOSAL_ID = '-1'

function proposalIdFromPath(path) {
  if (!path) {
    return NO_PROPOSAL_ID
  }
  const matches = path.match(PROPOSAL_ID_PATH_RE)
  return matches ? matches[1] : NO_PROPOSAL_ID
}

// Get the proposal currently selected, or null otherwise.
export function useSelectedProposal(proposals) {
  const [path, requestPath] = usePath()
  const { ready } = useAppState()

  // The memoized proposal currently selected.
  const selectedProposal = useMemo(() => {
    const proposalId = proposalIdFromPath(path)

    // The `ready` check prevents a proposal to be
    // selected until the app state is fully ready.
    if (!ready || proposalId === NO_PROPOSAL_ID) {
      return null
    }

    return (
      proposals.find(proposal => proposal.proposalId === proposalId) || null
    )
  }, [path, ready, proposals])

  const selectProposal = useCallback(
    proposalId => {
      requestPath(
        String(proposalId) === NO_PROPOSAL_ID ? '' : `/proposal/${proposalId}/`
      )
    },
    [requestPath]
  )

  return [selectedProposal, selectProposal]
}

// Create a new proposal
export function useCreateProposalAction(onDone = noop) {
  const api = useApi()
  return useCallback(
    title => {
      if (api) {
        // Don't care about response
        api['newProposal(string)'](title).toPromise()
        onDone()
      }
    },
    [api, onDone]
  )
}

// Handles the main logic of the app.
export function useAppLogic() {
  const { isSyncing, ready, proposals } = useAppState()

  const [selectedProposal, selectProposal] = useSelectedProposal(proposals)
  const newProposalPanel = usePanelState()

  const actions = {
    createProposal: useCreateProposalAction(newProposalPanel.requestClose),
  }

  return {
    actions,
    isSyncing: isSyncing || !ready,
    newProposalPanel,
    selectProposal,
    selectedProposal,
    proposals,
  }
}

export function AppLogicProvider({ children }) {
  return <AragonApi reducer={appStateReducer}>{children}</AragonApi>
}
