import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const deployedAgeVerifier = await deploy("AgeVerifier", {
    from: deployer,
    log: true,
    contract: "contracts/FHEageverifier.sol:AgeVerifier",
  });

  console.log(` AgeVerifier contract deployed successfully!`);
  console.log(` Contract address: ${deployedAgeVerifier.address}`);
  console.log(` Add this to your .env file:`);
  console.log(`VITE_CONTRACT_ADDRESS=${deployedAgeVerifier.address}`);
  console.log(` View on Sepolia Etherscan:`);
  console.log(`https://sepolia.etherscan.io/address/${deployedAgeVerifier.address}`);
};

export default func;
func.id = "deploy_ageVerifier"; 
func.tags = ["AgeVerifier"];