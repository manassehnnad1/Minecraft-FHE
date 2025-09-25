
import Signature from "./components/ui/Signature"
import Logo from "./components/ui/Logo"
import ButtonWallet from "./components/ui/ButtonWallet"
import { usePrivy } from "@privy-io/react-auth"
import { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers";
import { initFhevm, createInstance  } from "@fhevm/sdk";
import AgeVerifierABI from "../FHEVM/artifacts/contracts/FHEageverifier.sol/AgeVerifier.json";






const App = () => {
  const navigate = useNavigate();
  const { authenticated, ready } = usePrivy();
  const [formData, setFormData] = useState({
    playerName: '',
    age: '',
  });
  const [showLogoutAnimation, setShowLogoutAnimation] = useState(false);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  // Track authentication changes to trigger logout animation
  useEffect(() => {
    if (ready) {
      if (wasAuthenticated && !authenticated) {
        // User just logged out
        setShowLogoutAnimation(true);
        setTimeout(() => setShowLogoutAnimation(false), 2000); // Show for 2 seconds
      }
      setWasAuthenticated(authenticated);
    }
  }, [authenticated, ready, wasAuthenticated]);
  
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setErrorMessage(null);

  if (!window.privy) {
    setErrorMessage("Wallet provider not available");
    return;
  }

  try {
    // Contract address - replace with your deployed contract
    const contractAddress = "0xYourDeployedContractAddress";
    
    // 1️⃣ Connect wallet
    const provider = new ethers.BrowserProvider(window.privy);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const userAddress = await signer.getAddress();

    // 2️⃣ Initialize FHE SDK
    await initFhevm();
    const instance = await createInstance({
      verifyingContractAddress: process.env.REACT_APP_INPUT_VERIFICATION_ADDRESS!,
      kmsContractAddress: process.env.REACT_APP_KMS_VERIFIER_CONTRACT!,
      aclContractAddress: process.env.REACT_APP_ACL_CONTRACT_ADDRESS!,
      gatewayChainId: Number(network.chainId),
    });

    // 3️⃣ Validate age input
    const ageNumber = Number(formData.age);
    if (!ageNumber || ageNumber < 1 || ageNumber > 120) {
      setErrorMessage("Enter a valid age (1-120)");
      return;
    }

    // 4️⃣ Check age requirement BEFORE encryption
    if (ageNumber < 18) {
      setErrorMessage("You must be at least 18 years old to enter the world.");
      return;
    }

    // 5️⃣ Encrypt age
    const input = instance.createEncryptedInput(contractAddress, userAddress);
    input.add32(ageNumber);
    const encryptedInput = await input.encrypt();

    const external = encryptedInput.handles[0];
    const proof = encryptedInput.inputProof;

    // 6️⃣ Create contract instance and send transaction
    const contract = new ethers.Contract(contractAddress, AgeVerifierABI.abi, signer);
    
    console.log("Storing encrypted age on blockchain...");
    const tx = await contract["verifyAge(externalEuint32,bytes)"](external, proof);
    await tx.wait();

    console.log("Age verification completed successfully");
    
    // 7️⃣ Navigate to world1 (we already validated age >= 18)
    navigate("/world1");

  } catch (err: any) {
    console.error("Age verification error:", err);
    
    if (err.message?.includes("user rejected")) {
      setErrorMessage("Transaction was rejected. Please try again.");
    } else if (err.message?.includes("insufficient funds")) {
      setErrorMessage("Insufficient funds for gas fees.");
    } else {
      setErrorMessage("Something went wrong during verification. Please try again.");
    }
  }
  return (
    <>
      {/* Main wrapper div */}
      <div className="">
        <div className="absolute bottom-4 right-4 mr-6">
        <Signature />
      </div>
      <div className="absolute mt-6 ml-6 cursor-pointer">
        <Logo />
      </div>

      

       <div className="absolute items-center justify-center flex flex-col ml-96 mt-72">

          {ready && authenticated ? (
            // Show form when logged in
            <div className="text-center ml-36">
              <h1 className="text-amber-100 font-tektur text-6xl font-bold mb-8">Welcome Player!</h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="playerName"
                    placeholder="Enter Name"
                    value={formData.playerName}
                    onChange={handleInputChange}
                    className="w-80 h-14 px-4 text-xl font-tektur bg-black bg-opacity-50 text-amber-100 border-2 border-amber-100 rounded placeholder-amber-200 placeholder-opacity-70 focus:outline-none  focus:bg-opacity-70"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter Age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="1"
                    max="120"
                    className="w-80 h-14 px-4 text-xl font-tektur bg-black bg-opacity-50 text-amber-100 border-2 border-amber-100 rounded placeholder-amber-200 placeholder-opacity-70 focus:outline-none  focus:bg-opacity-70"
                  />
                </div>
                <button
                  type="submit"
                  className="w-80 h-14 text-white bg-green-700 font-tektur text-xl font-bold cursor-pointer transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-y-[3px] hover:bg-green-800 rounded"
                >
                  Enter World
                </button>
                {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
              </form>
            </div>
          ) : (
            <>
            <h1 className="text-amber-100 font-tektur text-8xl font-bold ">Minecraft World</h1>
            <h1 className="text-amber-100 font-tektur text-8xl font-bold">Gateway</h1>
            <p className="text-amber-100 font-tektur text-2xl">Login to get started</p>
            </>

          )}
      
      </div>
        
        <div className="absolute right-4 mr-40 mt-6">
          <ButtonWallet /> 
        </div>
      </div>
    </>
  )

};
}
export default App;

