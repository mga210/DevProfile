#!/usr/bin/env python3
"""
Script to create a proper PDF resume file
"""
import subprocess
import tempfile
import os

def create_html_resume():
    """Create an HTML version of the resume for PDF conversion"""
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Miguel A. Gonzalez Almonte - Resume</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            font-size: 11px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .contact {
            font-size: 10px;
            color: #666;
        }
        .title {
            font-size: 14px;
            color: #667eea;
            font-weight: bold;
            margin: 10px 0;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 14px;
            font-weight: bold;
            color: #667eea;
            border-bottom: 1px solid #667eea;
            margin-bottom: 10px;
            padding-bottom: 2px;
        }
        .job-title {
            font-weight: bold;
            color: #333;
        }
        .company {
            font-style: italic;
            color: #666;
        }
        .date {
            float: right;
            color: #666;
            font-size: 10px;
        }
        .job-header {
            margin-bottom: 5px;
            overflow: hidden;
        }
        ul {
            margin: 5px 0;
            padding-left: 20px;
        }
        li {
            margin-bottom: 3px;
        }
        .skills-category {
            margin-bottom: 10px;
        }
        .skills-title {
            font-weight: bold;
            color: #333;
        }
        .project-title {
            font-weight: bold;
            color: #333;
        }
        .project-tech {
            font-style: italic;
            color: #666;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">Miguel A. Gonzalez Almonte</div>
        <div class="contact">
            Plano, TX · 787-367-9843 · mgonzalez869@gmail.com<br>
            <a href="https://www.linkedin.com/in/miguel-gonzalez-8a389791" style="color: #0563C1; text-decoration: none;">LinkedIn</a> · 
            <a href="https://mga210.github.io/DevProfile/" style="color: #0563C1; text-decoration: none;">Portfolio</a> · 
            <a href="https://github.com/mga210" style="color: #0563C1; text-decoration: none;">GitHub</a>
        </div>
        <div class="title">AI Systems Builder | GPT-Powered Workflow Architect | Operational Intelligence Technologist</div>
        <p style="margin: 10px 0; font-style: italic;">Bridging field-tested operational insight with code-based systems design. I build logic-driven tools that improve coordination, decision flow, and end-user clarity.</p>
    </div>

    <div class="section">
        <div class="section-title">PROFESSIONAL SUMMARY</div>
        <p>AI systems builder with deep roots in operations leadership and a self-driven path into software design, automation, and GPT agent architecture. I've built and deployed intelligent tools that replaced spreadsheets, reduced operational delays, and brought logic-based coordination into live operational environments. My systems are not experiments — they are active solutions used in production to enforce lifecycle integrity, audit state transitions, and support non-technical users.</p>
        
        <p>Though I've never held a formal software title, I've architected AI assistants, Python dashboards, and decision frameworks that reflect enterprise-grade thinking and field-tested pragmatism. My work lives at the intersection of operational intelligence and systems clarity — where good logic can save time, prevent errors, and build trust.</p>
        
        <p>Now seeking roles where I can continue designing agent-powered workflows, internal tools, and smart coordination systems — especially in environments that value practical intelligence, not just pedigree.</p>
    </div>

    <div class="section">
        <div class="section-title">SKILLS SUMMARY</div>
        
        <div class="skills-category">
            <div class="skills-title">AI & Workflow Intelligence</div>
            <ul>
                <li>GPT Agent Design, Prompt Architecture, Logic Scaffolding</li>
                <li>Recursive Flows, Task Routing Systems, Lifecycle Modeling</li>
                <li>Role-Based Interaction Flows, Instructional UX for Non-Technical Users</li>
            </ul>
        </div>

        <div class="skills-category">
            <div class="skills-title">Python Systems Development</div>
            <ul>
                <li>Python 3 (Modular Scripting, DTO Structures, API Basics)</li>
                <li>Pandas (Data Structuring, Filtering, Export Pipelines)</li>
                <li>PySide6 and Tkinter (GUI Architecture, Interaction Flows)</li>
                <li>FastAPI (Lightweight API Services)</li>
                <li>SQLite and Supabase (Layered DB Use, State Tracing, Portability)</li>
            </ul>
        </div>

        <div class="skills-category">
            <div class="skills-title">Automation & Data Tools</div>
            <ul>
                <li>Excel (Advanced Formulas, VBA, Macros, Conditional Logic)</li>
                <li>Power BI (Custom Dashboards, Workflow Reporting)</li>
                <li>CMMS Data Structuring, Delay Tracking Logic, Heatmaps and Export Systems</li>
            </ul>
        </div>
    </div>

    <div class="section">
        <div class="section-title">PROFESSIONAL EXPERIENCE</div>
        
        <div class="job-header">
            <span class="job-title">Service Maintenance Manager</span>
            <span class="date">Jun 2023 – Present</span><br>
            <span class="company">MAA – Dallas, TX</span>
        </div>
        <p>Led service operations across 3 multifamily properties while designing and deploying the Make Ready Digital Board (DMRB) — a logic-based AI tool used live to coordinate unit readiness</p>
        <ul>
            <li>Replaced manual spreadsheets with a state-resolved Python system using DTOs, task templates, and lifecycle enforcement</li>
            <li>Built audit-safe, role-scoped task flows with offline queueing, conflict detection, and automatic readiness locking</li>
            <li>Reduced unit turnover time from 13–20 days to 7 through system-led coordination and real-time visibility</li>
            <li>Integrated Python (Pandas, PySide6, FastAPI), SQLite, and Supabase to enable full-stack functionality</li>
        </ul>

        <div class="job-header">
            <span class="job-title">Service Manager</span>
            <span class="date">May 2022 – Jun 2023</span><br>
            <span class="company">RPM Living – Dallas, TX</span>
        </div>
        <ul>
            <li>Built and deployed custom Excel dashboards to reduce admin friction, improve task tracking, and align team focus</li>
            <li>Applied Agile-style planning methods to improve technician coverage and reduce backlog</li>
            <li>Created SOPs and structured vendor workflows to streamline unit turnover</li>
        </ul>

        <div class="job-header">
            <span class="job-title">Operations Assistant → Kitchen Manager</span>
            <span class="date">2009 – 2018</span><br>
            <span class="company">Universal Studios – Orlando, FL</span>
        </div>
        <ul>
            <li>Progressed from operations assistant to leading two full-service kitchens during high-volume park operations</li>
            <li>Participated in engineering launch teams for new venues and attractions</li>
            <li>Led cross-kitchen menu rollout projects, coordinating timing, staff training, and guest flow readiness</li>
        </ul>
    </div>

    <div class="section">
        <div class="section-title">EDUCATION & CERTIFICATIONS</div>
        
        <div class="job-header">
            <span class="job-title">Bachelor of Business Administration in Computer Information Systems</span><br>
            <span class="company">Ana G. Méndez University – Carolina, PR (In Progress)</span>
        </div>

        <p><strong>Completed Certifications:</strong></p>
        <ul>
            <li>Python for Everybody – University of Michigan / Coursera (2025)</li>
            <li>Python 3 – Intermediate Track (2025)</li>
            <li>Google Project Management Certificate – Coursera (2025)</li>
            <li>EPA Section 608 Certification – HVAC Systems (2018)</li>
        </ul>
    </div>

    <div class="section">
        <div class="section-title">KEY PROJECTS</div>
        
        <div class="project-title">Make Ready Digital Board (DMRB)</div>
        <div class="project-tech">AI-Powered Task Lifecycle System | Python, Pandas, PySide6, FastAPI, SQLite → Supabase</div>
        <ul>
            <li>Replaced spreadsheets with a logic-resolved unit coordination engine deployed across 3 properties</li>
            <li>Reduced turnover from 13–20 days to 7 with role-based access, task gating, and offline queueing</li>
        </ul>

        <div class="project-title">System Pilot</div>
        <div class="project-tech">GPT-Powered Architecture Strategist | Prompt Logic, Modular Dialogues, Python</div>
        <ul>
            <li>Designed a GPT assistant that guides users from raw product ideas into full system blueprints</li>
            <li>Enforced architectural planning through modular dialogue and logic scaffolding</li>
        </ul>

        <div class="project-title">Blueprint Buddy</div>
        <div class="project-tech">Modular GPT Instruction Builder | Prompt Architecture, Python, Logic System Design</div>
        <ul>
            <li>Built a scalable system to translate user input into structured, validated GPT instructions</li>
            <li>Used by product leads and toolmakers to deploy prompt systems with embedded logic flows</li>
        </ul>
    </div>
</body>
</html>"""
    return html_content

def create_pdf_from_html():
    """Create PDF from HTML using wkhtmltopdf"""
    try:
        # Create HTML content
        html_content = create_html_resume()
        
        # Write HTML to temporary file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.html', delete=False) as temp_html:
            temp_html.write(html_content)
            temp_html_path = temp_html.name
        
        # Convert HTML to PDF
        pdf_path = 'resume.pdf'
        cmd = [
            'wkhtmltopdf',
            '--page-size', 'Letter',
            '--margin-top', '0.5in',
            '--margin-right', '0.5in',
            '--margin-bottom', '0.5in',
            '--margin-left', '0.5in',
            '--encoding', 'UTF-8',
            '--no-outline',
            temp_html_path,
            pdf_path
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"PDF created successfully: {pdf_path}")
        else:
            print(f"Error creating PDF: {result.stderr}")
            return False
        
        # Clean up temporary file
        os.unlink(temp_html_path)
        return True
        
    except Exception as e:
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    success = create_pdf_from_html()
    if not success:
        print("Failed to create PDF. Creating fallback text file.")
        # Fallback: create a text file as PDF
        with open('resume.pdf', 'w', encoding='utf-8') as f:
            f.write("MIGUEL A. GONZALEZ ALMONTE - RESUME\n")
            f.write("="*50 + "\n\n")
            f.write("Note: This is a text-based resume file.\n")
            f.write("For best formatting, please download the DOCX version.\n\n")
            f.write("Contact: sllm75@hotmail.com | 787-367-9843 | Plano, TX\n")
            f.write("LinkedIn: linkedin.com/in/miguel-gonzalez-8a389791\n\n")
            f.write("AI Systems Builder | GPT-Powered Workflow Architect | Operational Intelligence Technologist\n\n")
            f.write("Full resume content available in DOCX format.")