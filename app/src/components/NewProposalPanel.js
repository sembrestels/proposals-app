import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Field,
  GU,
  SidePanel,
  TextInput,
  useSidePanelFocusOnReady,
} from '@aragon/ui'

const NewProposalPanel = React.memo(function NewProposalPanel({
  panelState,
  onCreateProposal,
}) {
  return (
    <SidePanel
      title="New Proposal"
      opened={panelState.visible}
      onClose={panelState.requestClose}
    >
      <NewProposalPanelContent onCreateProposal={onCreateProposal} />
    </SidePanel>
  )
})

function NewProposalPanelContent({ onCreateProposal }) {
  const [title, setTitle] = useState('')

  const inputRef = useSidePanelFocusOnReady()

  const handleSubmit = useCallback(
    event => {
      event.preventDefault()
      onCreateProposal(title.trim())
    },
    [onCreateProposal, title]
  )

  const handleTitleChange = useCallback(event => {
    setTitle(event.target.value)
  }, [])

  return (
    <div>
      <form
        css={`
          margin-top: ${3 * GU}px;
        `}
        onSubmit={handleSubmit}
      >
        <Field label="Title">
          <TextInput
            ref={inputRef}
            value={title}
            onChange={handleTitleChange}
            required
            wide
          />
        </Field>
        <Button disabled={!title} mode="strong" type="submit" wide>
          Create new proposal
        </Button>
      </form>
    </div>
  )
}

NewProposalPanelContent.propTypes = {
  onCreateProposal: PropTypes.func,
}

NewProposalPanelContent.defaultProps = {
  onCreateProposal: () => {},
}

export default NewProposalPanel
