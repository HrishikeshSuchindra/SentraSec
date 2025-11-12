import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Settings as SettingsIcon,
  Users,
  Shield,
  Globe,
  Bell,
  Key,
  Database,
  Zap,
  Monitor,
  Wifi,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit,
  Save,
  X,
  Check,
  AlertTriangle,
  Info,
  Upload,
  Download,
  RefreshCw,
  Power,
  Activity,
  Clock,
  Target,
  Search,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";
import { Progress } from "../ui/progress";

/* ======== Defaults (from your snippet) ======== */
const DEFAULT_TEAM = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@company.com",
    role: "Security Analyst",
    permissions: ["scan", "view_reports", "manage_vulnerabilities"],
    status: "active",
    last_login: "2024-01-15T14:32:00Z",
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@company.com",
    role: "Penetration Tester",
    permissions: [
      "scan",
      "exploit",
      "view_reports",
      "manage_vulnerabilities",
      "manage_exploits",
    ],
    status: "active",
    last_login: "2024-01-15T12:15:00Z",
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol@company.com",
    role: "Security Manager",
    permissions: ["admin", "all"],
    status: "active",
    last_login: "2024-01-15T10:45:00Z",
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david@company.com",
    role: "Compliance Officer",
    permissions: ["view_reports", "manage_compliance"],
    status: "inactive",
    last_login: "2024-01-10T16:20:00Z",
  },
];

const DEFAULT_POLICIES = [
  {
    id: 1,
    name: "Standard Web Application Scan",
    description: "Comprehensive web application vulnerability assessment",
    targets: ["*.company.com", "api.company.com"],
    schedule: "Weekly",
    severity_threshold: "medium",
    active: true,
    last_run: "2024-01-15T14:00:00Z",
  },
  {
    id: 2,
    name: "Critical Infrastructure Scan",
    description: "Network infrastructure and server vulnerability scan",
    targets: ["192.168.1.0/24", "10.0.0.0/16"],
    schedule: "Daily",
    severity_threshold: "low",
    active: true,
    last_run: "2024-01-15T06:00:00Z",
  },
  {
    id: 3,
    name: "Compliance Validation Scan",
    description: "PCI DSS and SOX compliance verification",
    targets: ["payment.company.com", "db-server.local"],
    schedule: "Monthly",
    severity_threshold: "critical",
    active: false,
    last_run: "2024-01-01T12:00:00Z",
  },
];

const DEFAULT_INTEGRATIONS = [
  {
    id: 1,
    name: "Splunk SIEM",
    type: "SIEM",
    status: "connected",
    description: "Security information and event management",
    config: {
      endpoint: "https://splunk.company.com",
      api_key: "••••••••",
      last_sync: "2024-01-15T14:30:00Z",
    },
  },
  {
    id: 2,
    name: "Microsoft Sentinel",
    type: "SIEM",
    status: "disconnected",
    description: "Cloud-native SIEM and SOAR solution",
    config: {
      endpoint: "https://sentinel.azure.com",
      api_key: "••••••••",
      last_sync: null,
    },
  },
  {
    id: 3,
    name: "Jira Service Management",
    type: "Ticketing",
    status: "connected",
    description: "Incident and vulnerability tracking",
    config: {
      endpoint: "https://company.atlassian.net",
      api_key: "••••••••",
      last_sync: "2024-01-15T13:15:00Z",
    },
  },
  {
    id: 4,
    name: "Slack",
    type: "Communication",
    status: "connected",
    description: "Security team notifications and alerts",
    config: {
      webhook_url: "••••••••",
      channel: "#security-alerts",
      last_sync: "2024-01-15T14:32:00Z",
    },
  },
];

const DEFAULT_SETTINGS = {
  scanning: {
    max_concurrent_scans: 5,
    scan_timeout: 3600,
    retry_attempts: 3,
    rate_limiting: true,
    stealth_mode: false,
  },
  notifications: {
    email_alerts: true,
    slack_integration: true,
    severity_threshold: "high",
    notification_frequency: "immediate",
  },
  security: {
    session_timeout: 1800,
    mfa_required: true,
    password_policy: "strong",
    audit_logging: true,
    data_retention: 365,
  },
  performance: {
    cache_enabled: true,
    compression: true,
    concurrent_connections: 100,
    memory_limit: 8192,
    cpu_limit: 80,
  },
};

/* ======== LocalStorage helpers ======== */
const LS_KEY = "app.settings.v1";
const LS_TEAM = "app.team.v1";
const LS_POLICIES = "app.policies.v1";
const LS_INTEGRATIONS = "app.integrations.v1";

const loadJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("Failed to parse localStorage key", key, e);
    return fallback;
  }
};
const saveJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("save failed", e);
  }
};

/* ======== Helper UI mapping ======== */
const getStatusColor = (status) => {
  switch (status) {
    case "active":
      return "neon-green";
    case "inactive":
      return "text-gray-400";
    case "connected":
      return "neon-green";
    case "disconnected":
      return "neon-red";
    default:
      return "text-gray-400";
  }
};
const getStatusIcon = (status) => {
  switch (status) {
    case "active":
      return Check;
    case "inactive":
      return X;
    case "connected":
      return Check;
    case "disconnected":
      return X;
    default:
      return Info;
  }
};
const getRoleColor = (role) => {
  switch (role) {
    case "Security Manager":
      return "neon-purple";
    case "Penetration Tester":
      return "neon-red";
    case "Security Analyst":
      return "neon-cyan";
    case "Compliance Officer":
      return "text-orange-400";
    default:
      return "text-gray-400";
  }
};

/* ======== The component ======== */
export function Settings() {
  const [activeTab, setActiveTab] = useState("team");

  // persisted states
  const [team, setTeam] = useState(() => loadJson(LS_TEAM, DEFAULT_TEAM));
  const [policies, setPolicies] = useState(() =>
    loadJson(LS_POLICIES, DEFAULT_POLICIES)
  );
  const [integrations, setIntegrations] = useState(() =>
    loadJson(LS_INTEGRATIONS, DEFAULT_INTEGRATIONS)
  );
  const [settings, setSettings] = useState(() =>
    loadJson(LS_KEY, DEFAULT_SETTINGS)
  );

  // local UI state for editing
  const [searchTeam, setSearchTeam] = useState("");
  const [memberEditing, setMemberEditing] = useState(null); // { id, name, email, role, permissions, status }
  const [policyEditingId, setPolicyEditingId] = useState(null);
  const [newMemberOpen, setNewMemberOpen] = useState(false);

  useEffect(() => saveJson(LS_TEAM, team), [team]);
  useEffect(() => saveJson(LS_POLICIES, policies), [policies]);
  useEffect(() => saveJson(LS_INTEGRATIONS, integrations), [integrations]);
  useEffect(() => saveJson(LS_KEY, settings), [settings]);

  // ===== Team actions =====
  const filteredTeam = team.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTeam.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTeam.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTeam.toLowerCase())
  );

  const startAddMember = () => {
    setMemberEditing({
      id: null,
      name: "",
      email: "",
      role: "Security Analyst",
      permissions: [],
      status: "active",
      last_login: new Date().toISOString(),
    });
    setNewMemberOpen(true);
  };

  const saveMember = (member) => {
    if (!member.name || !member.email) {
      window.alert("Name and email required");
      return;
    }
    if (member.id == null) {
      // add
      const id = Date.now();
      setTeam((prev) => [{ ...member, id }, ...prev]);
      window.alert("Member added");
    } else {
      // update
      setTeam((prev) => prev.map((p) => (p.id === member.id ? member : p)));
      window.alert("Member updated");
    }
    setMemberEditing(null);
    setNewMemberOpen(false);
  };

  const deleteMember = (id) => {
    if (!window.confirm("Delete this member?")) return;
    setTeam((prev) => prev.filter((m) => m.id !== id));
  };

  // Toggle role/status quickly
  const toggleMemberStatus = (id) => {
    setTeam((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "inactive" : "active" }
          : m
      )
    );
  };

  // ===== Policies =====
  const togglePolicyActive = (id) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };
  const runPolicyNow = (id) => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, last_run: new Date().toISOString() } : p
      )
    );
    window.alert("Policy run scheduled (simulated) — last_run updated");
  };
  const editPolicy = (id) => setPolicyEditingId(id);
  const savePolicy = (id, updated) => {
    setPolicies((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updated } : p))
    );
    setPolicyEditingId(null);
  };
  const deletePolicy = (id) => {
    if (!window.confirm("Delete this policy?")) return;
    setPolicies((prev) => prev.filter((p) => p.id !== id));
  };

  // ===== Integrations =====
  const toggleIntegrationStatus = (id) => {
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              status: i.status === "connected" ? "disconnected" : "connected",
            }
          : i
      )
    );
  };
  const testIntegration = (id) => {
    // simulate a test (random success)
    const ok = Math.random() > 0.15;
    const now = ok ? new Date().toISOString() : null;
    setIntegrations((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, config: { ...i.config, last_sync: now } } : i
      )
    );
    window.alert(ok ? "Integration test succeeded" : "Integration test failed");
  };

  // ===== Settings handlers =====
  const updateSetting = (path, value) => {
    // accepts path as array: ['scanning','max_concurrent_scans']
    setSettings((prev) => {
      const copy = { ...prev };
      let cursor = copy;
      for (let i = 0; i < path.length - 1; i++) {
        cursor[path[i]] = { ...cursor[path[i]] };
        cursor = cursor[path[i]];
      }
      cursor[path[path.length - 1]] = value;
      return copy;
    });
  };

  // Export config
  const exportConfig = () => {
    const payload = {
      team,
      policies,
      integrations,
      settings,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `config_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    window.alert("Config exported");
  };

  // Save changes handler (explicit)
  const saveChanges = () => {
    saveJson(LS_TEAM, team);
    saveJson(LS_POLICIES, policies);
    saveJson(LS_INTEGRATIONS, integrations);
    saveJson(LS_KEY, settings);
    window.alert("Settings saved to localStorage");
  };

  // ===== Small inline editors =====
  function PolicyEditor({ policy, onCancel, onSave }) {
    const [local, setLocal] = useState({ ...policy });
    return (
      <Card className="glass-panel p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">Edit Policy</h4>
            <p className="text-xs text-muted-foreground">{policy.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button size="sm" onClick={() => onSave(local)}>
              <Save className="w-4 h-4" /> Save
            </Button>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <Label>Name</Label>
          <Input
            value={local.name}
            onChange={(e) => setLocal((s) => ({ ...s, name: e.target.value }))}
          />
          <Label>Description</Label>
          <Textarea
            value={local.description}
            onChange={(e) =>
              setLocal((s) => ({ ...s, description: e.target.value }))
            }
          />
          <Label>Targets (comma separated)</Label>
          <Input
            value={local.targets.join(", ")}
            onChange={(e) =>
              setLocal((s) => ({
                ...s,
                targets: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              }))
            }
          />
          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Schedule</Label>
              <Input
                value={local.schedule}
                onChange={(e) =>
                  setLocal((s) => ({ ...s, schedule: e.target.value }))
                }
              />
            </div>
            <div className="w-48">
              <Label>Severity threshold</Label>
              <Select
                value={local.severity_threshold}
                onValueChange={(v) =>
                  setLocal((s) => ({ ...s, severity_threshold: v }))
                }
              >
                <SelectTrigger className="glass-panel border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel">
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  function MemberEditor({ member, onCancel, onSave }) {
    const [local, setLocal] = useState({ ...member });
    const togglePerm = (perm) => {
      const has = local.permissions.includes(perm);
      setLocal((prev) => ({
        ...prev,
        permissions: has
          ? prev.permissions.filter((p) => p !== perm)
          : [...prev.permissions, perm],
      }));
    };
    return (
      <Card className="glass-panel p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">
              {local.id ? "Edit Member" : "New Member"}
            </h4>
            <p className="text-xs text-muted-foreground">{local.email}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" /> Cancel
            </Button>
            <Button size="sm" onClick={() => onSave(local)}>
              <Save className="w-4 h-4" /> Save
            </Button>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <Label>Name</Label>
          <Input
            value={local.name}
            onChange={(e) => setLocal((s) => ({ ...s, name: e.target.value }))}
          />
          <Label>Email</Label>
          <Input
            value={local.email}
            onChange={(e) => setLocal((s) => ({ ...s, email: e.target.value }))}
          />
          <Label>Role</Label>
          <Input
            value={local.role}
            onChange={(e) => setLocal((s) => ({ ...s, role: e.target.value }))}
          />
          <Label>Permissions (click to toggle)</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {[
              "scan",
              "exploit",
              "view_reports",
              "manage_vulnerabilities",
              "manage_exploits",
              "admin",
            ].map((p) => (
              <Button
                key={p}
                size="sm"
                variant={local.permissions.includes(p) ? "default" : "outline"}
                onClick={() => togglePerm(p)}
              >
                {p}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <Label>Status</Label>
            <Select
              value={local.status}
              onValueChange={(v) => setLocal((s) => ({ ...s, status: v }))}
            >
              <SelectTrigger className="glass-panel border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-panel">
                <SelectItem value="active">active</SelectItem>
                <SelectItem value="inactive">inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    );
  }

  /* ===== Render ===== */
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
            System Configuration
          </h1>
          <p className="text-muted-foreground mt-1">
            Team management, integrations, and security policies
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            className="glass-panel border-border/50 hover:glow-cyan"
            onClick={exportConfig}
          >
            <Download className="w-4 h-4 mr-2" /> Export Config
          </Button>

          <Button
            className="glass-panel glow-green hover:glow-green neon-green"
            onClick={saveChanges}
          >
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </motion.div>

      {/* Status cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: "System Status",
            value: "Operational",
            icon: Activity,
            color: "green",
          },
          {
            title: "Active Users",
            value: team.filter((m) => m.status === "active").length,
            icon: Users,
            color: "cyan",
          },
          {
            title: "Integrations",
            value: integrations.filter((i) => i.status === "connected").length,
            icon: Globe,
            color: "purple",
          },
          { title: "Uptime", value: "99.7%", icon: Clock, color: "orange" },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card
                className={`glass-panel p-4 hover:glow-${stat.color} transition-all duration-300`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className={`text-2xl font-bold neon-${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`w-8 h-8 neon-${stat.color}`} />
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="glass-panel grid w-full grid-cols-5">
            <TabsTrigger value="team" className="data-[state=active]:glow-cyan">
              <Users className="w-4 h-4 mr-2" /> Team
            </TabsTrigger>
            <TabsTrigger
              value="policies"
              className="data-[state=active]:glow-green"
            >
              <Shield className="w-4 h-4 mr-2" /> Policies
            </TabsTrigger>
            <TabsTrigger
              value="integrations"
              className="data-[state=active]:glow-purple"
            >
              <Globe className="w-4 h-4 mr-2" /> Integrations
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:glow-orange"
            >
              <Lock className="w-4 h-4 mr-2" /> Security
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="data-[state=active]:glow-red"
            >
              <Monitor className="w-4 h-4 mr-2" /> System
            </TabsTrigger>
          </TabsList>

          {/* Team */}
          <TabsContent value="team" className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search team members..."
                    className="pl-10 glass-panel border-border/50 w-80"
                    value={searchTeam}
                    onChange={(e) => setSearchTeam(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="glow-cyan hover:glow-cyan"
                  onClick={startAddMember}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Member
                </Button>
              </div>
            </div>

            <Card className="glass-panel">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeam.map((member, i) => {
                    const StatusIcon = getStatusIcon(member.status);
                    return (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-border/30 hover:bg-accent/10"
                      >
                        <TableCell className="font-medium">
                          {member.name}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {member.email}
                        </TableCell>
                        <TableCell>
                          <Badge className={getRoleColor(member.role)}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {member.permissions.slice(0, 2).map((p, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="text-xs"
                              >
                                {p}
                              </Badge>
                            ))}
                            {member.permissions.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{member.permissions.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon
                              className={`w-4 h-4 ${getStatusColor(
                                member.status
                              )}`}
                            />
                            <span
                              className={`text-sm ${getStatusColor(
                                member.status
                              )}`}
                            >
                              {member.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(member.last_login).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setMemberEditing(member);
                                setNewMemberOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleMemberStatus(member.id)}
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMember(member.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>

            {/* Inline member editor / new member */}
            <AnimatePresence>
              {newMemberOpen && memberEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <MemberEditor
                    member={memberEditing}
                    onCancel={() => {
                      setMemberEditing(null);
                      setNewMemberOpen(false);
                    }}
                    onSave={saveMember}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          {/* Policies */}
          <TabsContent value="policies" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold neon-green">Scan Policies</h3>
              <Button
                className="glow-green hover:glow-green"
                onClick={() => {
                  const id = Date.now();
                  const newP = {
                    id,
                    name: "New Policy",
                    description: "",
                    targets: [],
                    schedule: "Weekly",
                    severity_threshold: "medium",
                    active: false,
                    last_run: null,
                  };
                  setPolicies((prev) => [newP, ...prev]);
                  setPolicyEditingId(id);
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Create Policy
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {policies.map((policy, idx) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Card className="glass-panel p-6 hover:glow-green transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{policy.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {policy.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={policy.active}
                          onCheckedChange={() => togglePolicyActive(policy.id)}
                        />
                        <Badge
                          className={
                            policy.active ? "neon-green" : "text-gray-400"
                          }
                        >
                          {policy.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>

                    {policyEditingId === policy.id ? (
                      <PolicyEditor
                        policy={policy}
                        onCancel={() => setPolicyEditingId(null)}
                        onSave={(updated) => savePolicy(policy.id, updated)}
                      />
                    ) : (
                      <>
                        <div className="space-y-2 text-sm mt-3">
                          <div className="flex justify-between">
                            <span>Schedule:</span>{" "}
                            <span className="neon-cyan">{policy.schedule}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Threshold:</span>{" "}
                            <span className="text-orange-400">
                              {policy.severity_threshold}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Targets:</span>{" "}
                            <span className="text-muted-foreground">
                              {policy.targets.length} configured
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Last Run:</span>{" "}
                            <span className="text-muted-foreground">
                              {policy.last_run
                                ? new Date(policy.last_run).toLocaleString()
                                : "—"}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-3 border-t border-border/30">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => setPolicyEditingId(policy.id)}
                          >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => runPolicyNow(policy.id)}
                          >
                            <Target className="w-4 h-4 mr-1" /> Run Now
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => deletePolicy(policy.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold neon-purple">
                External Integrations
              </h3>
              <Button
                className="glow-purple hover:glow-purple"
                onClick={() => {
                  const id = Date.now();
                  setIntegrations((prev) => [
                    {
                      id,
                      name: "New Integration",
                      type: "Other",
                      status: "disconnected",
                      description: "",
                      config: {},
                    },
                    ...prev,
                  ]);
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Integration
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {integrations.map((integration, idx) => {
                const StatusIcon = getStatusIcon(integration.status);
                return (
                  <motion.div
                    key={integration.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.03 }}
                  >
                    <Card className="glass-panel p-6 hover:glow-purple transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-semibold">
                              {integration.name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {integration.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusIcon
                              className={`w-4 h-4 ${getStatusColor(
                                integration.status
                              )}`}
                            />
                            <Badge
                              className={getStatusColor(integration.status)}
                            >
                              {integration.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Type:</span>{" "}
                            <Badge variant="outline">{integration.type}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span>Endpoint:</span>{" "}
                            <span className="font-mono text-xs">
                              {integration.config.endpoint || "—"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>API Key:</span>{" "}
                            <span className="font-mono text-xs">
                              {integration.config.api_key || "—"}
                            </span>
                          </div>
                          {integration.config.last_sync && (
                            <div className="flex justify-between">
                              <span>Last Sync:</span>{" "}
                              <span className="text-muted-foreground">
                                {new Date(
                                  integration.config.last_sync
                                ).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex space-x-2 pt-2 border-t border-border/30">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => testIntegration(integration.id)}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" /> Test
                          </Button>
                          {integration.status === "connected" ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() =>
                                toggleIntegrationStatus(integration.id)
                              }
                            >
                              <Power className="w-4 h-4 mr-1" /> Disconnect
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() =>
                                toggleIntegrationStatus(integration.id)
                              }
                            >
                              <Wifi className="w-4 h-4 mr-1" /> Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4 neon-orange">
                  Authentication & Access
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Multi-Factor Authentication</Label>
                      <p className="text-xs text-muted-foreground">
                        Require MFA for all users
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.mfa_required}
                      onCheckedChange={(v) =>
                        updateSetting(["security", "mfa_required"], v)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Session Timeout (seconds)</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[settings.security.session_timeout]}
                        onValueChange={(v) =>
                          updateSetting(["security", "session_timeout"], v[0])
                        }
                        max={7200}
                        min={300}
                        step={300}
                        className="flex-1"
                      />
                      <span className="w-16 text-sm neon-cyan">
                        {settings.security.session_timeout}s
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Password Policy</Label>
                    <Select
                      value={settings.security.password_policy}
                      onValueChange={(v) =>
                        updateSetting(["security", "password_policy"], v)
                      }
                    >
                      <SelectTrigger className="glass-panel border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-panel">
                        <SelectItem value="weak">Weak (8+ chars)</SelectItem>
                        <SelectItem value="medium">
                          Medium (10+ chars)
                        </SelectItem>
                        <SelectItem value="strong">
                          Strong (12+ chars)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Audit Logging</Label>
                      <p className="text-xs text-muted-foreground">
                        Log all user activities
                      </p>
                    </div>
                    <Switch
                      checked={settings.security.audit_logging}
                      onCheckedChange={(v) =>
                        updateSetting(["security", "audit_logging"], v)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Data Retention (days)</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[settings.security.data_retention]}
                        onValueChange={(v) =>
                          updateSetting(["security", "data_retention"], v[0])
                        }
                        max={1095}
                        min={30}
                        step={30}
                        className="flex-1"
                      />
                      <span className="w-16 text-sm neon-cyan">
                        {settings.security.data_retention}d
                      </span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4 neon-red">
                  Scanning Configuration
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Max Concurrent Scans</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[settings.scanning.max_concurrent_scans]}
                        onValueChange={(v) =>
                          updateSetting(
                            ["scanning", "max_concurrent_scans"],
                            v[0]
                          )
                        }
                        max={20}
                        min={1}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-8 text-sm neon-cyan">
                        {settings.scanning.max_concurrent_scans}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Scan Timeout (seconds)</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[settings.scanning.scan_timeout]}
                        onValueChange={(v) =>
                          updateSetting(["scanning", "scan_timeout"], v[0])
                        }
                        max={7200}
                        min={300}
                        step={300}
                        className="flex-1"
                      />
                      <span className="w-16 text-sm neon-cyan">
                        {settings.scanning.scan_timeout}s
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Retry Attempts</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[settings.scanning.retry_attempts]}
                        onValueChange={(v) =>
                          updateSetting(["scanning", "retry_attempts"], v[0])
                        }
                        max={10}
                        min={0}
                        step={1}
                        className="flex-1"
                      />
                      <span className="w-8 text-sm neon-cyan">
                        {settings.scanning.retry_attempts}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Rate Limiting</Label>
                      <p className="text-xs text-muted-foreground">
                        Limit scan speed to avoid detection
                      </p>
                    </div>
                    <Switch
                      checked={settings.scanning.rate_limiting}
                      onCheckedChange={(v) =>
                        updateSetting(["scanning", "rate_limiting"], v)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Stealth Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Use advanced evasion techniques
                      </p>
                    </div>
                    <Switch
                      checked={settings.scanning.stealth_mode}
                      onCheckedChange={(v) =>
                        updateSetting(["scanning", "stealth_mode"], v)
                      }
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Notification Settings */}
            <Card className="glass-panel p-6">
              <h3 className="font-semibold mb-4 neon-cyan">
                Notifications & Alerts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Alerts</Label>
                      <p className="text-xs text-muted-foreground">
                        Send notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email_alerts}
                      onCheckedChange={(v) =>
                        updateSetting(["notifications", "email_alerts"], v)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Slack Integration</Label>
                      <p className="text-xs text-muted-foreground">
                        Send alerts to Slack channels
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.slack_integration}
                      onCheckedChange={(v) =>
                        updateSetting(["notifications", "slack_integration"], v)
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Severity Threshold</Label>
                    <Select
                      value={settings.notifications.severity_threshold}
                      onValueChange={(v) =>
                        updateSetting(
                          ["notifications", "severity_threshold"],
                          v
                        )
                      }
                    >
                      <SelectTrigger className="glass-panel border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-panel">
                        <SelectItem value="low">Low and above</SelectItem>
                        <SelectItem value="medium">Medium and above</SelectItem>
                        <SelectItem value="high">High and above</SelectItem>
                        <SelectItem value="critical">Critical only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Notification Frequency</Label>
                    <Select
                      value={settings.notifications.notification_frequency}
                      onValueChange={(v) =>
                        updateSetting(
                          ["notifications", "notification_frequency"],
                          v
                        )
                      }
                    >
                      <SelectTrigger className="glass-panel border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-panel">
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly digest</SelectItem>
                        <SelectItem value="daily">Daily summary</SelectItem>
                        <SelectItem value="weekly">Weekly report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* System */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4 neon-red">
                  Performance Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Caching</Label>
                      <p className="text-xs text-muted-foreground">
                        Cache scan results for faster access
                      </p>
                    </div>
                    <Switch
                      checked={settings.performance.cache_enabled}
                      onCheckedChange={(v) =>
                        updateSetting(["performance", "cache_enabled"], v)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Data Compression</Label>
                      <p className="text-xs text-muted-foreground">
                        Compress data to save storage
                      </p>
                    </div>
                    <Switch
                      checked={settings.performance.compression}
                      onCheckedChange={(v) =>
                        updateSetting(["performance", "compression"], v)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Concurrent Connections</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[settings.performance.concurrent_connections]}
                        onValueChange={(v) =>
                          updateSetting(
                            ["performance", "concurrent_connections"],
                            v[0]
                          )
                        }
                        max={1000}
                        min={10}
                        step={10}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm neon-cyan">
                        {settings.performance.concurrent_connections}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Memory Limit (MB)</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[settings.performance.memory_limit]}
                        onValueChange={(v) =>
                          updateSetting(["performance", "memory_limit"], v[0])
                        }
                        max={32768}
                        min={1024}
                        step={1024}
                        className="flex-1"
                      />
                      <span className="w-16 text-sm neon-cyan">
                        {settings.performance.memory_limit}MB
                      </span>
                    </div>
                    <Progress
                      value={(settings.performance.memory_limit / 32768) * 100}
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CPU Limit (%)</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        value={[settings.performance.cpu_limit]}
                        onValueChange={(v) =>
                          updateSetting(["performance", "cpu_limit"], v[0])
                        }
                        max={100}
                        min={10}
                        step={5}
                        className="flex-1"
                      />
                      <span className="w-12 text-sm neon-cyan">
                        {settings.performance.cpu_limit}%
                      </span>
                    </div>
                    <Progress
                      value={settings.performance.cpu_limit}
                      className="h-2"
                    />
                  </div>
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4 neon-magenta">
                  System Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Version:</span>
                    <span className="text-sm neon-cyan">v2.4.1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Build:</span>
                    <span className="text-sm font-mono">20240115-a7b3c</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Database:</span>
                    <span className="text-sm neon-green">PostgreSQL 15.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Storage Used:</span>
                    <span className="text-sm text-orange-400">
                      2.3 GB / 50 GB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">License:</span>
                    <span className="text-sm neon-green">
                      Enterprise (Valid)
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/30 space-y-2">
                  <Button
                    size="sm"
                    className="w-full glow-cyan hover:glow-cyan"
                  >
                    <Upload className="w-4 h-4 mr-2" /> Check for Updates
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" /> Download Logs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      window.alert("Backup started (simulated)");
                    }}
                  >
                    <Database className="w-4 h-4 mr-2" /> Backup System
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
