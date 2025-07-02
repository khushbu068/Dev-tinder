import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen bg-cover bg-center bg-no-repeat text-white"
         style={{ backgroundImage: `url('/developer background.jpg')` }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60" />

      {/* Decorative floating blobs */}
      <motion.div
        className="absolute top-10 left-10 w-32 h-32 bg-yellow-400 rounded-full filter blur-xl opacity-30"
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-16 right-16 w-24 h-24 bg-violet-500 rounded-full filter blur-xl opacity-30"
        animate={{ y: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
      />

      {/* Top Navbar */}
      <div className="absolute top-0 left-0 w-full flex justify-between items-center p-5 z-20 text-sm text-gray-200">
        <div className="font-semibold tracking-wider text-lg text-yellow-400">Dev-Tinder</div>
        <div>
          <button
            className="hover:underline hover:text-white transition"
            onClick={() => navigate("/about")}
          >
            About
          </button>
        </div>

      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-4 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold font-[Poppins] leading-tight drop-shadow-xl"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
        >
          Dev-Tinder 💻💬  
          <br />
          <span className="text-yellow-400">Connect. Collaborate. Code.</span>
        </motion.h1>

        <motion.p
          className="mt-4 text-lg md:text-xl max-w-xl text-gray-300 drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Discover like-minded developers, start real conversations, and build amazing things together.
        </motion.p>

        <motion.button
          onClick={() => navigate("/login")}
          className="mt-8 px-8 py-3 bg-yellow-400 text-black font-bold rounded shadow-lg hover:bg-yellow-300 transition duration-300 hover:shadow-2xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login to Continue
        </motion.button>
      </div>
    </div>
  );
};

export default Home;