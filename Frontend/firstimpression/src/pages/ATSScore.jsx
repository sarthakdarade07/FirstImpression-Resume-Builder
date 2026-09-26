import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const AtsScore = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border border-gray-100">
        <ShieldCheck strokeWidth={1.5} className="w-10 h-10 text-gray-400" />
      </div>

      <h3 className="text-2xl font-bold text-gray-900 mb-3">ATS Analyzer</h3>

      <p className="text-gray-500 max-w-sm text-lg">
        ATS Analyser Coming soon..
      </p>
    </motion.div>
  );
};

export default AtsScore;
