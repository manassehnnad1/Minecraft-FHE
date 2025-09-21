
import Signature from "./components/ui/Signature"
import Logo from "./components/ui/Logo"
import ButtonWallet from "./components/ui/ButtonWallet"
import { usePrivy } from "@privy-io/react-auth"
import { useState, useEffect} from "react"
import Loader from "./components/ui/Loader"





const App = () => {
  const { authenticated, ready } = usePrivy();
  const [formData, setFormData] = useState({
    playerName: '',
    age: '',
  });
  const [showLogoutAnimation, setShowLogoutAnimation] = useState(false);
  const [wasAuthenticated, setWasAuthenticated] = useState(false);

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



  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  
  return(
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
}

export default App

