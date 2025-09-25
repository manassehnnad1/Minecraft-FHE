

const World1 = () => {
  return (
    <div className="text-center">
      {/* World image container */}
      <div className="relative mb-8">
        {/* Main world image - using local image */}
        <div 
          className="w-[600px] h-[300px] rounded-lg shadow-2xl border-4 border-amber-600 mx-auto relative overflow-hidden"
        >
          <img 
            src="/src/assets/world 1.jpg" 
            alt="Minecraft World" 
            className="w-full h-full object-cover rounded-lg"
          />
          
          {/* Overlay with pixelated effect */}
          <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
          
          {/* Pixelated border effect */}
          <div className="absolute inset-0 rounded-lg shadow-inner border-2 border-white/20"></div>
        </div>
      </div>

      {/* Enter Lobby Button - non-functional */}
      <button
        className="w-80 h-16 text-white bg-gradient-to-r from-green-600 to-green-700 font-tektur text-2xl font-bold cursor-pointer transition-all shadow-[4px_4px_0px_black] hover:shadow-[2px_2px_0px_black] hover:translate-y-[2px] hover:from-green-700 hover:to-green-800 rounded-lg border-2 border-green-400 relative overflow-hidden"
      >
        <span className="relative z-10">ENTER LOBBY</span>
      </button>
    </div>
  );
};

export default World1;