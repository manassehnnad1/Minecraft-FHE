import { expect } from "chai";
import { ethers } from "hardhat";
import { AgeVerifier } from "../typechain-types";

describe("AgeVerifier", function () {
  let contract: AgeVerifier;

  beforeEach(async () => {
    const AgeVerifierFactory = await ethers.getContractFactory("AgeVerifier");
    contract = (await AgeVerifierFactory.deploy()) as AgeVerifier;
    await contract.waitForDeployment();
  });

  it("should deploy correctly", async () => {
    const address = await contract.getAddress();
    expect(address).to.properAddress;
  });

  // ✅ Test the mock function instead
  it("should accept age and emit AgeVerified for users 18+", async () => {
    const [user] = await ethers.getSigners();

    const tx = await contract
      .connect(user)
      .verifyAgeMock(25); // Use the mock function with a plain number

    await expect(tx)
      .to.emit(contract, "AgeVerified")
      .withArgs(user.address, true); // Should be true for age 25
  });

  it("should emit false for users under 18", async () => {
    const [user] = await ethers.getSigners();

    const tx = await contract
      .connect(user)
      .verifyAgeMock(16); // Under 18

    await expect(tx)
      .to.emit(contract, "AgeVerified")
      .withArgs(user.address, false); // Should be false for age 16
  });

  it("should store encrypted age", async () => {
    const [user] = await ethers.getSigners();
    
    await contract.connect(user).verifyAgeMock(25);
    
    // Check that an encrypted age was stored (we can't decrypt it in tests, but we can check it exists)
    const encryptedAge = await contract.getEncryptedAge(user.address);
    expect(encryptedAge).to.not.equal(0); // Should have some value stored
  });
});