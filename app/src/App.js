import React, { useCallback } from 'react'
import {
  Button,
  Header,
  IconPlus,
  Main,
  SyncIndicator,
  useLayout,
} from '@aragon/ui'
import { useGuiStyle } from '@aragon/api-react'
import NewProposalPanel from './components/NewProposalPanel'
import useFilterProposals from './hooks/useFilterProposals'
import useScrollTop from './hooks/useScrollTop'
import NoProposals from './screens/NoProposals'
import ProposalDetail from './screens/ProposalDetail'
import Proposals from './screens/Proposals'
import { AppLogicProvider, useAppLogic } from './app-logic'
import { IdentityProvider } from './identity-manager'
import { SettingsProvider } from './proposal-settings-manager'

const App = React.memo(function App() {
  const {
    actions,
    isSyncing,
    newProposalPanel,
    selectProposal,
    selectedProposal,
    proposals,
  } = useAppLogic()

  const { appearance } = useGuiStyle()
  const { layoutName } = useLayout()
  const compactMode = layoutName === 'small'
  const handleBack = useCallback(() => selectProposal(-1), [selectProposal])

  const {
    filteredProposals,
    proposalStatusFilter,
    handleProposalStatusFilterChange,
  } = useFilterProposals(proposals)

  useScrollTop(selectedProposal)

  return (
    <Main theme={appearance} assetsUrl="./aragon-ui">
      <React.Fragment>
        {proposals.length === 0 && (
          <div
            css={`
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            `}
          >
            <NoProposals
              onNewProposal={newProposalPanel.requestOpen}
              isSyncing={isSyncing}
            />
          </div>
        )}
        {proposals.length > 0 && (
          <React.Fragment>
            <SyncIndicator visible={isSyncing} />
            <Header
              primary="Voting"
              secondary={
                !selectedProposal && (
                  <Button
                    mode="strong"
                    onClick={newProposalPanel.requestOpen}
                    label="New proposal"
                    icon={<IconPlus />}
                    display={compactMode ? 'icon' : 'label'}
                  />
                )
              }
            />
            {selectedProposal ? (
              <ProposalDetail proposal={selectedProposal} onBack={handleBack} />
            ) : (
              <Proposals
                proposals={proposals}
                selectProposal={selectProposal}
                filteredProposals={filteredProposals}
                proposalStatusFilter={proposalStatusFilter}
                handleProposalStatusFilterChange={
                  handleProposalStatusFilterChange
                }
              />
            )}
          </React.Fragment>
        )}
        <NewProposalPanel
          onCreateProposal={actions.createProposal}
          panelState={newProposalPanel}
        />
      </React.Fragment>
    </Main>
  )
})

export default function Voting() {
  return (
    <AppLogicProvider>
      <IdentityProvider>
        <SettingsProvider>
          <App />
        </SettingsProvider>
      </IdentityProvider>
    </AppLogicProvider>
  )
}
