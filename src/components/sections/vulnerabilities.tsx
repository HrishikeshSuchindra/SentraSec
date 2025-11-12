import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Shield,
  Zap,
  Eye,
  Filter,
  Search,
  XCircle,
} from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Progress } from "../ui/progress";
import { toast } from "sonner@2.0.3";

const initialVulnerabilities = [
  {
    id: "CVE-2024-1337",
    title: "SQL Injection in Login Form",
    severity: "critical",
    score: 9.8,
    asset: "web-app-01.local",
    description:
      "Unauthenticated SQL injection vulnerability in user login endpoint",
    exploitable: true,
    category: "Web Application",
  },
  {
    id: "CVE-2024-4242",
    title: "Buffer Overflow in Network Service",
    severity: "high",
    score: 8.1,
    asset: "server-03.local",
    description: "Stack-based buffer overflow in custom network service",
    exploitable: true,
    category: "Network",
  },
  {
    id: "CVE-2023-9999",
    title: "Weak Password Policy",
    severity: "medium",
    score: 6.5,
    asset: "domain-controller-01",
    description:
      "Password policy allows weak passwords and no complexity requirements",
    exploitable: false,
    category: "Configuration",
  },
  {
    id: "CVE-2024-5555",
    title: "Unencrypted Data Transmission",
    severity: "high",
    score: 7.8,
    asset: "api-gateway.local",
    description: "Sensitive data transmitted without encryption over HTTP",
    exploitable: true,
    category: "Crypto",
  },
  {
    id: "CVE-2024-1111",
    title: "Missing Security Headers",
    severity: "low",
    score: 3.2,
    asset: "web-app-02.local",
    description: "Web application missing critical security headers",
    exploitable: false,
    category: "Web Application",
  },
  {
    id: "CVE-2024-7777",
    title: "Privilege Escalation Vulnerability",
    severity: "critical",
    score: 9.1,
    asset: "workstation-05.local",
    description: "Local privilege escalation through misconfigured service",
    exploitable: true,
    category: "Privilege Escalation",
  },
];

// 🎨 Helper functions
const getSeverityColor = (severity) => {
  switch (severity) {
    case "critical":
      return { color: "red", glow: "glow-red", text: "neon-red" };
    case "high":
      return {
        color: "orange",
        glow: "shadow-orange-500/50",
        text: "text-orange-400",
      };
    case "medium":
      return {
        color: "yellow",
        glow: "shadow-yellow-500/50",
        text: "text-yellow-400",
      };
    case "low":
      return { color: "green", glow: "glow-green", text: "neon-green" };
    default:
      return { color: "gray", glow: "", text: "text-gray-400" };
  }
};

export function Vulnerabilities() {
  const [vulns, setVulns] = useState(initialVulnerabilities);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all-categories");
  const [selectedVuln, setSelectedVuln] = useState(null);
  const [exploiting, setExploiting] = useState(null);
  const [exploitProgress, setExploitProgress] = useState(0);
  const [heatmapHighlight, setHeatmapHighlight] = useState(null);

  // Dynamic filtering
  const filteredVulns = vulns.filter(
    (v) =>
      (severityFilter === "all" || v.severity === severityFilter) &&
      (categoryFilter === "all-categories" ||
        v.category.toLowerCase().includes(categoryFilter)) &&
      (v.title.toLowerCase().includes(search.toLowerCase()) ||
        v.id.toLowerCase().includes(search.toLowerCase()) ||
        v.asset.toLowerCase().includes(search.toLowerCase()))
  );

  // Exploit simulation
  const handleExploit = (vuln) => {
    if (exploiting) return;
    setExploiting(vuln);
    setExploitProgress(0);
    toast.info(`Exploiting ${vuln.id} on ${vuln.asset}`);
    const interval = setInterval(() => {
      setExploitProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          toast.success(`Exploit successful on ${vuln.asset}`);
          setTimeout(() => setExploiting(null), 1500);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 600);
  };

  // “Exploit All” simulation
  const handleExploitAll = async () => {
    const exploitable = vulns.filter((v) => v.exploitable);
    toast.message(`Starting ${exploitable.length} chained exploits...`);
    for (const vuln of exploitable) {
      await new Promise((resolve) => {
        setExploiting(vuln);
        setExploitProgress(0);
        const interval = setInterval(() => {
          setExploitProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              toast.success(`Exploit successful: ${vuln.id}`);
              resolve();
              return 100;
            }
            return prev + Math.random() * 25;
          });
        }, 400);
      });
    }
    setTimeout(() => setExploiting(null), 1000);
    toast.success("All exploits completed successfully");
  };

  const handleHeatmapClick = (intensity) => {
    setHeatmapHighlight(intensity);
    toast.info(
      `Highlighting vulnerabilities near ${(intensity * 100).toFixed(
        0
      )}% risk intensity`
    );
  };

  const getSeverityCount = (severity) =>
    vulns.filter((v) => v.severity === severity).length;

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="holographic text-3xl font-bold">
            Vulnerability Scanner
          </h1>
          <p className="text-muted-foreground mt-1">
            Live security findings and simulated exploits
          </p>
        </div>
        <Button
          className="glass-panel glow-cyan hover:glow-cyan neon-cyan"
          onClick={handleExploitAll}
        >
          <Zap className="w-4 h-4 mr-2" />
          Exploit All
        </Button>
      </div>

      {/* Severity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {["critical", "high", "medium", "low"].map((sev) => {
          const { glow, text } = getSeverityColor(sev);
          return (
            <Card key={sev} className={`glass-panel p-4 hover:${glow}`}>
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {sev}
                  </p>
                  <p className={`text-2xl font-bold ${text}`}>
                    {getSeverityCount(sev)}
                  </p>
                </div>
                <AlertTriangle className={`w-6 h-6 ${text}`} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vulnerabilities..."
            className="pl-10 glass-panel border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-48 glass-panel border-border/50">
            <SelectValue placeholder="All Severities" />
          </SelectTrigger>
          <SelectContent className="glass-panel">
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 glass-panel border-border/50">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="glass-panel">
            <SelectItem value="all-categories">All Categories</SelectItem>
            <SelectItem value="web">Web Application</SelectItem>
            <SelectItem value="network">Network</SelectItem>
            <SelectItem value="config">Configuration</SelectItem>
            <SelectItem value="crypto">Cryptography</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          className="glass-panel border-border/50 hover:glow-purple"
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Vulnerability List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredVulns.map((vuln) => {
          const { color, glow, text } = getSeverityColor(vuln.severity);
          const highlight =
            heatmapHighlight && vuln.score >= heatmapHighlight * 10;
          return (
            <Card
              key={vuln.id}
              className={`glass-panel p-6 transition-all duration-300 border-l-4 border-l-${color}-400 ${
                highlight ? "scale-[1.02] glow-cyan" : ""
              }`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex space-x-2">
                      <Badge
                        variant="outline"
                        className={`${text} border-${color}-400/50`}
                      >
                        {vuln.id}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {vuln.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg mt-1">{vuln.title}</h3>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${text}`}>{vuln.score}</p>
                    <p className="text-xs text-muted-foreground uppercase">
                      {vuln.severity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm neon-cyan">
                    {vuln.asset}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {vuln.description}
                </p>

                <div className="flex justify-between items-center pt-2 border-t border-border/30">
                  <div>
                    {vuln.exploitable && (
                      <Badge className="bg-red-500/20 text-red-400 border-red-400/50">
                        Exploitable
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVuln(vuln)}
                    >
                      <Eye className="w-4 h-4 mr-1" /> Details
                    </Button>
                    {vuln.exploitable && (
                      <Button
                        size="sm"
                        className={`hover:${glow} ${text}`}
                        onClick={() => handleExploit(vuln)}
                      >
                        <Zap className="w-4 h-4 mr-1" /> Exploit
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedVuln} onOpenChange={() => setSelectedVuln(null)}>
        <DialogContent className="glass-panel max-w-lg">
          <DialogHeader>
            <DialogTitle className="neon-cyan">
              {selectedVuln?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedVuln && (
            <div className="space-y-3 text-sm">
              <p>
                <b>ID:</b> {selectedVuln.id}
              </p>
              <p>
                <b>Asset:</b> {selectedVuln.asset}
              </p>
              <p>
                <b>Severity:</b> {selectedVuln.severity}
              </p>
              <p>
                <b>Description:</b> {selectedVuln.description}
              </p>
              <p>
                <b>Category:</b> {selectedVuln.category}
              </p>
              {selectedVuln.exploitable ? (
                <Badge className="bg-red-500/20 text-red-400 border-red-400/50">
                  Exploitable
                </Badge>
              ) : (
                <Badge className="bg-green-500/20 text-green-400 border-green-400/50">
                  Not Exploitable
                </Badge>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Exploit Progress */}
      <AnimatePresence>
        {exploiting && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 right-6 glass-panel p-4 rounded-lg shadow-lg w-72"
          >
            <h4 className="font-semibold neon-red">
              Exploiting: {exploiting.id}
            </h4>
            <Progress value={exploitProgress} className="h-2 my-2" />
            <p className="text-xs text-muted-foreground">
              {Math.round(exploitProgress)}% complete on {exploiting.asset}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Heatmap */}
      <Card className="glass-panel p-6">
        <h3 className="font-semibold mb-4 neon-purple">
          Vulnerability Heatmap
        </h3>
        <div className="grid grid-cols-8 gap-2">
          {Array.from({ length: 64 }, (_, i) => {
            const intensity = Math.random();
            const color =
              intensity > 0.8
                ? "bg-red-500/80 glow-red"
                : intensity > 0.6
                ? "bg-orange-500/60"
                : intensity > 0.4
                ? "bg-yellow-500/40"
                : intensity > 0.2
                ? "bg-green-500/20"
                : "bg-gray-500/10";
            return (
              <motion.div
                key={i}
                onClick={() => handleHeatmapClick(intensity)}
                whileHover={{ scale: 1.1 }}
                className={`aspect-square rounded-sm ${color} cursor-pointer`}
                title={`Asset ${i + 1} Risk ${(intensity * 100).toFixed(0)}%`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-3 text-xs text-muted-foreground">
          <span>Low Risk</span>
          <span>High Risk</span>
        </div>
      </Card>
    </div>
  );
}
