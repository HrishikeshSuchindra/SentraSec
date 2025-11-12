import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Activity,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
  Target,
  TrendingUp,
  Bell,
  Users,
  Database,
  Clock,
  Eye,
} from "lucide-react";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { EmergencyScanModal } from "./emergency-scan-modal";

const stats = [
  {
    title: "Assets Scanned",
    value: "1,337",
    change: "+12%",
    icon: Target,
    color: "cyan",
    glow: "glow-cyan",
  },
  {
    title: "Vulnerabilities Found",
    value: "42",
    change: "+5%",
    icon: AlertTriangle,
    color: "orange",
    glow: "shadow-orange-500/50",
  },
  {
    title: "Exploits Running",
    value: "7",
    change: "+2",
    icon: Zap,
    color: "red",
    glow: "glow-red",
  },
  {
    title: "Remediated Issues",
    value: "156",
    change: "+23%",
    icon: CheckCircle,
    color: "green",
    glow: "glow-green",
  },
];

const vulnerabilityBreakdown = [
  { severity: "Critical", count: 3, color: "red", percentage: 15 },
  { severity: "High", count: 12, color: "orange", percentage: 35 },
  { severity: "Medium", count: 18, color: "yellow", percentage: 30 },
  { severity: "Low", count: 9, color: "green", percentage: 20 },
];

const recentActivity = [
  {
    time: "14:32",
    action: "SQL injection detected on",
    target: "web-app-01.local",
    status: "critical",
  },
  {
    time: "14:28",
    action: "Privilege escalation successful on",
    target: "db-server-03.local",
    status: "success",
  },
  {
    time: "14:25",
    action: "Port scan completed for",
    target: "192.168.1.0/24",
    status: "info",
  },
  {
    time: "14:21",
    action: "Weak credentials found on",
    target: "ftp-server-02.local",
    status: "warning",
  },
  {
    time: "14:18",
    action: "Network enumeration started for",
    target: "DMZ subnet",
    status: "info",
  },
];

const activeThreatIntel = [
  {
    id: 1,
    threat: "APT29 Campaign",
    severity: "critical",
    confidence: 85,
    last_seen: "2h ago",
  },
  {
    id: 2,
    threat: "Emotet Botnet",
    severity: "high",
    confidence: 92,
    last_seen: "4h ago",
  },
  {
    id: 3,
    threat: "Phishing Campaign",
    severity: "medium",
    confidence: 78,
    last_seen: "1d ago",
  },
  {
    id: 4,
    threat: "Ransomware IOCs",
    severity: "high",
    confidence: 95,
    last_seen: "6h ago",
  },
];

const systemHealth = {
  scanners: { status: "operational", uptime: 99.7 },
  database: { status: "operational", uptime: 99.9 },
  api: { status: "degraded", uptime: 97.2 },
  storage: { status: "operational", uptime: 100 },
};

const quickActions = [
  {
    title: "Emergency Scan",
    description: "Run immediate network scan",
    icon: Zap,
    color: "red",
  },
  {
    title: "Generate Report",
    description: "Create executive summary",
    icon: Target,
    color: "cyan",
  },
  {
    title: "Alert Review",
    description: "Review pending alerts",
    icon: Bell,
    color: "orange",
  },
  {
    title: "Team Status",
    description: "Check team availability",
    icon: Users,
    color: "green",
  },
];

export function Dashboard() {
  const [realTimeStats, setRealTimeStats] = useState(stats);
  const [activeThreats, setActiveThreats] = useState(4);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats((prev) =>
        prev.map((stat) => ({
          ...stat,
          value:
            stat.title === "Assets Scanned"
              ? String(
                  Math.max(
                    1000,
                    parseInt(stat.value.replace(",", "")) +
                      Math.floor(Math.random() * 10)
                  )
                )
              : stat.value,
        }))
      );

      setActiveThreats((prev) =>
        Math.max(1, prev + (Math.random() > 0.7 ? 1 : 0))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="holographic text-3xl font-bold">Command Center</h1>
          <p className="text-muted-foreground mt-1">
            Real-time penetration testing overview
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="glass-panel px-4 py-2 flex items-center space-x-2">
            <Activity className="w-4 h-4 neon-green" />
            <span className="text-sm">Live Monitoring</span>
          </div>
          <div className="glass-panel px-4 py-2 flex items-center space-x-2">
            <Shield className="w-4 h-4 neon-cyan" />
            <span className="text-sm">Stealth Mode</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {realTimeStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`glass-panel p-6 hover:${stat.glow} transition-all duration-300 cursor-pointer`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold mt-1 neon-${stat.color}`}>
                      {stat.value}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-green-400">{stat.change}</p>
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    </div>
                  </div>
                  <Icon className={`w-8 h-8 neon-${stat.color}`} />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {action.title === "Emergency Scan" ? (
                <EmergencyScanModal>
                  <Button
                    variant="outline"
                    className={`glass-panel h-auto p-4 hover:glow-${action.color} transition-all duration-300 w-full`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <Icon className={`w-6 h-6 neon-${action.color}`} />
                      <div className="text-center">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {action.description}
                        </div>
                      </div>
                    </div>
                  </Button>
                </EmergencyScanModal>
              ) : (
                <Button
                  variant="outline"
                  className={`glass-panel h-auto p-4 hover:glow-${action.color} transition-all duration-300 w-full`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Icon className={`w-6 h-6 neon-${action.color}`} />
                    <div className="text-center">
                      <div className="font-medium">{action.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.description}
                      </div>
                    </div>
                  </div>
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Holographic Globe */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-panel p-6 h-96">
            <h3 className="font-semibold mb-4 neon-cyan">Network Topology</h3>
            <div className="relative h-full flex items-center justify-center">
              {/* Globe placeholder with animated rings */}
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-48 h-48 rounded-full border-2 border-cyan-400/30 relative"
                >
                  {/* Animated attack paths */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{
                      duration: 15,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-4 rounded-full border border-red-400/50"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-8 rounded-full border border-purple-400/40"
                  />

                  {/* Active nodes */}
                  <div className="absolute top-12 right-16 w-3 h-3 bg-red-400 rounded-full pulse glow-red" />
                  <div className="absolute bottom-16 left-12 w-3 h-3 bg-green-400 rounded-full pulse glow-green" />
                  <div className="absolute top-20 left-20 w-3 h-3 bg-cyan-400 rounded-full pulse glow-cyan" />
                  <div className="absolute bottom-20 right-20 w-3 h-3 bg-purple-400 rounded-full pulse glow-purple" />
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="neon-cyan text-lg font-bold">
                      Global View
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Live Attack Vectors
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Vulnerability Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-panel p-6 h-96">
            <h3 className="font-semibold mb-4 neon-magenta">
              Vulnerability Analysis
            </h3>
            <div className="space-y-4">
              {vulnerabilityBreakdown.map((vuln, index) => (
                <motion.div
                  key={vuln.severity}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                  className="space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{vuln.severity}</span>
                    <span
                      className={`text-sm font-bold text-${vuln.color}-400`}
                    >
                      {vuln.count}
                    </span>
                  </div>
                  <Progress
                    value={vuln.percentage}
                    className={`h-2 bg-muted/20`}
                  />
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="text-center">
                <div className="neon-orange text-xl font-bold">42</div>
                <div className="text-xs text-muted-foreground">
                  Total Vulnerabilities
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* System Health & Threat Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="glass-panel p-6">
            <h3 className="font-semibold mb-4 neon-green">System Health</h3>
            <div className="space-y-4">
              {Object.entries(systemHealth).map(
                ([component, health], index) => (
                  <motion.div
                    key={component}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded border border-border/30"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          health.status === "operational"
                            ? "bg-green-400 glow-green"
                            : health.status === "degraded"
                            ? "bg-orange-400"
                            : "bg-red-400 glow-red"
                        }`}
                      />
                      <span className="capitalize font-medium">
                        {component}
                      </span>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm ${
                          health.status === "operational"
                            ? "neon-green"
                            : health.status === "degraded"
                            ? "text-orange-400"
                            : "neon-red"
                        }`}
                      >
                        {health.status}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {health.uptime}% uptime
                      </div>
                    </div>
                  </motion.div>
                )
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold neon-red">
                Active Threat Intelligence
              </h3>
              <Badge className="bg-red-500/20 text-red-400 border-red-400/50">
                {activeThreats} Active
              </Badge>
            </div>
            <div className="space-y-3">
              {activeThreatIntel.map((intel, index) => (
                <motion.div
                  key={intel.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="glass-panel p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{intel.threat}</h4>
                    <Badge
                      className={
                        intel.severity === "critical"
                          ? "bg-red-500/20 text-red-400"
                          : intel.severity === "high"
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }
                    >
                      {intel.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Confidence:{" "}
                      <span className="neon-cyan">{intel.confidence}%</span>
                    </span>
                    <span className="text-muted-foreground">
                      {intel.last_seen}
                    </span>
                  </div>
                  <Progress value={intel.confidence} className="h-1" />
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold neon-purple">Live Activity Feed</h3>
            <Button variant="ghost" size="sm" className="hover:glow-cyan">
              <Eye className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center space-x-4 p-3 rounded-lg border border-border/30 hover:bg-accent/10 transition-colors cursor-pointer"
              >
                <div className="text-xs text-muted-foreground font-mono w-12">
                  {activity.time}
                </div>
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.status === "critical"
                      ? "bg-red-400 glow-red"
                      : activity.status === "success"
                      ? "bg-green-400 glow-green"
                      : activity.status === "warning"
                      ? "bg-orange-400"
                      : "bg-cyan-400 glow-cyan"
                  }`}
                />
                <div className="flex-1 text-sm">
                  <span>{activity.action} </span>
                  <span className="neon-cyan font-mono">{activity.target}</span>
                </div>
                <Clock className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
