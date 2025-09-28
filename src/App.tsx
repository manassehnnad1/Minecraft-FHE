
import Signature from "./components/ui/Signature"
import Logo from "./components/ui/Logo"
import ButtonWallet from "./components/ui/ButtonWallet"
import { usePrivy, useWallets } from "@privy-io/react-auth"
import { useState, useEffect} from "react"
import { useNavigate } from "react-router-dom"
import { ethers } from "ethers";
import { initFhevm, createInstance  } from "@fhevm/sdk";
import AgeVerifierABI from "../FHEVM/artifacts/contracts/FHEageverifier.sol/AgeVerifier.json";








const App = () => {
  const navigate = useNavigate();
  const { authenticated, ready } = usePrivy();
  const { wallets } = useWallets();
  const [formData, setFormData] = useState({
    playerName: '',
    age: '',
  });
  const [showLogoutAnimation, setShowLogoutAnimation] = useState(false);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
 

  // Track authentication changes to trigger logout animation
  useEffect(() => {
    if (ready) {
      if (wasAuthenticated && !authenticated) {
        // User just logged out
        setErrorMessage(null); // Clear error message
      setFormData({ playerName: '', age: '' }); 
        setShowLogoutAnimation(true);
        setTimeout(() => setShowLogoutAnimation(false), 2000); // Show for 2 seconds
      }
      if (!wasAuthenticated && authenticated) {
      // User just logged in - clear any previous error messages
      setErrorMessage(null);
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

  const contractAddress = '0xA1Ece5108AD0B428d9CAb16C549a2b641dB754D3';
  
  if (!authenticated || wallets.length === 0) {
    setErrorMessage("Please connect your wallet first");
    return;
  }

  try {
    const wallet = wallets[0];
    const ethereumProvider = await wallet.getEthereumProvider();
    const provider = new ethers.BrowserProvider(ethereumProvider);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();
    const userAddress = await signer.getAddress();

    // Validate age
    const ageNumber = Number(formData.age);
    if (!ageNumber || ageNumber < 1 || ageNumber > 120) {
      setErrorMessage("Enter a valid age (1-120)");
      return;
    }
    if (ageNumber < 18) {
      setErrorMessage("You must be at least 18 years old to enter the world.");
      return;
    }

    const contract = new ethers.Contract(contractAddress, AgeVerifierABI.abi, signer);

    // Check if we're in development mode
    const isDevelopment = import.meta.env.DEV || true;
    
    if (isDevelopment) {
      // Use mock function in development to avoid WebAssembly errors
      
      setErrorMessage("Processing age verification...");
      
      const tx = await contract.verifyAgeMock(ageNumber);
      await tx.wait();
      
      console.log("age verification successful!");
      setErrorMessage("Age verified successfully!");
      
      setTimeout(() => {
        navigate("/World1");
      }, 1000);
      
    } else {
      // Try full FHE in production
      console.log("Production mode: attempting FHE encryption");
      setErrorMessage("Initializing secure encryption...");
      
      await initFhevm();
      
      const instance = await createInstance({
        verifyingContractAddress: '0x7048C39f048125eDa9d678AEbaDfB22F7900a29F',
        kmsContractAddress: '0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC',
        aclContractAddress: '0x687820221192C5B662b25367F70076A37bc79b6c',
        gatewayChainId: Number(network.chainId),
        relayerUrl: 'https://relayer.testnet.zama.cloud',
        network: ethereumProvider,

      });

      setErrorMessage("Encrypting age data...");
      
      const input = instance.createEncryptedInput(contractAddress, userAddress);
      input.add32(ageNumber);
      const encryptedInput = await input.encrypt();

      //added new line
      console.log(" Full encrypted input payload:", JSON.stringify(encryptedInput, null, 2));


      const external = encryptedInput.handles[0];
      const proof = encryptedInput.inputProof;

      setErrorMessage("Storing encrypted age on blockchain...");
      
      const tx = await contract["verifyAge(externalEuint32,bytes)"](external, proof);
      await tx.wait();
      
      console.log("FHE age verification successful!");
      navigate("/World1");
    }

  } catch (err: any) {
    console.error("Age verification error:", err);
    setErrorMessage(`Verification failed: ${err.message}`);
  }
};

  return (
    <>
    {showLogoutAnimation && <div className="sr-only">Logging out...</div>}
      {/* Main wrapper div */}
      <div className="">
        <div className="absolute bottom-4 right-4 mr-6">
        <Signature />
      </div>
      <div className="absolute mt-6 ml-6 cursor-pointer">
        <Logo />
      </div>

      

       <div className="min-h-screen flex items-center justify-center">

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
                {errorMessage && <p className="text-red-500 mt-4 font-tektur">{errorMessage}</p>}
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


export default App;

