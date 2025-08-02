#!/usr/bin/env python3
"""
Script to create resume files in DOCX and PDF formats
"""

def create_text_resume():
    """Create a text version of the resume for PDF conversion"""
    resume_content = """Miguel A. Gonzalez Almonte

Plano, TX · 787-367-9843 · mgonzalez869@gmail.com
LinkedIn · Portfolio · GitHub

AI Systems Builder | GPT-Powered Workflow Architect | Operational Intelligence Technologist

Bridging field-tested operational insight with code-based systems design. I build logic-driven tools that improve coordination, decision flow, and end-user clarity.

PROFESSIONAL SUMMARY

AI systems builder with deep roots in operations leadership and a self-driven path into software design, automation, and GPT agent architecture. I've built and deployed intelligent tools that replaced spreadsheets, reduced operational delays, and brought logic-based coordination into live operational environments. My systems are not experiments — they are active solutions used in production to enforce lifecycle integrity, audit state transitions, and support non-technical users.

Though I've never held a formal software title, I've architected AI assistants, Python dashboards, and decision frameworks that reflect enterprise-grade thinking and field-tested pragmatism. My work lives at the intersection of operational intelligence and systems clarity — where good logic can save time, prevent errors, and build trust.

Now seeking roles where I can continue designing agent-powered workflows, internal tools, and smart coordination systems — especially in environments that value practical intelligence, not just pedigree.

SKILLS SUMMARY

AI & Workflow Intelligence
• GPT Agent Design, Prompt Architecture, Logic Scaffolding
• Recursive Flows, Task Routing Systems, Lifecycle Modeling
• Role-Based Interaction Flows, Instructional UX for Non-Technical Users

Python Systems Development
• Python 3 (Modular Scripting, DTO Structures, API Basics)
• Pandas (Data Structuring, Filtering, Export Pipelines)
• PySide6 and Tkinter (GUI Architecture, Interaction Flows)
• FastAPI (Lightweight API Services)
• SQLite and Supabase (Layered DB Use, State Tracing, Portability)
• Local Queueing, State-Safe Mutation Paths, CLI Integration

Automation & Data Tools
• Excel (Advanced Formulas, VBA, Macros, Conditional Logic)
• Power BI (Custom Dashboards, Workflow Reporting)
• CMMS Data Structuring, Delay Tracking Logic, Heatmaps and Export Systems

Architecture & Systems Thinking
• Clean Architecture, Use Case Separation, Hexagonal Layering
• DTO-Centric Design, Immutable State Flows
• Event Logging and Audit Trails, Offline-First Design Patterns

Strategic Ops & Leadership
• Google PM Frameworks, Field Ops Coordination, Vendor & Task Lifecycle Oversight
• Cross-Functional Alignment, Preventive Logic Design, SOP Development
• Systems Adoption Strategy, Onboarding and UX for Field Teams

PROFESSIONAL EXPERIENCE

Service Maintenance Manager
MAA – Dallas, TX | Jun 2023 – Present

Led service operations across 3 multifamily properties while designing and deploying the Make Ready Digital Board (DMRB) — a logic-based AI tool used live to coordinate unit readiness

• Replaced manual spreadsheets with a state-resolved Python system using DTOs, task templates, and lifecycle enforcement
• Built audit-safe, role-scoped task flows with offline queueing, conflict detection, and automatic readiness locking
• Reduced unit turnover time from 13–20 days to 7 through system-led coordination and real-time visibility
• Integrated Python (Pandas, PySide6, FastAPI), SQLite, and Supabase to enable full-stack functionality
• Served as both operational lead and solo developer, field-testing every feature in live conditions

Service Manager
RPM Living – Dallas, TX | May 2022 – Jun 2023

Directed daily service operations at a high-volume multifamily property, overseeing technician workflows, vendor schedules, and turnover timelines

• Built and deployed custom Excel dashboards to reduce admin friction, improve task tracking, and align team focus
• Applied Agile-style planning methods to improve technician coverage and reduce backlog
• Created SOPs and structured vendor workflows to streamline unit turnover
• Introduced team-facing digital tools that improved visibility and coordination

Independent Contractor – Residential Renovation
Via First Choice – Dallas, TX | Jan 2021 – May 2022

Managed full-scope renovation projects from planning through delivery, coordinating vendors, timelines, and quality control

• Used digital project management tools to monitor milestones and prevent post-project issues
• Developed preventive protocols and SOPs to reduce callbacks and standardize field execution

Independent Contractor – Unit Upgrades
Via FSI – Dallas, TX | Feb 2020 – Jan 2021

Delivered consistent unit upgrade outcomes across multiple multifamily properties

• Created SOPs and mobile-tracked task flows to ensure timeline adherence and coordination clarity
• Identified trade coordination gaps and informed sequencing improvements

Maintenance Technician II
American Community – Dallas, TX | Feb 2018 – Feb 2020

Provided multi-system repair support (HVAC, plumbing, electrical, appliances) for multifamily units

• Supported CMMS platform rollout to streamline service order tracking
• Logged detailed maintenance data to support preventive strategy and cost analysis

Operations Assistant → Kitchen Manager (2 Units)
Universal Studios – Orlando, FL | 2009 – 2018

Progressed from operations assistant to leading two full-service kitchens during high-volume park operations

• Participated in engineering launch teams for new venues and attractions
• Led cross-kitchen menu rollout projects, coordinating timing, staff training, and guest flow readiness
• Developed early awareness of system bottlenecks, team handoffs, and operations logic under pressure

EDUCATION & CERTIFICATIONS

Education
Ana G. Méndez University – Carolina, PR
Bachelor of Business Administration in Computer Information Systems (Restarted, In Progress)

Originally completed 40+ credits; currently resuming
Coursework included databases, logic, Excel automation, and early programming fluency

Certifications

Completed
• Python for Everybody – University of Michigan / Coursera (2025)
  Covered Python syntax, control structures, data parsing, API usage, and problem solving
• Python 3 – Intermediate Track (2025)
  Focused on functions, object-oriented design, modules, and reusable system architecture
• Google Project Management Certificate – Coursera (2025)
  Applied PM frameworks to task tracking, stakeholder alignment, and Agile workflows
• EPA Section 608 Certification – HVAC Systems (2018)
  Certified in safe refrigerant handling and HVAC service protocols
• Computer Technician Certification (2013)
  Gained foundational skills in hardware diagnostics, troubleshooting, and systems repair

In Progress
• IBM AI Engineering Certificate – Coursera
  Covers machine learning, neural networks, model lifecycle, and AI deployment workflows

PROJECTS

Make Ready Digital Board (DMRB)
AI-Powered Task Lifecycle System | Python, Pandas, PySide6, FastAPI, SQLite → Supabase

• Replaced spreadsheets with a logic-resolved unit coordination engine deployed across 3 properties
• Reduced turnover from 13–20 days to 7 with role-based access, task gating, and offline queueing
• Built and used entirely in production while leading service operations

Python Training Board (PTB)
GUI-Based Python Learning Platform | Python, Tkinter, PySide6

• Created an interactive environment for new developers to move from theory to applied system design
• Built modular demos and launchers with progressive function logic and GUI flows

Blueprint Buddy
Modular GPT Instruction Builder | Prompt Architecture, Python, Logic System Design

• Built a scalable system to translate user input into structured, validated GPT instructions
• Used by product leads and toolmakers to deploy prompt systems with embedded logic flows

System Pilot
GPT-Powered Architecture Strategist | Prompt Logic, Modular Dialogues, Python

• Designed a GPT assistant that guides users from raw product ideas into full system blueprints
• Enforced architectural planning through modular dialogue and logic scaffolding

Meta Code Sensei
AI Learning Agent for Python & System Thinking | GPT Prompt Logic, Modular Dialogue Design

• Built an AI agent that teaches full-stack Python thinking in 12 phases using GPT-powered recursion
• Structured learning through progressive logic prompts, phase transitions, and system design"""
    
    return resume_content

def create_resume_files():
    """Create both PDF and DOCX resume files"""
    
    # Create text content
    content = create_text_resume()
    
    # Save as text file first (this can be converted to PDF later)
    with open('resume.txt', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("Resume files created successfully!")
    print("- resume.txt: Text version")
    print("Note: For full DOCX/PDF functionality, additional libraries would be needed")

if __name__ == "__main__":
    create_resume_files()