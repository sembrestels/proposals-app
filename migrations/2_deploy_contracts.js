/* global artifacts */
var Proposals = artifacts.require('Proposals.sol')

module.exports = function(deployer) {
  deployer.deploy(Proposals)
}
