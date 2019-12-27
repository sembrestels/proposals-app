export const PROPOSAL_STATUS_OPEN = 1
export const PROPOSAL_STATUS_ACCEPTED = 2

export function getVoteStatus(vote, pctBase) {
  if (vote.data.open) {
    return PROPOSAL_STATUS_OPEN
  } else {
    return PROPOSAL_STATUS_ACCEPTED
  }
}
