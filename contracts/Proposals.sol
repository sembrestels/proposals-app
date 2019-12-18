pragma solidity ^0.4.24;

import "@aragon/os/contracts/apps/AragonApp.sol";


contract Proposals is AragonApp {

    // Events
    event CreateProposal(address indexed entity, uint256 proposalId, string title, bytes ipfsHash);
    event EditProposal(address indexed entity, uint256 proposalId, string title, bytes ipfsHash);
    event EditProposalDescription(address indexed entity, uint256 proposalId, bytes ipfsHash);
    event ChangeProposalState(address indexed entity, uint256 proposalId, ProposalState state);

    enum ProposalState { Draft, Final, Accepted }

    // Types
    struct Proposal {
        string title;
        bytes ipfsHash;
        ProposalState state;
    }

    // State
    mapping(uint256 => Proposal) public proposals;
    uint256 proposalId = 0;

    // ACL
    bytes32 constant public CREATE_PROPOSAL_ROLE = keccak256("CREATE_PROPOSAL_ROLE");
    bytes32 constant public EDIT_PROPOSAL_ROLE = keccak256("EDIT_PROPOSAL_ROLE");
    bytes32 constant public ACCEPT_PROPOSAL_ROLE = keccak256("ACCEPT_PROPOSAL_ROLE");

    // Errors
    string private constant ERROR_PROPOSAL_ID_OVERFLOW = "PROPOSALS_ID_OVERFLOW";
    string private constant ERROR_NOT_DRAFT_PROPOSAL = "PROPOSALS_NOT_DRAFT_PROPOSAL";
    string private constant ERROR_NOT_FINAL_PROPOSAL = "PROPOSALS_NOT_FINAL_PROPOSAL";
    string private constant ERROR_TITLE_MISMATCH = "PROPOSALS_TITLE_MISMATCH";
    string private constant ERROR_HASH_MISMATCH = "PROPOSALS_HASH_MISMATCH";

    function initialize() public onlyInit {
        initialized();
    }

    /**
     * @notice Create the proposal "`_title`" with the description on `_ipfsHash`
     * @param _title Title of the proposal
     * @param _ipfsHash Initial hash of the description
     */
    function createProposal(string _title, bytes _ipfsHash) external auth(CREATE_PROPOSAL_ROLE) {
        require(proposalId + 1 >= proposalId, ERROR_PROPOSAL_ID_OVERFLOW);
        proposals[proposalId] = Proposal(_title, _ipfsHash, ProposalState.Final);
        emit CreateProposal(msg.sender, proposalId, _title, _ipfsHash);
        proposalId += 1;
    }

    /**
     * @notice Change proposal #`_proposalId` title and description to "`_title`" and `_ipfsHash` respectively
     * @param _proposalId Id of the proposal
     * @param _title New title of the proposal
     * @param _ipfsHash New hash of the proposal description
     */
    function editProposal(uint256 _proposalId, string _title, bytes _ipfsHash) external auth(EDIT_PROPOSAL_ROLE) {
        require(proposals[_proposalId].state == ProposalState.Draft, ERROR_NOT_DRAFT_PROPOSAL);
        proposals[_proposalId].title = _title;
        proposals[_proposalId].ipfsHash = _ipfsHash;
        emit EditProposal(msg.sender, _proposalId, _title, _ipfsHash);
    }

    /**
     * @notice Change proposal #`_proposalId` description to `_ipfsHash`
     * @param _proposalId Id of the proposal
     * @param _ipfsHash New hash of the proposal description
     */
    function editProposalDescription(uint256 _proposalId, bytes _ipfsHash) external auth(EDIT_PROPOSAL_ROLE) {
        require(proposals[_proposalId].state == ProposalState.Draft, ERROR_NOT_DRAFT_PROPOSAL);
        proposals[_proposalId].ipfsHash = _ipfsHash;
        emit EditProposalDescription(msg.sender, _proposalId, _ipfsHash);
    }

    /**
     * @notice Finalize proposal #`_proposalId`
     * @param _proposalId Proposal to be finalized
     */
    function finalizeProposal(uint256 _proposalId) external auth(EDIT_PROPOSAL_ROLE) {
        require(proposals[_proposalId].state == ProposalState.Draft, ERROR_NOT_DRAFT_PROPOSAL);
        proposals[_proposalId].state = ProposalState.Final;
        emit ChangeProposalState(msg.sender, _proposalId, ProposalState.Final);
    }

    /**
     * @notice Accept proposal #`_proposalId`
     * @param _proposalId Proposal to be accepted
     * @param _title Finalized proposal title
     * @param _ipfsHash Finalized proposal description hash
     */
    function acceptProposal(uint256 _proposalId, string _title, bytes _ipfsHash) external auth(ACCEPT_PROPOSAL_ROLE) {
        require(proposals[_proposalId].state == ProposalState.Final, ERROR_NOT_FINAL_PROPOSAL);
        require(keccak256(proposals[_proposalId].title) == keccak256(_title), ERROR_TITLE_MISMATCH);
        require(keccak256(proposals[_proposalId].ipfsHash) == keccak256(_ipfsHash), ERROR_HASH_MISMATCH);
        proposals[_proposalId].state = ProposalState.Accepted;
        emit ChangeProposalState(msg.sender, _proposalId, ProposalState.Accepted);
    }
}
