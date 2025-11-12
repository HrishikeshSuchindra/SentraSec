import { useState } from "react";
import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Zap,
  Terminal,
  Play,
  CheckCircle,
  AlertTriangle,
  Shield,
  Network,
  Clock,
  Copy,
  Download,
} from "lucide-react";
import { toast } from "sonner@2.0.3";

interface ScanOption {
  id: string;
  name: string;
  description: string;
  command: string;
  duration: string;
  aggressiveness: "low" | "medium" | "high";
}

const scanOptions: ScanOption[] = [
  {
    id: "default",
    name: "Default Scan",
    description: "Basic TCP port scan with service detection",
    command: "nmap -sS -sV -O --top-ports 1000",
    duration: "2-5 minutes",
    aggressiveness: "medium",
  },
  {
    id: "quick",
    name: "Quick Scan",
    description: "Fast scan of most common ports",
    command: "nmap -T4 -F",
    duration: "30 seconds",
    aggressiveness: "low",
  },
  {
    id: "comprehensive",
    name: "Comprehensive Scan",
    description: "Deep scan with NSE scripts and OS detection",
    command:
      "nmap -sS -sU -T4 -A -v -PE -PP -PS80,443 -PA3389 -PU40125 -PY --source-port 53",
    duration: "10-20 minutes",
    aggressiveness: "high",
  },
  {
    id: "stealth",
    name: "Stealth Scan",
    description: "Slow, evasive scan to avoid detection",
    command: "nmap -sS -T1 -f --randomize-hosts",
    duration: "15-30 minutes",
    aggressiveness: "low",
  },
  {
    id: "udp",
    name: "UDP Scan",
    description: "UDP port scan for services like DNS, SNMP",
    command: "nmap -sU --top-ports 100",
    duration: "5-10 minutes",
    aggressiveness: "medium",
  },
];

// Mock scan results
const mockScanResults = {
  host: "192.168.1.100",
  status: "up",
  latency: "0.015s",
  ports: [
    {
      port: 22,
      protocol: "tcp",
      state: "open",
      service: "ssh",
      version: "OpenSSH 8.2p1 Ubuntu 4ubuntu0.5",
      severity: "info",
    },
    {
      port: 80,
      protocol: "tcp",
      state: "open",
      service: "http",
      version: "Apache httpd 2.4.41",
      severity: "warning",
    },
    {
      port: 443,
      protocol: "tcp",
      state: "open",
      service: "https",
      version: "Apache httpd 2.4.41 (SSL)",
      severity: "info",
    },
    {
      port: 3306,
      protocol: "tcp",
      state: "open",
      service: "mysql",
      version: "MySQL 8.0.27",
      severity: "high",
    },
    {
      port: 21,
      protocol: "tcp",
      state: "filtered",
      service: "ftp",
      version: "",
      severity: "medium",
    },
    {
      port: 53,
      protocol: "udp",
      state: "open",
      service: "domain",
      version: "ISC BIND 9.16.1",
      severity: "info",
    },
  ],
  os: "Linux 5.4.0 (Ubuntu 20.04)",
  uptime: "127 days",
  vulnerabilities: [
    {
      cve: "CVE-2022-3715",
      severity: "high",
      description: "Bash command injection in web server",
    },
    {
      cve: "CVE-2023-0286",
      severity: "medium",
      description: "MySQL privilege escalation",
    },
  ],
};

interface EmergencyScanModalProps {
  children: React.ReactNode;
}

export function EmergencyScanModal({ children }: EmergencyScanModalProps) {
  const [open, setOpen] = useState(false);
  const [ipAddress, setIpAddress] = useState("");
  const [selectedScan, setSelectedScan] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState<typeof mockScanResults | null>(
    null
  );
  const [scanComplete, setScanComplete] = useState(false);

  const handleStartScan = async () => {
    if (!ipAddress || !selectedScan) {
      toast.error("Please enter an IP address and select a scan type");
      return;
    }

    // Validate IP address format
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    if (!ipRegex.test(ipAddress)) {
      toast.error("Please enter a valid IP address");
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setScanResults(null);

    // Simulate scan progress
    const progressInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsScanning(false);
          setScanComplete(true);
          setScanResults({
            ...mockScanResults,
            host: ipAddress,
          });
          toast.success("Scan completed successfully!");
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);

    toast.success("Emergency scan initiated");
  };

  const handleCopyCommand = () => {
    const selectedOption = scanOptions.find((opt) => opt.id === selectedScan);
    if (selectedOption) {
      navigator.clipboard.writeText(`${selectedOption.command} ${ipAddress}`);
      toast.success("Command copied to clipboard");
    }
  };

  const handleExportResults = () => {
    if (scanResults) {
      const data = JSON.stringify(scanResults, null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scan_results_${ipAddress}_${
        new Date().toISOString().split("T")[0]
      }.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Results exported successfully");
    }
  };

  const selectedOption = scanOptions.find((opt) => opt.id === selectedScan);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="glass-panel max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 neon-red" />
            <span className="neon-red">Emergency Network Scan</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!scanComplete ? (
            <>
              {/* Target Configuration */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ip-address">Target IP Address</Label>
                  <Input
                    id="ip-address"
                    placeholder="192.168.1.100"
                    value={ipAddress}
                    onChange={(e) => setIpAddress(e.target.value)}
                    className="glass-panel border-cyan-400/50 focus:border-cyan-400 focus:glow-cyan"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scan-type">Scan Type</Label>
                  <Select value={selectedScan} onValueChange={setSelectedScan}>
                    <SelectTrigger className="glass-panel border-cyan-400/50">
                      <SelectValue placeholder="Select a scan type" />
                    </SelectTrigger>
                    <SelectContent className="glass-panel">
                      {scanOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{option.name}</span>
                            <Badge
                              className={`ml-2 ${
                                option.aggressiveness === "high"
                                  ? "bg-red-500/20 text-red-400"
                                  : option.aggressiveness === "medium"
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {option.aggressiveness}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedOption && (
                  <Card className="glass-panel p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium neon-cyan">
                        {selectedOption.name}
                      </h4>
                      <Badge className="bg-cyan-500/20 text-cyan-400">
                        {selectedOption.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedOption.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Command Preview</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyCommand}
                          className="h-6 px-2 hover:glow-cyan"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="glass-panel p-3 font-mono text-sm bg-black/50 border border-green-400/30">
                        <span className="neon-green">
                          {selectedOption.command} {ipAddress}
                        </span>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Scan Progress */}
              {isScanning && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <Card className="glass-panel p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <Terminal className="w-5 h-5 neon-cyan animate-pulse" />
                      <span className="neon-cyan">Scanning {ipAddress}...</span>
                    </div>
                    <Progress value={scanProgress} className="h-2 mb-2" />
                    <div className="text-xs text-muted-foreground">
                      Progress: {Math.round(scanProgress)}%
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isScanning}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleStartScan}
                  disabled={!ipAddress || !selectedScan || isScanning}
                  className="glow-red"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isScanning ? "Scanning..." : "Start Scan"}
                </Button>
              </div>
            </>
          ) : (
            /* Scan Results */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 neon-green" />
                  <div>
                    <h3 className="font-semibold neon-green">Scan Complete</h3>
                    <p className="text-sm text-muted-foreground">
                      Target: {scanResults?.host}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExportResults}
                    className="hover:glow-cyan"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setScanComplete(false);
                      setScanResults(null);
                      setIpAddress("");
                      setSelectedScan("");
                    }}
                    className="hover:glow-cyan"
                  >
                    New Scan
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="glass-panel">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="ports">Ports & Services</TabsTrigger>
                  <TabsTrigger value="vulnerabilities">
                    Vulnerabilities
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="glass-panel p-4">
                      <div className="flex items-center space-x-3">
                        <Network className="w-5 h-5 neon-green" />
                        <div>
                          <div className="font-medium neon-green">
                            Host Status
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {scanResults?.status}
                          </div>
                        </div>
                      </div>
                    </Card>
                    <Card className="glass-panel p-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 neon-cyan" />
                        <div>
                          <div className="font-medium neon-cyan">Latency</div>
                          <div className="text-sm text-muted-foreground">
                            {scanResults?.latency}
                          </div>
                        </div>
                      </div>
                    </Card>
                    <Card className="glass-panel p-4">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 neon-orange" />
                        <div>
                          <div className="font-medium neon-orange">
                            OS Detection
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {scanResults?.os}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="ports" className="space-y-4">
                  <div className="space-y-3">
                    {scanResults?.ports.map((port, index) => (
                      <Card key={index} className="glass-panel p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Badge
                              className={`${
                                port.state === "open"
                                  ? "bg-green-500/20 text-green-400"
                                  : port.state === "filtered"
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {port.port}/{port.protocol}
                            </Badge>
                            <div>
                              <div className="font-medium">{port.service}</div>
                              <div className="text-sm text-muted-foreground">
                                {port.version}
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={`${
                              port.severity === "high"
                                ? "bg-red-500/20 text-red-400"
                                : port.severity === "medium"
                                ? "bg-orange-500/20 text-orange-400"
                                : port.severity === "warning"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {port.severity}
                          </Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="vulnerabilities" className="space-y-4">
                  {scanResults?.vulnerabilities.map((vuln, index) => (
                    <Card key={index} className="glass-panel p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <AlertTriangle
                              className={`w-5 h-5 ${
                                vuln.severity === "high"
                                  ? "neon-red"
                                  : "text-orange-400"
                              }`}
                            />
                            <span className="font-medium">{vuln.cve}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {vuln.description}
                          </p>
                        </div>
                        <Badge
                          className={`${
                            vuln.severity === "high"
                              ? "bg-red-500/20 text-red-400"
                              : "bg-orange-500/20 text-orange-400"
                          }`}
                        >
                          {vuln.severity}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
