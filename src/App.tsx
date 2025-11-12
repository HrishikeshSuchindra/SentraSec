import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CyberSidebar } from "./components/layout/cyber-sidebar";
import { Dashboard } from "./components/sections/dashboard";
import { Recon } from "./components/sections/recon";
import { Vulnerabilities } from "./components/sections/vulnerabilities";
import { Exploitation } from "./components/sections/exploitation";
import { AttackGraph } from "./components/sections/attack-graph";
import { DataExfil } from "./components/sections/data-exfil";
import { Reports } from "./components/sections/reports";
import { Settings } from "./components/sections/settings";
import { ParticleBackground } from "./components/ui/particles";

const sectionComponents = {
  dashboard: Dashboard,
  recon: Recon,
  vulnerabilities: Vulnerabilities,
  exploitation: Exploitation,
  "attack-graph": AttackGraph,
  "data-exfil": DataExfil,
  reports: Reports,
  settings: Settings,
};

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const ActiveComponent =
    sectionComponents[activeSection as keyof typeof sectionComponents];

  return (
    <div className="h-screen bg-background overflow-hidden relative">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Main Layout */}
      <div className="flex h-full relative z-10">
        {/* Sidebar */}
        <CyberSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        {/* Main Content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Loading overlay for dramatic effect */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="fixed inset-0 bg-background z-50 flex items-center justify-center"
        style={{ pointerEvents: "none" }}
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full mx-auto"
          />
          <motion.h1
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="holographic text-4xl font-bold"
          >
            SentraSec
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            Initializing Cyber Defense Matrix...
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
