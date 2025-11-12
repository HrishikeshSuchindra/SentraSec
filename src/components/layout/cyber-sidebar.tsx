import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeft,
  Shield,
  Search,
  AlertTriangle,
  Zap,
  GitBranch,
  Database,
  FileText,
  Settings,
  Menu,
  Globe,
} from "lucide-react";
import { Button } from "../ui/button";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: Globe, color: "cyan" },
  { id: "recon", label: "Recon & Discovery", icon: Search, color: "blue" },
  {
    id: "vulnerabilities",
    label: "Vulnerabilities",
    icon: AlertTriangle,
    color: "orange",
  },
  { id: "exploitation", label: "Exploitation Engine", icon: Zap, color: "red" },
  {
    id: "attack-graph",
    label: "Attack Graph",
    icon: GitBranch,
    color: "purple",
  },
  {
    id: "data-exfil",
    label: "Data Exfil & Intelligence",
    icon: Database,
    color: "magenta",
  },
  { id: "reports", label: "Reports", icon: FileText, color: "green" },
  { id: "settings", label: "Settings", icon: Settings, color: "cyan" },
];

export function CyberSidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getGlowClass = (color: string) => {
    const glowMap: Record<string, string> = {
      cyan: "glow-cyan",
      blue: "glow-cyan",
      orange: "shadow-orange-500/50",
      red: "glow-red",
      purple: "glow-purple",
      magenta: "glow-magenta",
      green: "glow-green",
    };
    return glowMap[color] || "glow-cyan";
  };

  const getNeonClass = (color: string) => {
    const neonMap: Record<string, string> = {
      cyan: "neon-cyan",
      blue: "neon-cyan",
      orange: "text-orange-400",
      red: "neon-red",
      purple: "neon-purple",
      magenta: "neon-magenta",
      green: "neon-green",
    };
    return neonMap[color] || "neon-cyan";
  };

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="glass-panel h-screen border-r border-border/50 relative z-20"
    >
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <Shield className="w-8 h-8 neon-cyan" />
                <span className="holographic font-bold text-lg">SentraSec</span>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:bg-accent/20 neon-cyan hover:glow-cyan"
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`
                w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-300
                ${
                  isActive
                    ? `glass-panel ${getGlowClass(item.color)} ${getNeonClass(
                        item.color
                      )}`
                    : "hover:bg-accent/10 text-muted-foreground hover:text-foreground"
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? getNeonClass(item.color) : ""
                }`}
              />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="truncate font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Status Indicator */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="glass-panel p-3 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full pulse" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  System Online
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xs text-muted-foreground flex flex-col items-center space-y-2"
              >
                <span>Created By Hrishikesh Suchindra</span>
                <div className="flex space-x-4">
                  <a
                    href="https://instagram.com/hrishikesh_suchindra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-pink-500 transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://linkedin.com/in/hrishikesh-suchindra-a3050725a"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-500 transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/hrishikeshsuchindra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-gray-400 transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
