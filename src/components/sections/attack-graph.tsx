import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  GitBranch,
  Target,
  Shield,
  Zap,
  Eye,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Play,
  Brain,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";

const attackNodes = [
  {
    id: 1,
    type: "entry",
    label: "Initial Access",
    description: "Phishing Email",
    x: 100,
    y: 200,
    status: "completed",
    risk: "medium",
    techniques: ["T1566.001"],
  },
  {
    id: 2,
    type: "execution",
    label: "Code Execution",
    description: "Malicious Attachment",
    x: 250,
    y: 150,
    status: "completed",
    risk: "high",
    techniques: ["T1204.002"],
  },
  {
    id: 3,
    type: "persistence",
    label: "Persistence",
    description: "Registry Modification",
    x: 400,
    y: 100,
    status: "active",
    risk: "high",
    techniques: ["T1547.001"],
  },
  {
    id: 4,
    type: "credential",
    label: "Credential Dump",
    description: "LSASS Memory Dump",
    x: 250,
    y: 300,
    status: "completed",
    risk: "critical",
    techniques: ["T1003.001"],
  },
  {
    id: 5,
    type: "lateral",
    label: "Lateral Movement",
    description: "SMB Admin Shares",
    x: 550,
    y: 200,
    status: "active",
    risk: "high",
    techniques: ["T1021.002"],
  },
  {
    id: 6,
    type: "privilege",
    label: "Privilege Escalation",
    description: "Service Account Abuse",
    x: 400,
    y: 350,
    status: "potential",
    risk: "critical",
    techniques: ["T1543.003"],
  },
  {
    id: 7,
    type: "exfil",
    label: "Data Exfiltration",
    description: "DNS Tunneling",
    x: 700,
    y: 150,
    status: "potential",
    risk: "critical",
    techniques: ["T1041"],
  },
  {
    id: 8,
    type: "impact",
    label: "Domain Admin",
    description: "Full Domain Control",
    x: 700,
    y: 300,
    status: "potential",
    risk: "critical",
    techniques: ["T1078.002"],
  },
];

const attackPaths = [
  { from: 1, to: 2, probability: 95, detected: false },
  { from: 2, to: 3, probability: 80, detected: false },
  { from: 2, to: 4, probability: 75, detected: true },
  { from: 4, to: 5, probability: 90, detected: false },
  { from: 3, to: 5, probability: 70, detected: false },
  { from: 5, to: 7, probability: 85, detected: false },
  { from: 4, to: 6, probability: 60, detected: true },
  { from: 6, to: 8, probability: 95, detected: false },
  { from: 5, to: 8, probability: 80, detected: false },
];

const mitreTechniques = [
  {
    id: "T1566.001",
    name: "Spearphishing Attachment",
    tactic: "Initial Access",
  },
  { id: "T1204.002", name: "Malicious File", tactic: "Execution" },
  { id: "T1547.001", name: "Registry Run Keys", tactic: "Persistence" },
  { id: "T1003.001", name: "LSASS Memory", tactic: "Credential Access" },
  {
    id: "T1021.002",
    name: "SMB/Windows Admin Shares",
    tactic: "Lateral Movement",
  },
  { id: "T1543.003", name: "Windows Service", tactic: "Privilege Escalation" },
  { id: "T1041", name: "Exfiltration Over C2 Channel", tactic: "Exfiltration" },
  { id: "T1078.002", name: "Domain Accounts", tactic: "Defense Evasion" },
];

export function AttackGraph() {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"2d" | "3d">("3d");
  const [timelinePosition, setTimelinePosition] = useState([0]);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getNodeColor = (status: string, risk: string) => {
    if (status === "completed")
      return {
        bg: "bg-red-500/80",
        glow: "glow-red",
        border: "border-red-400",
      };
    if (status === "active")
      return {
        bg: "bg-orange-500/80",
        glow: "shadow-orange-500/50",
        border: "border-orange-400",
      };
    if (status === "potential")
      return {
        bg: "bg-purple-500/60",
        glow: "glow-purple",
        border: "border-purple-400",
      };
    return { bg: "bg-gray-500/40", glow: "", border: "border-gray-400" };
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "entry":
        return Target;
      case "execution":
        return Zap;
      case "persistence":
        return Shield;
      case "credential":
        return Eye;
      case "lateral":
        return GitBranch;
      case "privilege":
        return Shield;
      case "exfil":
        return GitBranch;
      case "impact":
        return Target;
      default:
        return Target;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "neon-red";
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-yellow-400";
      case "low":
        return "neon-green";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="holographic text-3xl font-bold">
            Attack Graph Analysis
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize attack paths and pivot opportunities
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "2d" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("2d")}
              className="glass-panel border-border/50"
            >
              2D
            </Button>
            <Button
              variant={viewMode === "3d" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("3d")}
              className="glass-panel border-border/50 glow-cyan"
            >
              3D
            </Button>
          </div>

          <Button className="glass-panel glow-purple hover:glow-purple neon-purple">
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 3D Attack Graph Visualization */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <Card className="glass-panel p-6 h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold neon-cyan">
                Attack Vector Visualization
              </h3>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="hover:glow-cyan">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:glow-cyan">
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:glow-cyan">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:glow-cyan">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div
              className="relative h-full bg-black/20 rounded-lg overflow-hidden"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Attack path connections */}
              <svg className="absolute inset-0 w-full h-full">
                {attackPaths.map((path, index) => {
                  const fromNode = attackNodes.find((n) => n.id === path.from);
                  const toNode = attackNodes.find((n) => n.id === path.to);

                  if (!fromNode || !toNode) return null;

                  return (
                    <motion.g key={`${path.from}-${path.to}`}>
                      <motion.line
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                        x1={fromNode.x}
                        y1={fromNode.y}
                        x2={toNode.x}
                        y2={toNode.y}
                        stroke={
                          path.detected
                            ? "#ef4444"
                            : path.probability > 80
                            ? "#8b5cf6"
                            : "#0ea5e9"
                        }
                        strokeWidth="2"
                        strokeDasharray={path.detected ? "8,4" : "none"}
                        className={path.detected ? "animate-pulse" : ""}
                      />

                      {/* Arrow head */}
                      <motion.polygon
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        points={`${toNode.x - 8},${toNode.y - 4} ${
                          toNode.x - 8
                        },${toNode.y + 4} ${toNode.x - 2},${toNode.y}`}
                        fill={
                          path.detected
                            ? "#ef4444"
                            : path.probability > 80
                            ? "#8b5cf6"
                            : "#0ea5e9"
                        }
                      />

                      {/* Probability label */}
                      <motion.text
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        x={(fromNode.x + toNode.x) / 2}
                        y={(fromNode.y + toNode.y) / 2 - 5}
                        fontSize="10"
                        fill="#94a3b8"
                        textAnchor="middle"
                        className="font-mono"
                      >
                        {path.probability}%
                      </motion.text>
                    </motion.g>
                  );
                })}
              </svg>

              {/* Attack nodes */}
              <AnimatePresence>
                {attackNodes.map((node, index) => {
                  const Icon = getNodeIcon(node.type);
                  const { bg, glow, border } = getNodeColor(
                    node.status,
                    node.risk
                  );
                  const isSelected = selectedNode === node.id;

                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: isSelected ? 1.2 : 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                        isSelected ? glow : ""
                      }`}
                      style={{ left: node.x, top: node.y }}
                      onClick={() =>
                        setSelectedNode(isSelected ? null : node.id)
                      }
                    >
                      <div
                        className={`w-16 h-16 rounded-full glass-panel ${border} border-2 flex items-center justify-center hover:${glow} transition-all duration-300 ${bg}`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      {/* Node status indicator */}
                      {node.status === "active" && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-4 h-4 bg-orange-400 rounded-full"
                          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}

                      {/* Node label */}
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="text-xs font-medium whitespace-nowrap bg-black/80 px-2 py-1 rounded">
                          {node.label}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Timeline scrubber */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass-panel p-3 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Attack Timeline</span>
                    <span className="neon-cyan">
                      Step {timelinePosition[0] + 1} of 8
                    </span>
                  </div>
                  <Slider
                    value={timelinePosition}
                    onValueChange={setTimelinePosition}
                    max={7}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Node Details & MITRE ATT&CK */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Selected Node Details */}
          <Card className="glass-panel p-6">
            <h3 className="font-semibold mb-4 neon-purple">Node Details</h3>

            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div
                  key={selectedNode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {attackNodes
                    .filter((n) => n.id === selectedNode)
                    .map((node) => (
                      <div key={node.id} className="space-y-3">
                        <div>
                          <h4 className="font-medium">{node.label}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {node.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Status:</span>
                            <Badge
                              className={
                                getNodeColor(node.status, node.risk).border
                              }
                            >
                              {node.status.toUpperCase()}
                            </Badge>
                          </div>

                          <div className="flex justify-between">
                            <span className="text-sm">Risk:</span>
                            <span
                              className={`text-sm ${getRiskColor(node.risk)}`}
                            >
                              {node.risk.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-sm font-medium">
                            MITRE Techniques:
                          </span>
                          {node.techniques.map((techId) => {
                            const technique = mitreTechniques.find(
                              (t) => t.id === techId
                            );
                            return technique ? (
                              <div
                                key={techId}
                                className="glass-panel p-2 text-xs"
                              >
                                <div className="font-mono neon-cyan">
                                  {technique.id}
                                </div>
                                <div className="text-muted-foreground">
                                  {technique.name}
                                </div>
                                <Badge
                                  variant="outline"
                                  className="text-xs mt-1"
                                >
                                  {technique.tactic}
                                </Badge>
                              </div>
                            ) : null;
                          })}
                        </div>

                        <Button
                          size="sm"
                          className="w-full glow-red hover:glow-red"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Simulate Attack
                        </Button>
                      </div>
                    ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-8"
                >
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a node to view details</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Attack Statistics */}
          <Card className="glass-panel p-6">
            <h3 className="font-semibold mb-4 neon-green">Path Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Shortest Path:</span>
                <span className="text-sm neon-cyan">4 steps</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">Success Probability:</span>
                <span className="text-sm neon-green">78%</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">Detection Risk:</span>
                <span className="text-sm text-orange-400">Medium</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm">Time to Compromise:</span>
                <span className="text-sm neon-purple">~2.3 hours</span>
              </div>
            </div>

            <Button
              size="sm"
              className="w-full mt-4 glow-purple hover:glow-purple"
            >
              <GitBranch className="w-4 h-4 mr-2" />
              Optimize Path
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
