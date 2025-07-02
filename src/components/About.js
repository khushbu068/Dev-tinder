import { motion } from "framer-motion";

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white px-6 py-16">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-yellow-400 text-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          About Dev-Tinder
        </motion.h1>

        {/* Mission */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-yellow-300 mb-3">
            👩‍💻 Our Mission
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Dev-Tinder aims to bring developers together—not with résumés or
            portfolios, but through meaningful connections. Whether you're
            searching for a coding buddy, project partner, or just a quick
            geek-out session, this is your launchpad.
          </p>
        </motion.div>

        {/* How it Works */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-semibold text-yellow-300 mb-3">
            🚀 How It Works
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Create your profile & showcase your stack</li>
            <li>Browse or get matched with like-minded devs</li>
            <li>Send connection requests and start chatting</li>
            <li>Build cool things together—collaboratively</li>
          </ul>
        </motion.div>

        {/* Made By */}
        <motion.div
          className="bg-gray-800 rounded-lg p-6 shadow-lg"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-yellow-300 mb-3">
            💡 Built with Passion
          </h2>
          <p className="text-gray-300 leading-relaxed">
            Created by Khushbu Chacholiya, a full-stack developer passionate
            about making tech more human. This platform is part tech, part
            heart—and 100% community driven.
          </p>
        </motion.div>

        {/* Tech Stack (optional blurb) */}
        <motion.p
          className="text-center text-sm text-gray-500"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
           Crafted with React, Redux, Express, MongoDB, and a whole lot of ☕
        </motion.p>
      </div>
    </div>
  );
};

export default About;