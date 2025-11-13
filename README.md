SentraSec

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-active-success)
![Python](https://img.shields.io/badge/python-3.10%2B-yellow)
![Nmap](https://img.shields.io/badge/dependency-Nmap-orange)
![License](https://img.shields.io/badge/license-Research%20%26%20Education-lightgrey)

## Overview

A powerful, modular, and fully automated penetration testing framework engineered to streamline the entire security assessment lifecycle. This tool reduces manual effort by orchestrating reconnaissance, scanning, vulnerability detection, and report generation into a seamless automated pipeline.

Designed for cybersecurity professionals, penetration testers, ethical hackers, and security researchers, the framework ensures consistency, speed, and technical depth during engagements.
This project is a fully automated penetration testing framework designed to streamline reconnaissance, scanning, vulnerability detection, and reporting. The tool eliminates repetitive manual work by orchestrating a sequence of automated modules, each responsible for a critical phase of the penetration testing lifecycle.

The system is built as a modular automation pipeline integrating Python scripts, Nmap engines, vulnerability parsing logic, and configurable scan workflows. It is designed for security researchers, penetration testers, and cybersecurity teams who want to accelerate assessments while maintaining accuracy and consistency.

---

## Key Features

### **1. Automated Reconnaissance**

* Gathers target information (IP, technologies, metadata).
* Performs DNS enumeration, port discovery, and protocol fingerprinting.

### **2. Intelligent Nmap Scanning**

* Supports fast, aggressive, or full-port scans.
* Converts raw Nmap XML output into human‑readable, structured reports.
* Includes custom Nmap parsing scripts using Python.

### **3. Vulnerability Detection Engine**

* Automatically extracts CVEs, service weaknesses, and outdated software.
* Matches findings using internal signatures and Nmap script results.

### **4. Automated Report Generation**

* Creates clean, detailed vulnerability reports.
* Shows open ports, service versions, and severity ratings.
* Supports console, JSON, and structured formatted output.

### **5. Modular Architecture**

* Easy to extend with additional scanners.
* Every component is isolated for maintainability.

### **6. CLI-Based Workflow**

* Single command to execute the entire assessment.
* Designed for repeatable, deterministic scans.

---

## System Architecture

A high-level representation of the automated assessment pipeline:

```
User Input (Target IP)
        ↓
Recon Module (DNS, Ping, Basic Info)
        ↓
Nmap Scan Engine (XML Output)
        ↓
XML Parser → Vulnerability Extractor
        ↓
Report Generator
        ↓
Final Penetration Testing Report
```

---

## Installation

Follow the setup guidelines below to prepare the system for automated penetration testing:

### **Prerequisites**

* Python 3.10+
* Nmap installed on the system
* Required Python libraries:

```bash
pip install -r requirements.txt
```

---

## Usage

Run automated assessments using the primary orchestrator script:
Run the main automation script:

```bash
python autopentest.py
```

When prompted, enter the target IP address.

The tool will automatically:

1. Perform reconnaissance
2. Run Nmap scans
3. Parse XML results
4. Detect vulnerabilities
5. Generate the final report

---

## Project Structure

The repository follows a modular design pattern for clarity and extensibility:

```
/AutoPentest
│
├── autopentest.py              # Main automation script
├── recon.py                    # Reconnaissance module
├── scanner.py                  # Nmap scanning module
├── parser.py                   # XML → structured data
├── report.py                   # Report generation engine
├── utils/                      # Helper functions
└── outputs/                    # Auto-generated reports
```

---

## Sample Output

* List of open ports
* Service versions
* Vulnerability summary
* CVE references
* Final security assessment conclusion

---

## Limitations

Consider the following constraints when operating the automated framework:

* Accuracy depends on Nmap detection quality.
* Not a substitute for manual exploitation.
* Requires stable network connectivity.

---

## Roadmap

Planned future developments to enhance capabilities and scalability:

* Add web application scanning (Nikto, Dirsearch).
* Integrate CVE live feed API.
* Add reporting templates (PDF/HTML).
* Dashboard UI for scan management.

---

## License

This project is for cybersecurity research and educational purposes only.
Unauthorized use on systems you do not own is illegal.
