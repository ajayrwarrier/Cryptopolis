const Migrations = artifacts.require("Citizenship");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
