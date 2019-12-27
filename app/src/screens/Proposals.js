import React from 'react'
import {
  Bar,
  DropDown,
  Tag,
  GU,
  textStyle,
  useLayout,
  useTheme,
} from '@aragon/ui'

const Proposals = React.memo(function Proposals({
  proposals,
  selectProposal,
  executionTargets,
  filteredProposals,
  proposalStatusFilter,
  handleProposalStatusFilterChange,
}) {
  const theme = useTheme()
  const { layoutName } = useLayout()

  return (
    <React.Fragment>
      {layoutName !== 'small' && (
        <Bar>
          <div
            css={`
              height: ${8 * GU}px;
              display: grid;
              grid-template-columns: auto auto auto 1fr;
              grid-gap: ${1 * GU}px;
              align-items: center;
              padding-left: ${3 * GU}px;
            `}
          >
            <DropDown
              header="Status"
              placeholder="Status"
              selected={proposalStatusFilter}
              onChange={handleProposalStatusFilterChange}
              items={[
                <div>
                  All
                  <span
                    css={`
                      margin-left: ${1.5 * GU}px;
                      display: inline-flex;
                      align-items: center;
                      justify-content: center;
                      color: ${theme.info};
                      ${textStyle('label3')};
                    `}
                  >
                    <Tag
                      limitDigits={4}
                      label={proposals.length}
                      size="small"
                    />
                  </span>
                </div>,
                'Open',
                'Closed',
              ]}
              width="128px"
            />
          </div>
        </Bar>
      )}
      <div>Proposals</div>
    </React.Fragment>
  )
})

export default Proposals
