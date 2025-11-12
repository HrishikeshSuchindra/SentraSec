import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  FileText, 
  Download, 
  Share, 
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Eye,
  Filter,
  Search,
  Settings,
  Mail,
  FileDown,
  FileSpreadsheet,
  Code,
  Printer,
  Loader2
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { toast } from 'sonner@2.0.3';
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart as RechartsLineChart, Line, Area, AreaChart } from 'recharts';

const executiveReports = [
  {
    id: 1,
    title: "Q1 2024 Security Assessment",
    type: "Executive Summary",
    status: "completed",
    created: "2024-01-15",
    author: "Security Team",
    recipients: ["CEO", "CISO", "CTO"],
    risk_score: 7.8,
    findings: 42,
    critical: 3
  },
  {
    id: 2,
    title: "Web Application Penetration Test",
    type: "Technical Report",
    status: "draft",
    created: "2024-01-14",
    author: "Penetration Tester",
    recipients: ["Dev Team", "Security"],
    risk_score: 8.5,
    findings: 28,
    critical: 5
  },
  {
    id: 3,
    title: "Network Infrastructure Assessment",
    type: "Compliance Report",
    status: "in_review",
    created: "2024-01-13",
    author: "Security Analyst",
    recipients: ["Compliance", "IT"],
    risk_score: 6.2,
    findings: 15,
    critical: 1
  },
  {
    id: 4,
    title: "Social Engineering Campaign Results",
    type: "Awareness Report",
    status: "completed",
    created: "2024-01-12",
    author: "Security Awareness Team",
    recipients: ["HR", "Management"],
    risk_score: 9.1,
    findings: 67,
    critical: 12
  }
];

const vulnerabilityTrends = [
  { month: 'Jan', critical: 3, high: 12, medium: 18, low: 9, total: 42 },
  { month: 'Feb', critical: 2, high: 15, medium: 22, low: 11, total: 50 },
  { month: 'Mar', critical: 5, high: 8, medium: 16, low: 7, total: 36 },
  { month: 'Apr', critical: 1, high: 18, medium: 25, low: 13, total: 57 },
  { month: 'May', critical: 4, high: 10, medium: 19, low: 8, total: 41 },
  { month: 'Jun', critical: 2, high: 14, medium: 21, low: 12, total: 49 }
];

const detailedVulnerabilities = [
  {
    id: "CVE-2024-0001",
    title: "SQL Injection in Authentication Module",
    severity: "Critical",
    cvss: 9.8,
    category: "Injection",
    affected_assets: ["web-app-01", "api-gateway"],
    description: "Time-based SQL injection vulnerability allows unauthorized database access",
    remediation: "Update authentication module to v2.1.4, implement parameterized queries",
    status: "Open",
    discovered: "2024-01-15",
    impact: "High - Complete database compromise possible"
  },
  {
    id: "CVE-2024-0002", 
    title: "Cross-Site Scripting (XSS) in User Profile",
    severity: "High",
    cvss: 7.2,
    category: "XSS",
    affected_assets: ["web-portal"],
    description: "Stored XSS vulnerability in user profile comments field",
    remediation: "Implement proper input validation and output encoding",
    status: "In Progress",
    discovered: "2024-01-14",
    impact: "Medium - Session hijacking and credential theft"
  },
  {
    id: "CVE-2024-0003",
    title: "Insecure Direct Object Reference",
    severity: "High", 
    cvss: 8.1,
    category: "Access Control",
    affected_assets: ["api-v2", "mobile-app"],
    description: "Users can access other users' data by manipulating object references",
    remediation: "Implement proper authorization checks and object-level permissions",
    status: "Open",
    discovered: "2024-01-13",
    impact: "High - Unauthorized data access across user accounts"
  },
  {
    id: "CVE-2024-0004",
    title: "Weak Password Policy Implementation",
    severity: "Medium",
    cvss: 5.4,
    category: "Authentication",
    affected_assets: ["user-management"],
    description: "Password policy allows weak passwords and lacks complexity requirements",
    remediation: "Enforce strong password policy with minimum 12 characters, complexity rules",
    status: "Resolved",
    discovered: "2024-01-12",
    impact: "Medium - Increased risk of brute force attacks"
  },
  {
    id: "CVE-2024-0005",
    title: "Unencrypted Data Transmission",
    severity: "Medium",
    cvss: 6.8,
    category: "Cryptography",
    affected_assets: ["internal-api"],
    description: "Sensitive data transmitted without encryption on internal networks",
    remediation: "Implement TLS 1.3 for all internal communications",
    status: "Open",
    discovered: "2024-01-11",
    impact: "Medium - Data interception risk on internal networks"
  }
];

const technicalMetrics = {
  scanMetrics: {
    totalScans: 156,
    activeScanners: 8,
    coveragePercentage: 94.7,
    avgScanDuration: "2.3 hours",
    falsePositiveRate: "3.2%"
  },
  networkAnalysis: {
    totalHosts: 247,
    activeServices: 1834,
    openPorts: 892,
    suspiciousTraffic: 23,
    bandwidthUtil: "67%"
  },
  exploitAnalysis: {
    availableExploits: 1247,
    successfulExploits: 34,
    blockedAttempts: 189,
    honeypotInteractions: 56
  }
};

const executiveSummaryData = {
  riskPosture: {
    overallScore: 7.8,
    trend: "improving",
    lastAssessment: "2024-01-15",
    riskAppetite: "Medium"
  },
  businessImpact: {
    potentialLoss: "$2.4M",
    criticalAssets: 12,
    businessContinuity: "92%",
    regulatoryCompliance: "87%"
  },
  recommendations: [
    "Immediate patching of critical SQL injection vulnerability (CVE-2024-0001)",
    "Implementation of Web Application Firewall for XSS protection", 
    "Upgrade authentication system with multi-factor authentication",
    "Conduct security awareness training for development team"
  ]
};

const riskDistribution = [
  { name: 'Critical', value: 3, color: '#ef4444' },
  { name: 'High', value: 12, color: '#f97316' },
  { name: 'Medium', value: 18, color: '#eab308' },
  { name: 'Low', value: 9, color: '#22c55e' }
];

const complianceFrameworks = [
  {
    name: "NIST Cybersecurity Framework",
    score: 78,
    status: "partial",
    controls: { total: 108, implemented: 84, pending: 24 }
  },
  {
    name: "ISO 27001",
    score: 85,
    status: "good",
    controls: { total: 114, implemented: 97, pending: 17 }
  },
  {
    name: "PCI DSS",
    score: 92,
    status: "excellent",
    controls: { total: 12, implemented: 11, pending: 1 }
  },
  {
    name: "SOC 2 Type II",
    score: 89,
    status: "good",
    controls: { total: 64, implemented: 57, pending: 7 }
  }
];

const attackSimulationResults = [
  { scenario: 'Phishing Campaign', success_rate: 23, targets: 150, compromised: 35 },
  { scenario: 'USB Drop Attack', success_rate: 67, targets: 30, compromised: 20 },
  { scenario: 'Social Engineering Call', success_rate: 41, targets: 75, compromised: 31 },
  { scenario: 'Malicious Email Attachment', success_rate: 18, targets: 200, compromised: 36 },
  { scenario: 'Physical Tailgating', success_rate: 78, targets: 25, compromised: 19 }
];

const kpiMetrics = [
  { title: "Mean Time to Detection", value: "4.2 hours", change: -15, trend: "down" },
  { title: "Mean Time to Response", value: "2.1 hours", change: -8, trend: "down" },
  { title: "Vulnerability Remediation Rate", value: "87%", change: 12, trend: "up" },
  { title: "Security Awareness Score", value: "73%", change: 6, trend: "up" },
  { title: "Incident Response Readiness", value: "91%", change: 3, trend: "up" },
  { title: "Asset Coverage", value: "96%", change: 2, trend: "up" }
];

export function Reports() {
  const [activeTab, setActiveTab] = useState("executive");
  const [selectedReport, setSelectedReport] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState("last_30_days");
  const [reportType, setReportType] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReportPreview, setShowReportPreview] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "neon-green";
      case "draft": return "text-orange-400";
      case "in_review": return "neon-cyan";
      default: return "text-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "draft": return FileText;
      case "in_review": return Clock;
      default: return FileText;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 8) return "neon-red";
    if (score >= 6) return "text-orange-400";
    if (score >= 4) return "text-yellow-400";
    return "neon-green";
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "neon-green";
      case "good": return "neon-cyan";
      case "partial": return "text-orange-400";
      case "poor": return "neon-red";
      default: return "text-gray-400";
    }
  };

  // Comprehensive PDF generation functions
  const generateComprehensivePDFReport = async (reportData: any) => {
    setIsGenerating(true);
    toast.success('Starting comprehensive PDF generation...');
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let currentPage = 1;
      
      // Helper function to add new page
      const addNewPage = () => {
        pdf.addPage();
        currentPage++;
        addHeader();
        return 50; // Return starting Y position for new page
      };
      
      // Helper function to add header to each page
      const addHeader = () => {
        pdf.setFillColor(10, 10, 15);
        pdf.rect(0, 0, pageWidth, 35, 'F');
        
        pdf.setTextColor(0, 245, 255);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(18);
        pdf.text('AutoPenTest Security Report', 20, 20);
        
        pdf.setTextColor(228, 228, 231);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(`Generated: ${new Date().toLocaleDateString()} | Page ${currentPage}`, 20, 30);
      };
      
      // Helper function to add footer
      const addFooter = (pageNum: number) => {
        pdf.setFillColor(10, 10, 15);
        pdf.rect(0, pageHeight - 25, pageWidth, 25, 'F');
        
        pdf.setTextColor(228, 228, 231);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.text('AutoPenTest Security Platform - Confidential Report', 20, pageHeight - 10);
        pdf.text(`Classification: CONFIDENTIAL`, pageWidth - 60, pageHeight - 10);
      };
      
      // Initial header
      addHeader();
      let yPos = 50;
      
      // ==================== PAGE 1: EXECUTIVE SUMMARY ====================
      pdf.setTextColor(0, 245, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('EXECUTIVE SUMMARY', 20, yPos);
      yPos += 15;
      
      // Risk Overview
      pdf.setTextColor(255, 0, 128);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Risk Overview', 20, yPos);
      yPos += 10;
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const execSummary = [
        `Overall Security Score: ${executiveSummaryData.riskPosture.overallScore}/10 (${executiveSummaryData.riskPosture.trend})`,
        `Risk Appetite: ${executiveSummaryData.riskPosture.riskAppetite}`,
        `Potential Business Impact: ${executiveSummaryData.businessImpact.potentialLoss}`,
        `Critical Assets at Risk: ${executiveSummaryData.businessImpact.criticalAssets}`,
        `Business Continuity Score: ${executiveSummaryData.businessImpact.businessContinuity}`,
        `Regulatory Compliance: ${executiveSummaryData.businessImpact.regulatoryCompliance}`
      ];
      
      execSummary.forEach(line => {
        pdf.text(line, 20, yPos);
        yPos += 7;
      });
      
      // Key Findings
      yPos += 10;
      pdf.setTextColor(255, 0, 128);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Key Findings', 20, yPos);
      yPos += 10;
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const keyFindings = [
        `• ${riskDistribution.find(r => r.name === 'Critical')?.value || 0} Critical vulnerabilities requiring immediate attention`,
        `• ${riskDistribution.find(r => r.name === 'High')?.value || 0} High-risk vulnerabilities affecting core systems`,
        `• SQL Injection vulnerability (CVE-2024-0001) poses significant data breach risk`,
        `• Authentication weaknesses detected across multiple systems`,
        `• Network security gaps identified in internal communications`
      ];
      
      keyFindings.forEach(finding => {
        if (yPos > pageHeight - 50) {
          yPos = addNewPage();
        }
        pdf.text(finding, 20, yPos);
        yPos += 7;
      });
      
      // Executive Recommendations
      yPos += 10;
      if (yPos > pageHeight - 80) {
        yPos = addNewPage();
      }
      
      pdf.setTextColor(255, 0, 128);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Executive Recommendations', 20, yPos);
      yPos += 10;
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      executiveSummaryData.recommendations.forEach((rec, index) => {
        if (yPos > pageHeight - 40) {
          yPos = addNewPage();
        }
        pdf.text(`${index + 1}. ${rec}`, 20, yPos);
        yPos += 8;
      });
      
      addFooter(currentPage);
      
      // ==================== PAGE 2: TECHNICAL ANALYSIS ====================
      yPos = addNewPage();
      
      pdf.setTextColor(0, 245, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('TECHNICAL ANALYSIS', 20, yPos);
      yPos += 15;
      
      // Vulnerability Details
      pdf.setTextColor(16, 185, 129);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Detailed Vulnerability Analysis', 20, yPos);
      yPos += 10;
      
      detailedVulnerabilities.slice(0, 3).forEach((vuln, index) => {
        if (yPos > pageHeight - 80) {
          yPos = addNewPage();
        }
        
        // Vulnerability header
        pdf.setTextColor(239, 68, 68);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(`${vuln.id}: ${vuln.title}`, 20, yPos);
        yPos += 8;
        
        pdf.setTextColor(100, 100, 100);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        
        const vulnDetails = [
          `Severity: ${vuln.severity} (CVSS: ${vuln.cvss})`,
          `Category: ${vuln.category}`,
          `Affected Assets: ${vuln.affected_assets.join(', ')}`,
          `Status: ${vuln.status}`,
          `Description: ${vuln.description}`,
          `Impact: ${vuln.impact}`,
          `Remediation: ${vuln.remediation}`
        ];
        
        vulnDetails.forEach(detail => {
          if (yPos > pageHeight - 40) {
            yPos = addNewPage();
          }
          pdf.text(detail, 25, yPos);
          yPos += 6;
        });
        yPos += 5;
      });
      
      // Technical Metrics
      if (yPos > pageHeight - 100) {
        yPos = addNewPage();
      }
      
      pdf.setTextColor(16, 185, 129);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Technical Metrics', 20, yPos);
      yPos += 10;
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      const techMetrics = [
        `Scan Coverage: ${technicalMetrics.scanMetrics.coveragePercentage}%`,
        `Total Scans Performed: ${technicalMetrics.scanMetrics.totalScans}`,
        `Average Scan Duration: ${technicalMetrics.scanMetrics.avgScanDuration}`,
        `False Positive Rate: ${technicalMetrics.scanMetrics.falsePositiveRate}`,
        `Active Network Hosts: ${technicalMetrics.networkAnalysis.totalHosts}`,
        `Open Services: ${technicalMetrics.networkAnalysis.activeServices}`,
        `Successful Exploits: ${technicalMetrics.exploitAnalysis.successfulExploits}`,
        `Blocked Attack Attempts: ${technicalMetrics.exploitAnalysis.blockedAttempts}`
      ];
      
      techMetrics.forEach(metric => {
        if (yPos > pageHeight - 40) {
          yPos = addNewPage();
        }
        pdf.text(`• ${metric}`, 20, yPos);
        yPos += 7;
      });
      
      addFooter(currentPage);
      
      // ==================== PAGE 3: COMPLIANCE ANALYSIS ====================
      yPos = addNewPage();
      
      pdf.setTextColor(0, 245, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('COMPLIANCE ANALYSIS', 20, yPos);
      yPos += 15;
      
      // Compliance Frameworks
      complianceFrameworks.forEach((framework, index) => {
        if (yPos > pageHeight - 60) {
          yPos = addNewPage();
        }
        
        pdf.setTextColor(139, 92, 246);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text(`${framework.name}`, 20, yPos);
        yPos += 8;
        
        pdf.setTextColor(100, 100, 100);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        
        const complianceDetails = [
          `Compliance Score: ${framework.score}% (${framework.status})`,
          `Total Controls: ${framework.controls.total}`,
          `Implemented: ${framework.controls.implemented}`,
          `Pending Implementation: ${framework.controls.pending}`,
          `Gap Analysis: ${Math.round((framework.controls.pending / framework.controls.total) * 100)}% controls need attention`
        ];
        
        complianceDetails.forEach(detail => {
          pdf.text(`  • ${detail}`, 25, yPos);
          yPos += 6;
        });
        yPos += 8;
      });
      
      addFooter(currentPage);
      
      // ==================== PAGE 4: ANALYTICS & TRENDS ====================
      yPos = addNewPage();
      
      pdf.setTextColor(0, 245, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.text('ANALYTICS & TRENDS', 20, yPos);
      yPos += 15;
      
      // Vulnerability Trends
      pdf.setTextColor(245, 158, 11);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('6-Month Vulnerability Trends', 20, yPos);
      yPos += 10;
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      
      vulnerabilityTrends.forEach(trend => {
        if (yPos > pageHeight - 40) {
          yPos = addNewPage();
        }
        pdf.text(`${trend.month}: Critical(${trend.critical}) High(${trend.high}) Medium(${trend.medium}) Low(${trend.low}) Total(${trend.total})`, 20, yPos);
        yPos += 6;
      });
      
      // KPI Analysis
      yPos += 10;
      pdf.setTextColor(245, 158, 11);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.text('Key Performance Indicators Analysis', 20, yPos);
      yPos += 10;
      
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      
      kpiMetrics.forEach(metric => {
        if (yPos > pageHeight - 40) {
          yPos = addNewPage();
        }
        const trendIndicator = metric.change > 0 ? '↗' : '↘';
        const trendColor = metric.change > 0 && metric.trend === 'up' ? 'IMPROVING' : 'DECLINING';
        pdf.text(`• ${metric.title}: ${metric.value} (${metric.change > 0 ? '+' : ''}${metric.change}% ${trendColor}) ${trendIndicator}`, 20, yPos);
        yPos += 7;
      });
      
      addFooter(currentPage);
      
      // Save the PDF
      const fileName = `comprehensive-security-report-${reportData.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      toast.success('Comprehensive PDF report generated successfully!');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate comprehensive PDF report');
    } finally {
      setIsGenerating(false);
    }
  };

  // Simple PDF generation (legacy function)
  const generatePDFReport = async (reportData: any) => {
    await generateComprehensivePDFReport(reportData);
  };

  const exportToJSON = (data: any) => {
    const exportData = {
      metadata: {
        reportTitle: data.title,
        generatedDate: new Date().toISOString(),
        platform: 'AutoPenTest Security Platform',
        version: '2.1.0',
        classification: 'CONFIDENTIAL'
      },
      executiveSummary: {
        ...executiveSummaryData,
        reportData: data
      },
      technicalAnalysis: {
        vulnerabilities: detailedVulnerabilities,
        metrics: technicalMetrics,
        trends: vulnerabilityTrends
      },
      complianceAnalysis: {
        frameworks: complianceFrameworks,
        overallComplianceScore: Math.round(complianceFrameworks.reduce((acc, f) => acc + f.score, 0) / complianceFrameworks.length)
      },
      analytics: {
        kpiMetrics,
        riskDistribution,
        attackSimulationResults,
        vulnerabilityTrends
      },
      rawData: {
        scanResults: technicalMetrics,
        networkAnalysis: technicalMetrics.networkAnalysis,
        exploitAnalysis: technicalMetrics.exploitAnalysis
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprehensive-security-data-${data.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Comprehensive JSON data exported successfully!');
  };

  const exportToCSV = (data: any) => {
    const csvData = [
      // Header
      ['AutoPenTest Security Report CSV Export'],
      ['Generated:', new Date().toLocaleDateString()],
      ['Report:', data.title],
      [''],
      
      // KPI Metrics
      ['=== KEY PERFORMANCE INDICATORS ==='],
      ['Metric', 'Value', 'Change %', 'Trend', 'Status'],
      ...kpiMetrics.map(metric => [
        metric.title, 
        metric.value, 
        `${metric.change > 0 ? '+' : ''}${metric.change}`, 
        metric.trend,
        metric.change > 0 ? 'IMPROVING' : 'DECLINING'
      ]),
      [''],
      
      // Risk Distribution
      ['=== RISK DISTRIBUTION ==='],
      ['Risk Level', 'Count', 'Percentage'],
      ...riskDistribution.map(risk => [
        risk.name, 
        risk.value.toString(), 
        `${Math.round((risk.value / riskDistribution.reduce((acc, r) => acc + r.value, 0)) * 100)}%`
      ]),
      [''],
      
      // Vulnerability Trends
      ['=== VULNERABILITY TRENDS (6 MONTHS) ==='],
      ['Month', 'Critical', 'High', 'Medium', 'Low', 'Total'],
      ...vulnerabilityTrends.map(trend => [
        trend.month, 
        trend.critical, 
        trend.high, 
        trend.medium, 
        trend.low, 
        trend.total
      ]),
      [''],
      
      // Detailed Vulnerabilities
      ['=== DETAILED VULNERABILITIES ==='],
      ['CVE ID', 'Title', 'Severity', 'CVSS Score', 'Category', 'Status', 'Affected Assets'],
      ...detailedVulnerabilities.map(vuln => [
        vuln.id,
        vuln.title,
        vuln.severity,
        vuln.cvss.toString(),
        vuln.category,
        vuln.status,
        vuln.affected_assets.join('; ')
      ]),
      [''],
      
      // Compliance Scores
      ['=== COMPLIANCE FRAMEWORKS ==='],
      ['Framework', 'Score %', 'Status', 'Total Controls', 'Implemented', 'Pending'],
      ...complianceFrameworks.map(framework => [
        framework.name,
        framework.score.toString(),
        framework.status,
        framework.controls.total.toString(),
        framework.controls.implemented.toString(),
        framework.controls.pending.toString()
      ])
    ];
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprehensive-security-analysis-${data.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Comprehensive CSV analysis exported successfully!');
  };

  const exportToHTML = (data: any) => {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AutoPenTest Comprehensive Security Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%); 
            color: #e4e4e7; 
            line-height: 1.6;
          }
          .header { 
            background: linear-gradient(45deg, #00f5ff, #ff0080, #8b5cf6); 
            background-size: 400% 400%;
            animation: gradient 8s ease infinite;
            padding: 30px; 
            text-align: center; 
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          }
          @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
          .section { 
            background: rgba(15, 23, 42, 0.8); 
            border: 1px solid rgba(139, 92, 246, 0.2); 
            margin: 30px 0; 
            padding: 30px; 
            border-radius: 12px; 
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          }
          .section h2 { 
            color: #00f5ff; 
            margin-bottom: 20px; 
            font-size: 28px;
            text-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
          }
          .section h3 { 
            color: #ff0080; 
            margin-bottom: 15px; 
            font-size: 20px;
          }
          .metric-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
            gap: 20px; 
            margin: 20px 0; 
          }
          .metric-card { 
            background: rgba(30, 41, 59, 0.8); 
            border: 1px solid rgba(139, 92, 246, 0.3); 
            padding: 20px; 
            border-radius: 10px; 
            text-align: center;
            transition: transform 0.3s ease;
          }
          .metric-card:hover { transform: translateY(-5px); }
          .metric-value { 
            font-size: 32px; 
            font-weight: bold; 
            color: #00f5ff; 
            text-shadow: 0 0 10px rgba(0, 245, 255, 0.5);
          }
          .vulnerability-card {
            background: rgba(30, 41, 59, 0.6);
            border-left: 4px solid #ef4444;
            padding: 15px;
            margin: 10px 0;
            border-radius: 8px;
          }
          .severity-critical { border-left-color: #ef4444; }
          .severity-high { border-left-color: #f97316; }
          .severity-medium { border-left-color: #eab308; }
          .severity-low { border-left-color: #22c55e; }
          .compliance-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
          }
          .compliance-card {
            background: rgba(30, 41, 59, 0.6);
            padding: 20px;
            border-radius: 10px;
            border: 1px solid rgba(139, 92, 246, 0.2);
          }
          .progress-bar {
            background: rgba(30, 41, 59, 0.8);
            height: 10px;
            border-radius: 5px;
            overflow: hidden;
            margin: 10px 0;
          }
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #00f5ff);
            transition: width 2s ease;
          }
          .risk-item { 
            padding: 15px; 
            margin: 10px 0; 
            background: rgba(30, 41, 59, 0.6); 
            border-radius: 8px; 
            border-left: 4px solid;
          }
          .risk-critical { border-left-color: #ef4444; }
          .risk-high { border-left-color: #f97316; }
          .risk-medium { border-left-color: #eab308; }
          .risk-low { border-left-color: #22c55e; }
          .trend-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .trend-table th, .trend-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid rgba(139, 92, 246, 0.2);
          }
          .trend-table th {
            background: rgba(139, 92, 246, 0.2);
            color: #8b5cf6;
          }
          .footer { 
            text-align: center; 
            margin-top: 50px; 
            padding: 30px;
            background: rgba(15, 23, 42, 0.8);
            border-radius: 12px;
            font-size: 14px; 
            color: #94a3b8; 
          }
          .classification {
            background: #ef4444;
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: bold;
            display: inline-block;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>AutoPenTest Comprehensive Security Report</h1>
          <p>Generated: ${new Date().toLocaleDateString()} | Report: ${data.title}</p>
          <div class="classification">CONFIDENTIAL</div>
        </div>
        
        <div class="container">
          <!-- Executive Summary Section -->
          <div class="section">
            <h2>Executive Summary</h2>
            <div class="metric-grid">
              <div class="metric-card">
                <div class="metric-value">${executiveSummaryData.riskPosture.overallScore}/10</div>
                <div>Overall Security Score</div>
                <div style="color: #00f5ff">${executiveSummaryData.riskPosture.trend.toUpperCase()}</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${executiveSummaryData.businessImpact.potentialLoss}</div>
                <div>Potential Business Impact</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${executiveSummaryData.businessImpact.criticalAssets}</div>
                <div>Critical Assets at Risk</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${executiveSummaryData.businessImpact.regulatoryCompliance}</div>
                <div>Regulatory Compliance</div>
              </div>
            </div>
            
            <h3>Key Recommendations</h3>
            ${executiveSummaryData.recommendations.map((rec, i) => `
              <div class="risk-item risk-critical">
                <strong>${i + 1}.</strong> ${rec}
              </div>
            `).join('')}
          </div>

          <!-- Technical Analysis Section -->
          <div class="section">
            <h2>Technical Analysis</h2>
            
            <h3>Critical Vulnerabilities</h3>
            ${detailedVulnerabilities.slice(0, 3).map(vuln => `
              <div class="vulnerability-card severity-${vuln.severity.toLowerCase()}">
                <h4 style="color: #ef4444; margin-bottom: 10px;">${vuln.id}: ${vuln.title}</h4>
                <p><strong>Severity:</strong> ${vuln.severity} (CVSS: ${vuln.cvss})</p>
                <p><strong>Category:</strong> ${vuln.category}</p>
                <p><strong>Affected Assets:</strong> ${vuln.affected_assets.join(', ')}</p>
                <p><strong>Description:</strong> ${vuln.description}</p>
                <p><strong>Impact:</strong> ${vuln.impact}</p>
                <p><strong>Remediation:</strong> ${vuln.remediation}</p>
                <p><strong>Status:</strong> <span style="color: ${vuln.status === 'Open' ? '#ef4444' : vuln.status === 'In Progress' ? '#f97316' : '#22c55e'}">${vuln.status}</span></p>
              </div>
            `).join('')}
            
            <h3>Technical Metrics</h3>
            <div class="metric-grid">
              <div class="metric-card">
                <div class="metric-value">${technicalMetrics.scanMetrics.coveragePercentage}%</div>
                <div>Scan Coverage</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${technicalMetrics.scanMetrics.totalScans}</div>
                <div>Total Scans</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${technicalMetrics.networkAnalysis.totalHosts}</div>
                <div>Network Hosts</div>
              </div>
              <div class="metric-card">
                <div class="metric-value">${technicalMetrics.exploitAnalysis.successfulExploits}</div>
                <div>Successful Exploits</div>
              </div>
            </div>
          </div>

          <!-- Compliance Analysis Section -->
          <div class="section">
            <h2>Compliance Analysis</h2>
            <div class="compliance-grid">
              ${complianceFrameworks.map(framework => `
                <div class="compliance-card">
                  <h4 style="color: #8b5cf6; margin-bottom: 15px;">${framework.name}</h4>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: ${framework.score}%"></div>
                  </div>
                  <p><strong>Score:</strong> ${framework.score}% (${framework.status})</p>
                  <p><strong>Controls:</strong> ${framework.controls.implemented}/${framework.controls.total} implemented</p>
                  <p><strong>Pending:</strong> ${framework.controls.pending} controls need attention</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Analytics & Trends Section -->
          <div class="section">
            <h2>Analytics & Trends</h2>
            
            <h3>Key Performance Indicators</h3>
            <div class="metric-grid">
              ${kpiMetrics.map(metric => `
                <div class="metric-card">
                  <div class="metric-value">${metric.value}</div>
                  <div>${metric.title}</div>
                  <div style="color: ${metric.change > 0 ? '#22c55e' : '#f97316'}">
                    ${metric.change > 0 ? '+' : ''}${metric.change}% ${metric.trend === 'up' ? '↗' : '↘'}
                  </div>
                </div>
              `).join('')}
            </div>
            
            <h3>Risk Distribution</h3>
            ${riskDistribution.map(risk => `
              <div class="risk-item risk-${risk.name.toLowerCase()}">
                <strong>${risk.name}:</strong> ${risk.value} vulnerabilities 
                (${Math.round((risk.value / riskDistribution.reduce((acc, r) => acc + r.value, 0)) * 100)}%)
              </div>
            `).join('')}
            
            <h3>6-Month Vulnerability Trends</h3>
            <table class="trend-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Critical</th>
                  <th>High</th>
                  <th>Medium</th>
                  <th>Low</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${vulnerabilityTrends.map(trend => `
                  <tr>
                    <td>${trend.month}</td>
                    <td style="color: #ef4444">${trend.critical}</td>
                    <td style="color: #f97316">${trend.high}</td>
                    <td style="color: #eab308">${trend.medium}</td>
                    <td style="color: #22c55e">${trend.low}</td>
                    <td style="color: #00f5ff; font-weight: bold">${trend.total}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="footer">
          <div class="classification">CONFIDENTIAL REPORT</div>
          <p><strong>AutoPenTest Security Platform</strong></p>
          <p>This report contains confidential and proprietary information. Distribution is restricted.</p>
          <p>Generated on ${new Date().toLocaleString()} | Version 2.1.0</p>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprehensive-security-report-${data.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Comprehensive HTML report exported successfully!');
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
          <h1 className="holographic text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Executive dashboards, technical reports, and compliance tracking</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="glass-panel border-border/50 hover:glow-cyan">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="glass-panel glow-purple hover:glow-purple neon-purple" disabled={isGenerating}>
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="w-4 h-4 mr-2" />
                )}
                {isGenerating ? 'Generating...' : 'Generate Report'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-panel w-56">
              <DropdownMenuLabel>Export Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => generateComprehensivePDFReport(executiveReports[0])}>
                <FileDown className="w-4 h-4 mr-2 neon-red" />
                Comprehensive PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToHTML(executiveReports[0])}>
                <Code className="w-4 h-4 mr-2 neon-cyan" />
                Interactive HTML
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToJSON(executiveReports[0])}>
                <Settings className="w-4 h-4 mr-2 neon-purple" />
                Complete JSON Dataset
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportToCSV(executiveReports[0])}>
                <FileSpreadsheet className="w-4 h-4 mr-2 neon-green" />
                Detailed CSV Analysis
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => {
                const executivePDF = async () => {
                  toast.success('Generating executive summary...');
                  // Generate a simplified executive-only PDF
                  await generateComprehensivePDFReport({...executiveReports[0], template: 'executive'});
                };
                executivePDF();
              }}>
                <Users className="w-4 h-4 mr-2 neon-magenta" />
                Executive Summary Only
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiMetrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="glass-panel p-4 hover:glow-cyan transition-all duration-300">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className={`text-lg font-bold ${metric.trend === 'up' ? 'neon-green' : 'neon-cyan'}`}>
                    {metric.value}
                  </div>
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 neon-green" />
                  ) : (
                    <TrendingDown className="w-4 h-4 neon-cyan" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{metric.title}</div>
                <div className={`text-xs ${metric.change > 0 ? 'neon-green' : 'text-orange-400'}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}% vs last period
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass-panel grid w-full grid-cols-4">
            <TabsTrigger value="executive" className="data-[state=active]:glow-cyan">
              <Users className="w-4 h-4 mr-2" />
              Executive
            </TabsTrigger>
            <TabsTrigger value="technical" className="data-[state=active]:glow-green">
              <BarChart3 className="w-4 h-4 mr-2" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="compliance" className="data-[state=active]:glow-purple">
              <Shield className="w-4 h-4 mr-2" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:glow-orange">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Executive Reports Tab */}
          <TabsContent value="executive" className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reports..."
                  className="pl-10 glass-panel border-border/50"
                />
              </div>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-48 glass-panel border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel">
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="executive">Executive Summary</SelectItem>
                  <SelectItem value="technical">Technical Report</SelectItem>
                  <SelectItem value="compliance">Compliance Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {executiveReports.map((report, index) => {
                const StatusIcon = getStatusIcon(report.status);
                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Card className="glass-panel p-6 hover:glow-cyan transition-all duration-300">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{report.title}</h3>
                            <p className="text-sm text-muted-foreground">{report.type}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <StatusIcon className={`w-4 h-4 ${getStatusColor(report.status)}`} />
                            <Badge className={getStatusColor(report.status)}>
                              {report.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Risk Score:</span>
                            <span className={`font-bold ${getRiskColor(report.risk_score)}`}>
                              {report.risk_score}/10
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Findings:</span>
                            <span className="neon-cyan">{report.findings}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Critical Issues:</span>
                            <span className="neon-red">{report.critical}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Created:</span>
                            <span className="text-muted-foreground">{report.created}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium">Recipients:</div>
                          <div className="flex flex-wrap gap-1">
                            {report.recipients.map((recipient, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {recipient}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2 border-t border-border/30">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 hover:glow-cyan"
                            onClick={() => setShowReportPreview(true)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 hover:glow-green">
                                <Download className="w-4 h-4 mr-1" />
                                Export
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="glass-panel">
                              <DropdownMenuItem onClick={() => generatePDFReport(report)}>
                                <FileDown className="w-4 h-4 mr-2 neon-red" />
                                PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => exportToHTML(report)}>
                                <Code className="w-4 h-4 mr-2 neon-cyan" />
                                HTML
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => exportToJSON(report)}>
                                <Settings className="w-4 h-4 mr-2 neon-purple" />
                                JSON
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => exportToCSV(report)}>
                                <FileSpreadsheet className="w-4 h-4 mr-2 neon-green" />
                                CSV
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 hover:glow-purple">
                                <Share className="w-4 h-4 mr-1" />
                                Share
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="glass-panel">
                              <DropdownMenuItem onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                toast.success('Report link copied to clipboard');
                              }}>
                                <Share className="w-4 h-4 mr-2 neon-cyan" />
                                Copy Link
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => {
                                const subject = encodeURIComponent(`[CONFIDENTIAL] Security Assessment Report: ${report.title}`);
                                const body = encodeURIComponent(`Dear Team,

Please find the comprehensive security assessment report for your review:

═══════════════════════════════════════
📊 EXECUTIVE SUMMARY
═══════════════════════════════════════
• Report: ${report.title}
• Overall Risk Score: ${report.risk_score}/10
• Total Findings: ${report.findings}
• Critical Issues Requiring Immediate Attention: ${report.critical}
• Assessment Date: ${report.created}

═══════════════════════════════════════
🎯 KEY FINDINGS
═══════════════════════════════════════
• ${riskDistribution.find(r => r.name === 'Critical')?.value || 0} Critical vulnerabilities
• ${riskDistribution.find(r => r.name === 'High')?.value || 0} High-priority security issues
• Business Impact Assessment: ${executiveSummaryData.businessImpact.potentialLoss}
• Regulatory Compliance Score: ${executiveSummaryData.businessImpact.regulatoryCompliance}

═══════════════════════════════════════
🔥 IMMEDIATE ACTIONS REQUIRED
═══════════════════════════════════════
${executiveSummaryData.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

═══════════════════════════════════════
📋 TECHNICAL METRICS
═══════════════════════════════════════
• Scan Coverage: ${technicalMetrics.scanMetrics.coveragePercentage}%
• Network Assets Analyzed: ${technicalMetrics.networkAnalysis.totalHosts}
• Active Services Discovered: ${technicalMetrics.networkAnalysis.activeServices}
• Security Incidents Blocked: ${technicalMetrics.exploitAnalysis.blockedAttempts}

This report contains confidential information and should be handled according to your organization's data classification policies.

For questions or clarification, please contact the security team.

Best regards,
AutoPenTest Security Platform
Generated: ${new Date().toLocaleDateString()}`);
                                window.open(`mailto:?subject=${subject}&body=${body}`);
                              }}>
                                <Mail className="w-4 h-4 mr-2 neon-orange" />
                                Email Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          {/* Technical Analytics Tab */}
          <TabsContent value="technical" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Vulnerability Trends */}
              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4 neon-green">Vulnerability Trends</h3>
                <ChartContainer config={{
                  critical: { label: "Critical", color: "#ef4444" },
                  high: { label: "High", color: "#f97316" },
                  medium: { label: "Medium", color: "#eab308" },
                  low: { label: "Low", color: "#22c55e" }
                }} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={vulnerabilityTrends}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="high" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="medium" stackId="1" stroke="#eab308" fill="#eab308" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="low" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </Card>

              {/* Risk Distribution */}
              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4 neon-purple">Current Risk Distribution</h3>
                <ChartContainer config={{
                  critical: { label: "Critical", color: "#ef4444" },
                  high: { label: "High", color: "#f97316" },
                  medium: { label: "Medium", color: "#eab308" },
                  low: { label: "Low", color: "#22c55e" }
                }} className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <pie
                        data={riskDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </Card>
            </div>

            {/* Attack Simulation Results */}
            <Card className="glass-panel p-6">
              <h3 className="font-semibold mb-4 neon-orange">Attack Simulation Results</h3>
              <div className="space-y-4">
                {attackSimulationResults.map((result, index) => (
                  <motion.div
                    key={result.scenario}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="glass-panel p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{result.scenario}</h4>
                      <Badge className={result.success_rate > 50 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}>
                        {result.success_rate}% success rate
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Success Rate</span>
                        <span className={result.success_rate > 50 ? "neon-red" : "neon-green"}>
                          {result.success_rate}%
                        </span>
                      </div>
                      <Progress value={result.success_rate} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Targets: {result.targets}</span>
                        <span>Compromised: {result.compromised}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {complianceFrameworks.map((framework, index) => (
                <motion.div
                  key={framework.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Card className="glass-panel p-6 hover:glow-purple transition-all duration-300">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{framework.name}</h3>
                        <Badge className={getComplianceStatusColor(framework.status)}>
                          {framework.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Compliance Score</span>
                          <span className={`font-bold ${framework.score > 80 ? 'neon-green' : framework.score > 60 ? 'text-orange-400' : 'neon-red'}`}>
                            {framework.score}%
                          </span>
                        </div>
                        <Progress value={framework.score} className="h-3" />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-bold neon-cyan">{framework.controls.total}</div>
                          <div className="text-muted-foreground text-xs">Total Controls</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold neon-green">{framework.controls.implemented}</div>
                          <div className="text-muted-foreground text-xs">Implemented</div>
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-orange-400">{framework.controls.pending}</div>
                          <div className="text-muted-foreground text-xs">Pending</div>
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full glow-purple hover:glow-purple">
                        <Shield className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Compliance Actions */}
            <Card className="glass-panel p-6">
              <h3 className="font-semibold mb-4 neon-cyan">Required Actions</h3>
              <div className="space-y-3">
                {[
                  { action: "Update incident response procedures", framework: "NIST CSF", priority: "high", due: "2024-01-20" },
                  { action: "Implement additional access controls", framework: "ISO 27001", priority: "medium", due: "2024-01-25" },
                  { action: "Conduct security awareness training", framework: "SOC 2", priority: "high", due: "2024-01-18" },
                  { action: "Review data encryption policies", framework: "PCI DSS", priority: "low", due: "2024-02-01" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded border border-border/30"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{item.action}</div>
                      <div className="flex items-center space-x-2 text-xs">
                        <Badge variant="outline">{item.framework}</Badge>
                        <Badge className={
                          item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                          item.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-green-500/20 text-green-400'
                        }>
                          {item.priority}
                        </Badge>
                        <span className="text-muted-foreground">Due: {item.due}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4 neon-orange">Security Posture</h3>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold neon-cyan">8.2</div>
                    <div className="text-sm text-muted-foreground">Overall Security Score</div>
                  </div>
                  <Progress value={82} className="h-3" />
                  <div className="text-xs text-center text-muted-foreground">
                    Above industry average (7.1)
                  </div>
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4 neon-green">Threat Intelligence</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Active Threats:</span>
                    <span className="neon-red">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Blocked Attempts:</span>
                    <span className="neon-green">1,247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">IOC Matches:</span>
                    <span className="text-orange-400">67</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">False Positives:</span>
                    <span className="neon-cyan">12</span>
                  </div>
                </div>
              </Card>

              <Card className="glass-panel p-6">
                <h3 className="font-semibold mb-4 neon-purple">Team Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Response Time:</span>
                    <span className="neon-green">2.1h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Incidents Resolved:</span>
                    <span className="neon-cyan">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">SLA Compliance:</span>
                    <span className="neon-green">94%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Team Efficiency:</span>
                    <span className="text-orange-400">87%</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Scheduled Reports */}
            <Card className="glass-panel p-6">
              <h3 className="font-semibold mb-4 neon-magenta">Scheduled Reports</h3>
              <div className="space-y-3">
                {[
                  { name: "Weekly Security Summary", frequency: "Weekly", next: "2024-01-22", recipients: 5 },
                  { name: "Monthly Executive Dashboard", frequency: "Monthly", next: "2024-02-01", recipients: 3 },
                  { name: "Quarterly Risk Assessment", frequency: "Quarterly", next: "2024-04-01", recipients: 8 },
                  { name: "Compliance Status Report", frequency: "Monthly", next: "2024-01-30", recipients: 4 }
                ].map((report, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded border border-border/30"
                  >
                    <div className="space-y-1">
                      <div className="font-medium">{report.name}</div>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>{report.frequency}</span>
                        <span>•</span>
                        <span>Next: {report.next}</span>
                        <span>•</span>
                        <span>{report.recipients} recipients</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Enhanced Real-time Report Preview Modal */}
      {showReportPreview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowReportPreview(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-panel p-8 max-w-4xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Preview Header */}
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <div>
                  <h2 className="holographic text-2xl font-bold">Live Report Preview</h2>
                  <p className="text-muted-foreground">Interactive security assessment overview</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => generatePDFReport(executiveReports[0])}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Export PDF
                  </Button>
                  <Button variant="ghost" onClick={() => setShowReportPreview(false)}>
                    ✕
                  </Button>
                </div>
              </div>

              {/* Live Preview Content - Comprehensive Tabs */}
              <Tabs defaultValue="executive" className="w-full">
                <TabsList className="glass-panel grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="executive" className="data-[state=active]:glow-cyan">Executive</TabsTrigger>
                  <TabsTrigger value="technical" className="data-[state=active]:glow-green">Technical</TabsTrigger>
                  <TabsTrigger value="compliance" className="data-[state=active]:glow-purple">Compliance</TabsTrigger>
                  <TabsTrigger value="analytics" className="data-[state=active]:glow-orange">Analytics</TabsTrigger>
                </TabsList>

                {/* Executive Summary Tab */}
                <TabsContent value="executive" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="glass-panel p-6">
                      <h3 className="font-bold neon-cyan mb-4">Executive Overview</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Overall Security Score:</span>
                          <span className="neon-cyan font-bold">{executiveSummaryData.riskPosture.overallScore}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Risk Trend:</span>
                          <span className="neon-green">{executiveSummaryData.riskPosture.trend.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Potential Business Loss:</span>
                          <span className="neon-red font-bold">{executiveSummaryData.businessImpact.potentialLoss}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Critical Assets at Risk:</span>
                          <span className="neon-orange">{executiveSummaryData.businessImpact.criticalAssets}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Business Continuity:</span>
                          <span className="neon-green">{executiveSummaryData.businessImpact.businessContinuity}</span>
                        </div>
                      </div>
                    </Card>

                    <Card className="glass-panel p-6">
                      <h3 className="font-bold neon-purple mb-4">Key Recommendations</h3>
                      <div className="space-y-2 text-sm">
                        {executiveSummaryData.recommendations.slice(0, 4).map((rec, index) => (
                          <div key={index} className="p-2 bg-muted/20 rounded border-l-2 border-red-500">
                            <span className="font-medium">#{index + 1}</span> {rec}
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Technical Analysis Tab */}
                <TabsContent value="technical" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="glass-panel p-6">
                      <h3 className="font-bold neon-green mb-4">Critical Vulnerabilities</h3>
                      <div className="space-y-3">
                        {detailedVulnerabilities.slice(0, 3).map((vuln, index) => (
                          <div key={index} className="p-3 bg-muted/20 rounded border-l-2 border-red-500">
                            <div className="font-medium neon-red text-sm">{vuln.id}</div>
                            <div className="text-xs text-muted-foreground">{vuln.title}</div>
                            <div className="flex justify-between mt-2 text-xs">
                              <span>CVSS: <span className="neon-orange">{vuln.cvss}</span></span>
                              <span className={`${vuln.status === 'Open' ? 'neon-red' : vuln.status === 'In Progress' ? 'text-orange-400' : 'neon-green'}`}>
                                {vuln.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="glass-panel p-6">
                      <h3 className="font-bold neon-cyan mb-4">Technical Metrics</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Scan Coverage:</span>
                          <span className="neon-green">{technicalMetrics.scanMetrics.coveragePercentage}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Scans:</span>
                          <span className="neon-cyan">{technicalMetrics.scanMetrics.totalScans}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Network Hosts:</span>
                          <span className="neon-purple">{technicalMetrics.networkAnalysis.totalHosts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Services:</span>
                          <span className="text-orange-400">{technicalMetrics.networkAnalysis.activeServices}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Successful Exploits:</span>
                          <span className="neon-red">{technicalMetrics.exploitAnalysis.successfulExploits}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Blocked Attempts:</span>
                          <span className="neon-green">{technicalMetrics.exploitAnalysis.blockedAttempts}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabsContent>

                {/* Compliance Tab */}
                <TabsContent value="compliance" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {complianceFrameworks.map((framework, index) => (
                      <Card key={index} className="glass-panel p-6">
                        <h3 className="font-bold neon-purple mb-4">{framework.name}</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Compliance Score:</span>
                            <span className={getComplianceStatusColor(framework.status)}>
                              {framework.score}%
                            </span>
                          </div>
                          <Progress value={framework.score} className="h-2" />
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="neon-cyan font-bold">{framework.controls.total}</div>
                              <div className="text-muted-foreground">Total</div>
                            </div>
                            <div className="text-center">
                              <div className="neon-green font-bold">{framework.controls.implemented}</div>
                              <div className="text-muted-foreground">Implemented</div>
                            </div>
                            <div className="text-center">
                              <div className="text-orange-400 font-bold">{framework.controls.pending}</div>
                              <div className="text-muted-foreground">Pending</div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Analytics Tab */}
                <TabsContent value="analytics" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="glass-panel p-6">
                      <h3 className="font-bold neon-orange mb-4">Performance Indicators</h3>
                      <div className="space-y-3">
                        {kpiMetrics.slice(0, 6).map((metric, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{metric.title}:</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium neon-cyan">{metric.value}</span>
                              <span className={`text-xs ${metric.change > 0 ? 'neon-green' : 'text-orange-400'}`}>
                                {metric.change > 0 ? '+' : ''}{metric.change}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="glass-panel p-6">
                      <h3 className="font-bold neon-green mb-4">Risk Distribution</h3>
                      <div className="space-y-3">
                        {riskDistribution.map((risk, index) => (
                          <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>{risk.name}:</span>
                              <span className="font-medium" style={{ color: risk.color }}>{risk.value}</span>
                            </div>
                            <div className="w-full bg-muted/20 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-1000" 
                                style={{ 
                                  width: `${(risk.value / Math.max(...riskDistribution.map(r => r.value))) * 100}%`,
                                  backgroundColor: risk.color 
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="glass-panel p-6 lg:col-span-2">
                      <h3 className="font-bold neon-purple mb-4">6-Month Vulnerability Trends</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border/50">
                              <th className="text-left py-2">Month</th>
                              <th className="text-center py-2 neon-red">Critical</th>
                              <th className="text-center py-2 text-orange-400">High</th>
                              <th className="text-center py-2 text-yellow-400">Medium</th>
                              <th className="text-center py-2 neon-green">Low</th>
                              <th className="text-center py-2 neon-cyan">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {vulnerabilityTrends.map((trend, index) => (
                              <tr key={index} className="border-b border-border/30">
                                <td className="py-2">{trend.month}</td>
                                <td className="text-center py-2 neon-red">{trend.critical}</td>
                                <td className="text-center py-2 text-orange-400">{trend.high}</td>
                                <td className="text-center py-2 text-yellow-400">{trend.medium}</td>
                                <td className="text-center py-2 neon-green">{trend.low}</td>
                                <td className="text-center py-2 neon-cyan font-bold">{trend.total}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Advanced Export Options */}
              <div className="border-t border-border/50 pt-4">
                <h4 className="font-semibold mb-3 neon-magenta">Advanced Export Options</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button
                    variant="outline"
                    className="hover:glow-red"
                    onClick={() => generateComprehensivePDFReport(executiveReports[0])}
                  >
                    <FileDown className="w-4 h-4 mr-2 neon-red" />
                    Comprehensive PDF
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:glow-cyan"
                    onClick={() => exportToHTML(executiveReports[0])}
                  >
                    <Code className="w-4 h-4 mr-2 neon-cyan" />
                    Interactive HTML
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:glow-green"
                    onClick={() => exportToCSV(executiveReports[0])}
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2 neon-green" />
                    Detailed CSV
                  </Button>
                  <Button
                    variant="outline"
                    className="hover:glow-purple"
                    onClick={() => exportToJSON(executiveReports[0])}
                  >
                    <Settings className="w-4 h-4 mr-2 neon-purple" />
                    Complete Dataset
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}