import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import {
  Database,
  Key,
  Shield,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  Lock,
  Unlock,
  Copy,
  Image,
  FileText,
  Video,
  Archive,
  Globe,
  Users,
  Hash,
  X,
  Trash,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";
import { toast } from "sonner@2.0.3";

/**
 * LocalStorage keys
 */
const LS_KEYS = {
  CREDENTIALS: "de.credentials.v1",
  SESSIONS: "de.sessions.v1",
  EVIDENCE: "de.evidence.v1",
  TRAFFIC: "de.traffic.v1",
};

/**
 * Default demo data (used only if localStorage is empty)
 */
const defaultCredentials = [
  {
    id: 1,
    username: "admin",
    password: "P@ssw0rd123",
    domain: "corp.local",
    source: "web-app-01.local",
    type: "cleartext",
    access_level: "administrator",
    last_used: "2024-01-15T14:32:00Z",
    cracked: true,
    strength: "weak",
    revealed: false,
  },
  {
    id: 2,
    username: "dbadmin",
    password: "DatabaseP@ss2024!",
    domain: "sql-server.local",
    source: "memory dump",
    type: "NTLM",
    access_level: "database admin",
    last_used: "2024-01-15T12:15:00Z",
    cracked: true,
    strength: "strong",
    revealed: false,
  },
  {
    id: 3,
    username: "service_account",
    password: "[ENCRYPTED]",
    domain: "corp.local",
    source: "registry",
    type: "encrypted",
    access_level: "service",
    last_used: "2024-01-15T10:45:00Z",
    cracked: false,
    strength: "unknown",
    revealed: false,
  },
  {
    id: 4,
    username: "john.doe",
    password: "password123",
    domain: "corp.local",
    source: "network sniff",
    type: "cleartext",
    access_level: "user",
    last_used: "2024-01-15T16:20:00Z",
    cracked: true,
    strength: "very weak",
    revealed: false,
  },
];

const defaultEvidence = [
  {
    id: 1,
    type: "screenshot",
    title: "Admin Panel Access",
    description: "Successful login to administrative interface",
    timestamp: "2024-01-15T14:32:15Z",
    source: "web-app-01.local",
    size: "2.4 MB",
    hash: "a1b2c3d4e5f6",
    tags: ["admin", "web", "authentication"],
  },
  {
    id: 2,
    type: "document",
    title: "Database Schema",
    description: "Complete database structure",
    timestamp: "2024-01-15T13:45:22Z",
    source: "sql-server.local",
    size: "156 KB",
    hash: "f6e5d4c3b2a1",
    tags: ["database", "schema"],
  },
];

const defaultTraffic = [
  {
    protocol: "HTTP",
    bytes: 1247623,
    packets: 8234,
    sessions: 156,
    suspicious: 23,
  },
  {
    protocol: "HTTPS",
    bytes: 5623441,
    packets: 32456,
    sessions: 445,
    suspicious: 5,
  },
  {
    protocol: "DNS",
    bytes: 234567,
    packets: 5678,
    sessions: 89,
    suspicious: 12,
  },
  {
    protocol: "SMB",
    bytes: 2345678,
    packets: 15678,
    sessions: 234,
    suspicious: 34,
  },
];

/**
 * Utility helpers
 */
const loadOrDefault = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
};

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("localStorage save failed", e);
  }
};

export function DataExfil() {
  // persisted states
  const [credentials, setCredentials] = useState(() =>
    loadOrDefault(LS_KEYS.CREDENTIALS, defaultCredentials)
  );
  const [evidence, setEvidence] = useState(() =>
    loadOrDefault(LS_KEYS.EVIDENCE, defaultEvidence)
  );
  const [traffic, setTraffic] = useState(() =>
    loadOrDefault(LS_KEYS.TRAFFIC, defaultTraffic)
  );
  const [sessions, setSessions] = useState(() =>
    loadOrDefault(LS_KEYS.SESSIONS, [])
  ); // each session: { id, target, user, protocol, status, startedAt, elapsedSeconds, last_activity }

  // UI state
  const [activeTab, setActiveTab] = useState("credentials");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [crackingProgress, setCrackingProgress] = useState(0);
  const [isCracking, setIsCracking] = useState(false);

  // refs
  const sessionsTimerRef = useRef(null);

  // Persist to localStorage whenever these change
  useEffect(() => save(LS_KEYS.CREDENTIALS, credentials), [credentials]);
  useEffect(() => save(LS_KEYS.EVIDENCE, evidence), [evidence]);
  useEffect(() => save(LS_KEYS.TRAFFIC, traffic), [traffic]);
  useEffect(() => save(LS_KEYS.SESSIONS, sessions), [sessions]);

  // Live "traffic" updates to simulate exfil growth
  useEffect(() => {
    const t = setInterval(() => {
      setTraffic((prev) =>
        prev.map((item) => ({
          ...item,
          bytes: item.bytes + Math.floor(Math.random() * 5000),
          packets: item.packets + Math.floor(Math.random() * 50),
          suspicious: Math.max(
            0,
            item.suspicious + (Math.random() > 0.85 ? 1 : 0)
          ),
        }))
      );
    }, 3000);
    return () => clearInterval(t);
  }, []);

  // Password cracking simulation
  useEffect(() => {
    if (!isCracking) return;
    if (crackingProgress >= 100) {
      setIsCracking(false);
      toast &&
        toast.success &&
        toast.success("GPU cracking finished — some creds cracked");
      // Mark one previously encrypted credential as cracked (demo)
      setCredentials((prev) => {
        const idx = prev.findIndex((c) => !c.cracked);
        if (idx === -1) return prev;
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          cracked: true,
          password: "Recovered!23",
          strength: "weak",
        };
        return copy;
      });
      return;
    }
    const id = setInterval(() => {
      setCrackingProgress((p) => Math.min(100, p + Math.random() * 6));
    }, 1200);
    return () => clearInterval(id);
  }, [isCracking, crackingProgress]);

  // Sessions: one central timer updates elapsedSeconds for active sessions
  useEffect(() => {
    // clear existing
    if (sessionsTimerRef.current) {
      clearInterval(sessionsTimerRef.current);
      sessionsTimerRef.current = null;
    }

    // if there are active sessions, start a timer
    const anyRunning = sessions.some(
      (s) => s.status === "active" || s.status === "monitoring"
    );
    if (!anyRunning) return;

    sessionsTimerRef.current = setInterval(() => {
      setSessions((prev) =>
        prev.map((sess) => {
          if (sess.status === "active" || sess.status === "monitoring") {
            const newElapsed = (sess.elapsedSeconds || 0) + 1;
            return {
              ...sess,
              elapsedSeconds: newElapsed,
              last_activity: sess.last_activity || "",
            };
          }
          return sess;
        })
      );
    }, 1000);

    return () => {
      if (sessionsTimerRef.current) {
        clearInterval(sessionsTimerRef.current);
        sessionsTimerRef.current = null;
      }
    };
  }, [sessions]);

  // Utilities
  const formatDuration = (secs = 0) => {
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((secs / 60) % 60)
      .toString()
      .padStart(2, "0");
    const h = Math.floor(secs / 3600)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "screenshot":
        return Image;
      case "document":
        return FileText;
      case "video":
        return Video;
      case "archive":
        return Archive;
      default:
        return FileText;
    }
  };

  // Actions

  // Eye toggle reveal password (updates local state)
  const toggleReveal = (id) => {
    setCredentials((prev) =>
      prev.map((c) => (c.id === id ? { ...c, revealed: !c.revealed } : c))
    );
  };

  // Copy to clipboard (works for passwords and arbitrary text)
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast && toast.success && toast.success("Copied to clipboard");
    } catch (e) {
      console.error("Clipboard write failed", e);
      toast && toast.error && toast.error("Copy failed");
    }
  };

  // Start a new simulated session (hijack)
  const startSession = () => {
    const id = Date.now();
    const newSess = {
      id,
      target: `192.168.1.${100 + Math.floor(Math.random() * 100)}`,
      user: ["admin@corp.local", "john.doe@corp.local", "dbadmin@sql.local"][
        Math.floor(Math.random() * 3)
      ],
      protocol: ["RDP", "SMB", "SQL", "SSH"][Math.floor(Math.random() * 4)],
      status: "active",
      startedAt: Date.now(),
      elapsedSeconds: 0,
      last_activity: "Session started",
    };
    setSessions((prev) => [newSess, ...prev]);
    toast &&
      toast.success &&
      toast.success(`Session started → ${newSess.target}`);
  };

  // Pause a running session
  const pauseSession = (id) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: "paused", last_activity: "Paused by operator" }
          : s
      )
    );
  };

  // Resume a paused session
  const resumeSession = (id) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: "active", last_activity: "Resumed" } : s
      )
    );
  };

  // Terminate a session
  const terminateSession = (id) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: "terminated",
              last_activity: "Terminated",
              endedAt: Date.now(),
            }
          : s
      )
    );
    toast && toast.error && toast.error("Session terminated");
  };

  // Download evidence file (simulate)
  const downloadEvidence = (ev) => {
    // simulate file content
    const text = `Evidence: ${ev.title}\nSource: ${ev.source}\nTimestamp: ${ev.timestamp}\nHash: ${ev.hash}\n\nDescription:\n${ev.description}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${ev.title.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast && toast.success && toast.success("Evidence download started");
  };

  // Add a new credential (demo helper)
  const addCredential = () => {
    const id = Date.now();
    const newCred = {
      id,
      username: `user${id % 1000}`,
      password: "NewPassword!23",
      domain: "corp.local",
      source: "probe",
      type: "cleartext",
      access_level: "user",
      last_used: new Date().toISOString(),
      cracked: false,
      strength: "unknown",
      revealed: false,
    };
    setCredentials((prev) => [newCred, ...prev]);
    toast && toast.success && toast.success("Credential added (demo)");
  };

  // Remove credential
  const removeCredential = (id) => {
    setCredentials((prev) => prev.filter((c) => c.id !== id));
    toast && toast.success && toast.success("Credential removed");
  };

  // Filtered credential list
  const filteredCredentials = credentials.filter(
    (c) =>
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Evidence modal renderer
  const EvidenceModal = ({ ev, onClose }) => {
    const Icon = getTypeIcon(ev.type);
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      >
        <Card className="p-6 w-[520px] relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3 top-3"
            onClick={onClose}
          >
            <X />
          </Button>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Icon className="w-6 h-6 neon-purple" />
              <h3 className="font-bold text-lg">{ev.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{ev.description}</p>
            <div className="text-xs text-muted-foreground">
              Source: <span className="neon-cyan">{ev.source}</span> • Size:{" "}
              {ev.size} • Hash: <span className="font-mono">{ev.hash}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {ev.tags.map((t, i) => (
                <Badge key={i} className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => downloadEvidence(ev)}
                className="glow-purple"
              >
                {" "}
                <Download className="w-4 h-4 mr-2" /> Download
              </Button>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="holographic text-3xl font-bold">
            Data Exfiltration & Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">
            Credential vault, session hijacking and evidence management
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="glass-panel border-border/50 hover:glow-cyan"
            onClick={() => {
              save(LS_KEYS.CREDENTIALS, credentials);
              toast && toast.success && toast.success("Snapshot saved");
            }}
          >
            <Upload className="w-4 h-4 mr-2" /> Snapshot
          </Button>
          <Button
            className="glass-panel glow-purple"
            onClick={() => addCredential()}
          >
            <Database className="w-4 h-4 mr-2" /> Add Cred
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Credentials</p>
              <p className="text-2xl font-bold neon-cyan">
                {credentials.length}
              </p>
            </div>
            <Key className="w-8 h-8 neon-cyan" />
          </div>
        </Card>

        <Card className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <p className="text-2xl font-bold neon-green">
                {
                  sessions.filter(
                    (s) => s.status === "active" || s.status === "monitoring"
                  ).length
                }
              </p>
            </div>
            <Globe className="w-8 h-8 neon-green" />
          </div>
        </Card>

        <Card className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Evidence Items</p>
              <p className="text-2xl font-bold neon-purple">
                {evidence.length}
              </p>
            </div>
            <Archive className="w-8 h-8 neon-purple" />
          </div>
        </Card>

        <Card className="glass-panel p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Traffic (suspicious)
              </p>
              <p className="text-2xl font-bold neon-orange">
                {traffic.reduce((acc, t) => acc + t.suspicious, 0)}
              </p>
            </div>
            <Download className="w-8 h-8 neon-orange" />
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <div className="glass-panel p-3 grid grid-cols-4">
          <Button
            variant={activeTab === "credentials" ? "default" : "ghost"}
            onClick={() => setActiveTab("credentials")}
            className="flex items-center gap-2"
          >
            <Key className="w-4 h-4" /> Credentials
          </Button>
          <Button
            variant={activeTab === "sessions" ? "default" : "ghost"}
            onClick={() => setActiveTab("sessions")}
            className="flex items-center gap-2"
          >
            <Globe className="w-4 h-4" /> Sessions
          </Button>
          <Button
            variant={activeTab === "evidence" ? "default" : "ghost"}
            onClick={() => setActiveTab("evidence")}
            className="flex items-center gap-2"
          >
            <Archive className="w-4 h-4" /> Evidence
          </Button>
          <Button
            variant={activeTab === "traffic" ? "default" : "ghost"}
            onClick={() => setActiveTab("traffic")}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Traffic
          </Button>
        </div>

        {/* Credentials Tab */}
        <TabsContent value="credentials" className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search username / domain / source"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                toast && toast("Cleared");
              }}
            >
              Clear
            </Button>
            <Button
              onClick={() => {
                setIsCracking(true);
                setCrackingProgress(0);
                toast &&
                  toast.success &&
                  toast.success("GPU cracking started (simulated)");
              }}
              className="glow-red"
            >
              <Hash className="w-4 h-4 mr-2" /> Start GPU Cracking
            </Button>
          </div>

          <Card className="glass-panel p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCredentials.map((cred, i) => (
                  <motion.tr
                    key={cred.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    onDoubleClick={() => toggleReveal(cred.id)}
                    className="hover:bg-accent/10 cursor-pointer"
                  >
                    <TableCell className="font-mono">{cred.username}</TableCell>
                    <TableCell>{cred.domain}</TableCell>
                    <TableCell className="font-mono">
                      {cred.revealed
                        ? cred.password
                        : cred.password.replace(/./g, "•")}
                    </TableCell>
                    <TableCell className="neon-cyan">{cred.source}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          cred.strength === "very weak"
                            ? "neon-red"
                            : cred.strength === "weak"
                            ? "text-orange-400"
                            : "neon-green"
                        }
                      >
                        {cred.strength}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleReveal(cred.id)}
                          title={
                            cred.revealed ? "Hide password" : "Reveal password"
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            copyToClipboard(
                              cred.revealed ? cred.password : cred.password
                            )
                          }
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeCredential(cred.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              <Card className="glass-panel p-3">
                <div className="text-sm">Cracking Progress</div>
                <div className="flex items-center justify-between">
                  <Progress
                    value={crackingProgress}
                    className="h-3 w-full mr-2"
                  />
                  <div className="text-xs neon-cyan">
                    {crackingProgress.toFixed(1)}%
                  </div>
                </div>
              </Card>
              <Card className="glass-panel p-3">
                <div className="text-sm">Total Credentials</div>
                <div className="text-xl neon-cyan">{credentials.length}</div>
              </Card>
              <Card className="glass-panel p-3">
                <div className="text-sm">Cracked</div>
                <div className="text-xl neon-green">
                  {credentials.filter((c) => c.cracked).length}
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Manage live hijacked sessions
            </div>
            <div className="flex gap-2">
              <Button onClick={startSession} className="glow-green">
                {" "}
                <Shield className="w-4 h-4 mr-2" /> Start Session
              </Button>
            </div>
          </div>

          <Card className="glass-panel p-4">
            <ScrollArea className="h-64 p-2">
              {sessions.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  No sessions yet.
                </div>
              )}
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="glass-panel p-3 mb-2 flex items-center justify-between"
                >
                  <div>
                    <div className="font-mono neon-cyan">
                      {s.target} • <span className="text-xs">{s.user}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.protocol} • Last: {s.last_activity || "—"}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs mb-1">
                      {s.status === "terminated"
                        ? "TERMINATED"
                        : s.status.toUpperCase()}
                    </div>
                    <div className="font-mono text-sm">
                      {formatDuration(s.elapsedSeconds)}
                    </div>

                    <div className="flex gap-2 mt-2 justify-end">
                      {s.status === "active" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => pauseSession(s.id)}
                        >
                          Pause
                        </Button>
                      )}
                      {s.status === "paused" && (
                        <Button size="sm" onClick={() => resumeSession(s.id)}>
                          Resume
                        </Button>
                      )}
                      {s.status !== "terminated" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => terminateSession(s.id)}
                        >
                          Terminate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </Card>
        </TabsContent>

        {/* Evidence Tab */}
        <TabsContent value="evidence" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evidence.map((ev) => {
              const Icon = getTypeIcon(ev.type);
              return (
                <Card key={ev.id} className="glass-panel p-4 hover:glow-purple">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-6 h-6 neon-purple" />
                      <div>
                        <div className="font-medium">{ev.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {ev.source} •{" "}
                          {new Date(ev.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge className="text-xs">{ev.type}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2">
                    {ev.description}
                  </p>

                  <div className="flex gap-2 mt-3">
                    <Button
                      onClick={() => setSelectedEvidence(ev)}
                      className="flex-1"
                    >
                      {" "}
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => downloadEvidence(ev)}
                      className="flex-1"
                    >
                      {" "}
                      <Download className="w-4 h-4 mr-2" /> Download
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass-panel p-4">
              <h4 className="font-semibold neon-orange">Protocol Summary</h4>
              <div className="space-y-2 mt-3">
                {traffic.map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 border border-border/20 rounded"
                  >
                    <div>
                      <div className="font-medium">{t.protocol}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.sessions} sessions • {t.packets.toLocaleString()}{" "}
                        packets
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono">
                        {t.bytes.toLocaleString()} B
                      </div>
                      <Badge
                        className={
                          t.suspicious > 10
                            ? "bg-red-500/20 text-red-400"
                            : "bg-green-500/20 text-green-400"
                        }
                      >
                        {t.suspicious} suspicious
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="glass-panel p-4">
              <h4 className="font-semibold neon-magenta">Exfil Timeline</h4>
              <ScrollArea className="h-64 p-2">
                {[
                  {
                    time: "14:32",
                    event: "Database dump initiated",
                    size: "45.2 MB",
                  },
                  {
                    time: "14:28",
                    event: "File archive created",
                    size: "127.3 MB",
                  },
                  {
                    time: "14:25",
                    event: "Screenshot captured",
                    size: "2.4 MB",
                  },
                  {
                    time: "14:21",
                    event: "Credential extraction",
                    size: "156 KB",
                  },
                ].map((it, idx) => (
                  <div
                    key={idx}
                    className="p-2 border-b border-border/20 flex justify-between"
                  >
                    <div>
                      <div className="font-medium">{it.event}</div>
                      <div className="text-xs text-muted-foreground">
                        {it.time}
                      </div>
                    </div>
                    <div className="neon-purple">{it.size}</div>
                  </div>
                ))}
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {selectedEvidence && (
        <EvidenceModal
          ev={selectedEvidence}
          onClose={() => setSelectedEvidence(null)}
        />
      )}
    </div>
  );
}
