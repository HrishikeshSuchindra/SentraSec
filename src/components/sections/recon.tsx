import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Radar,
  Zap,
  Target,
  Wifi,
  Server,
  Globe,
  Shield,
  Eye,
  Play,
  Pause,
  RotateCw,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "sonner@2.0.3";

export function Recon() {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState({
    overall: 0,
    portScan: 0,
    serviceScan: 0,
    osScan: 0,
    vulnScan: 0,
  });
  const [networkNodes, setNetworkNodes] = useState([]);
  const [discoveredAssets, setDiscoveredAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [targetedAsset, setTargetedAsset] = useState(null);
  const [focusedScanProgress, setFocusedScanProgress] = useState(0);
  const [scanType, setScanType] = useState("Full");

  // 🎨 Utilities
  const getRiskColor = (risk) => {
    switch (risk) {
      case "critical":
        return { text: "neon-red", glow: "glow-red" };
      case "high":
        return { text: "text-orange-400", glow: "shadow-orange-500/50" };
      case "medium":
        return { text: "text-yellow-400", glow: "shadow-yellow-500/50" };
      case "low":
        return { text: "neon-green", glow: "glow-green" };
      default:
        return { text: "text-gray-400", glow: "" };
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "compromised":
        return "neon-red";
      case "vulnerable":
        return "text-orange-400";
      case "scanning":
        return "neon-cyan";
      case "secure":
        return "neon-green";
      default:
        return "text-gray-400";
    }
  };
  const getNodeIcon = (type) => {
    switch (type) {
      case "server":
        return Server;
      case "workstation":
        return Globe;
      case "router":
        return Wifi;
      case "database":
        return Server;
      case "firewall":
        return Shield;
      default:
        return Target;
    }
  };

  // 🧠 Simulate scan progress
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        const newProgress = {};
        for (const [k, v] of Object.entries(prev)) {
          newProgress[k] = Math.min(v + Math.random() * 8, 100);
        }
        return newProgress;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isScanning]);

  // 🧩 Simulate discovery
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      if (discoveredAssets.length >= 8) return;
      const ip = `192.168.1.${10 + discoveredAssets.length * 5}`;
      const newAsset = {
        ip,
        hostname: `device-${discoveredAssets.length + 1}.local`,
        os: ["Ubuntu 22.04", "Windows 10", "macOS Ventura", "FreeBSD"][
          Math.floor(Math.random() * 4)
        ],
        services: ["HTTP:80", "HTTPS:443", "SSH:22", "MySQL:3306"].slice(
          0,
          Math.floor(Math.random() * 3) + 1
        ),
        risk: ["low", "medium", "high", "critical"][
          Math.floor(Math.random() * 4)
        ],
        status: ["secure", "vulnerable", "compromised", "scanning"][
          Math.floor(Math.random() * 4)
        ],
        vulnerabilities: [
          {
            cve: "CVE-2024-1221",
            severity: "high",
            desc: "Privilege escalation in web service",
          },
          {
            cve: "CVE-2023-4456",
            severity: "medium",
            desc: "Outdated SSH version",
          },
        ],
      };
      setDiscoveredAssets((prev) => [...prev, newAsset]);
      setNetworkNodes((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          ip,
          x: 100 + Math.random() * 400,
          y: 100 + Math.random() * 200,
          type: ["server", "router", "firewall", "workstation"][
            Math.floor(Math.random() * 4)
          ],
          status: newAsset.status,
          risk: newAsset.risk,
        },
      ]);
      toast.success(`New asset discovered: ${ip}`);
    }, 4000);
    return () => clearInterval(interval);
  }, [isScanning, discoveredAssets]);

  // 🎮 Actions
  const handlePauseResume = () => {
    setIsScanning(!isScanning);
    toast.message(isScanning ? "Scan paused" : "Scan resumed");
  };
  const handleFullScan = () => {
    toast.success("Full Network Scan initiated");
    setDiscoveredAssets([]);
    setNetworkNodes([]);
    setScanProgress({
      overall: 0,
      portScan: 0,
      serviceScan: 0,
      osScan: 0,
      vulnScan: 0,
    });
    setIsScanning(true);
    setScanType("Full");
  };
  const handleQuickScan = () => {
    toast.success("Quick Scan started");
    setDiscoveredAssets([]);
    setNetworkNodes([]);
    setScanProgress({
      overall: 0,
      portScan: 0,
      serviceScan: 0,
      osScan: 0,
      vulnScan: 0,
    });
    setIsScanning(true);
    setScanType("Quick");
  };

  // 👁️ Open asset modal
  const handleViewAsset = (asset) => setSelectedAsset(asset);

  // 🎯 Target scan — node pulsing + progress overlay
  const handleTargetScan = (asset) => {
    setTargetedAsset(asset);
    setFocusedScanProgress(0);
    toast.info(`Focused scan started on ${asset.ip}`);
    const interval = setInterval(() => {
      setFocusedScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success(`Focused scan on ${asset.ip} completed`);
          setTimeout(() => setTargetedAsset(null), 1500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 800);
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="holographic text-3xl font-bold">
            Reconnaissance & Discovery
          </h1>
          <p className="text-muted-foreground mt-1">
            Network Enumeration ({scanType} Scan)
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handlePauseResume}
          className="glass-panel hover:glow-cyan"
        >
          {isScanning ? (
            <Pause className="w-4 h-4 mr-2" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          {isScanning ? "Pause Scan" : "Resume Scan"}
        </Button>
      </div>

      {/* Progress */}
      <Card className="glass-panel p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold neon-cyan">Scan Progress</h3>
          <RotateCw
            className={`w-4 h-4 neon-cyan ${isScanning ? "animate-spin" : ""}`}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(scanProgress).map(([k, v]) => (
            <div key={k}>
              <div className="flex justify-between text-sm">
                <span>{k}</span>
                <span className="neon-cyan">{Math.round(v)}%</span>
              </div>
              <Progress value={v} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* Network Map + Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Network Topology */}
        <Card className="glass-panel p-6 h-96 relative overflow-hidden">
          <h3 className="font-semibold neon-purple mb-3">Network Topology</h3>
          <div className="relative h-80 bg-black/20 rounded-lg overflow-hidden">
            <svg className="absolute inset-0 w-full h-full">
              {networkNodes.map((node, i) =>
                networkNodes.slice(i + 1).map((target, j) => (
                  <motion.line
                    key={`${node.id}-${target.id}`}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{
                      delay: 0.2 + (i + j) * 0.05,
                      duration: 0.8,
                    }}
                    x1={node.x}
                    y1={node.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="rgba(139, 92, 246, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="4,4"
                  />
                ))
              )}
            </svg>

            {/* Nodes */}
            <AnimatePresence>
              {networkNodes.map((node) => {
                const Icon = getNodeIcon(node.type);
                const { glow, text } = getRiskColor(node.risk);
                const isTargeted = targetedAsset?.ip === node.ip;
                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 ${
                      isTargeted ? "glow-red" : glow
                    } cursor-pointer`}
                    style={{ left: node.x, top: node.y }}
                  >
                    <div
                      className={`w-12 h-12 rounded-full glass-panel flex items-center justify-center`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isTargeted ? "neon-red animate-pulse" : text
                        }`}
                      />
                    </div>

                    {/* Pulse animation during targeted scan */}
                    {isTargeted && (
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-red-400"
                        animate={{ scale: [1, 1.6, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </Card>

        {/* Assets List */}
        <Card className="glass-panel p-6 h-96 overflow-auto">
          <h3 className="font-semibold neon-green mb-3">
            Live Service Discovery
          </h3>
          {discoveredAssets.map((asset, i) => (
            <motion.div
              key={asset.ip}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="glass-panel p-3 mb-2 hover:glow-cyan transition"
            >
              <div className="flex justify-between">
                <span className="font-mono neon-cyan">{asset.ip}</span>
                <Badge className={getRiskColor(asset.risk).text}>
                  {asset.risk}
                </Badge>
              </div>
              <div className="text-sm">{asset.hostname}</div>
              <div className="text-xs text-muted-foreground">{asset.os}</div>
            </motion.div>
          ))}
        </Card>
      </div>

      {/* Asset Table */}
      <Card className="glass-panel p-6">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold neon-magenta">Asset Inventory</h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleFullScan}>
              <Radar className="w-4 h-4 mr-2" />
              Full
            </Button>
            <Button variant="outline" onClick={handleQuickScan}>
              <Zap className="w-4 h-4 mr-2" />
              Quick
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>IP</TableHead>
              <TableHead>Hostname</TableHead>
              <TableHead>OS</TableHead>
              <TableHead>Services</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {discoveredAssets.map((asset) => (
              <TableRow key={asset.ip}>
                <TableCell className="font-mono text-sm neon-cyan">
                  {asset.ip}
                </TableCell>
                <TableCell>{asset.hostname}</TableCell>
                <TableCell>{asset.os}</TableCell>
                <TableCell>{asset.services.join(", ")}</TableCell>
                <TableCell>
                  <Badge className={getRiskColor(asset.risk).text}>
                    {asset.risk}
                  </Badge>
                </TableCell>
                <TableCell className={getStatusColor(asset.status)}>
                  {asset.status.toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewAsset(asset)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTargetScan(asset)}
                    >
                      <Target className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Asset Details Modal */}
      <Dialog
        open={!!selectedAsset}
        onOpenChange={() => setSelectedAsset(null)}
      >
        <DialogContent className="glass-panel max-w-lg">
          <DialogHeader>
            <DialogTitle className="neon-cyan">
              Asset: {selectedAsset?.ip}
            </DialogTitle>
          </DialogHeader>
          {selectedAsset && (
            <div className="space-y-3 text-sm">
              <p>
                <b>Hostname:</b> {selectedAsset.hostname}
              </p>
              <p>
                <b>OS:</b> {selectedAsset.os}
              </p>
              <p>
                <b>Status:</b>{" "}
                <span className={getStatusColor(selectedAsset.status)}>
                  {selectedAsset.status}
                </span>
              </p>
              <p>
                <b>Services:</b> {selectedAsset.services.join(", ")}
              </p>
              <div>
                <b>Vulnerabilities:</b>
                {selectedAsset.vulnerabilities.map((v, i) => (
                  <p
                    key={i}
                    className={
                      v.severity === "high" ? "text-red-400" : "text-orange-400"
                    }
                  >
                    {v.cve} — {v.desc}
                  </p>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 🎯 Focused Scan Overlay */}
      <AnimatePresence>
        {targetedAsset && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 glass-panel p-4 rounded-lg shadow-lg w-72"
          >
            <h4 className="font-semibold neon-red">
              Focused Scan: {targetedAsset.ip}
            </h4>
            <Progress value={focusedScanProgress} className="h-2 my-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(focusedScanProgress)}% complete
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
