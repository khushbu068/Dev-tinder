import React from "react";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Footer = () => {
  return (
    <motion.footer
      className="bg-[#F4F7D9] text-gray-900 py-1 px-6 flex justify-center items-center shadow-inner"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <p className="text-[8px] font-semibold tracking-wide">
        Copyright © {new Date().getFullYear()} - All rights reserved.
      </p>
    </motion.footer>
  );
};

export default Footer;
