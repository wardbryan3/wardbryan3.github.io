function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div
        style={{
          fontWeight: 600, fontSize: 'calc(0.7rem * var(--os-font-mult))',
          borderBottom: '1px solid var(--border)', marginBottom: '4px',
          color: 'var(--accent)',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Ul({ children }) {
  return <ul style={{ margin: '4px 0', paddingLeft: '16px', fontSize: 'calc(0.65rem * var(--os-font-mult))' }}>{children}</ul>;
}

function Role({ title, subtitle, date }) {
  return (
    <div style={{ marginBottom: '2px' }}>
      <div style={{ fontWeight: 600, fontSize: 'calc(0.67rem * var(--os-font-mult))' }}>{title}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: 'calc(0.6rem * var(--os-font-mult))', display: 'flex', justifyContent: 'space-between' }}>
        <span>{subtitle}</span>
        <span>{date}</span>
      </div>
    </div>
  );
}

export default function ResumeWindow() {
  return (
    <div
      style={{
        height: '100%', overflow: 'auto', fontFamily: 'var(--font-mono)',
        fontSize: 'calc(0.7rem * var(--os-font-mult))', padding: '16px', lineHeight: '1.6',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>
          BRYAN WARD
        </div>
        <div style={{ fontSize: 'calc(0.6rem * var(--os-font-mult))', color: 'var(--text-muted)' }}>
          wardbryan3@gmail.com | 971-762-7050 | Lakeview, OR | github.com/wardbryan3
        </div>
      </div>

      <Section title="OBJECTIVE">
        <div style={{ fontSize: 'calc(0.65rem * var(--os-font-mult))' }}>
          Software engineer and full-stack developer with experience building automation tools, web applications, and embedded systems. Passionate about clean code, open-source software, and solving real-world problems through technology.
        </div>
      </Section>

      <Section title="TECHNICAL SKILLS">
        <div style={{ fontSize: 'calc(0.65rem * var(--os-font-mult))' }}>
          <strong>OS:</strong> Windows 7-11, Linux (Debian, Fedora, Arch)
          <br />
          <strong>Tools:</strong> Microsoft Office/M365, Active Directory, Proxmox VE, Docker, Git, SSH
          <br />
          <strong>Hardware:</strong> Desktop/laptop deployment, printer configuration, mobile devices, A/V equipment
          <br />
          <strong>Networking:</strong> TCP/IP, wireless/wired configurations, remote access, cloud storage integration
          <br />
          <strong>Languages:</strong> Python, JavaScript, Java, HTML/CSS, Shell scripting
        </div>
      </Section>

      <Section title="EXPERIENCE">
        <Role title="Intern" subtitle="Vantage Compute — Oregon, United States (Remote)" date="Apr 2026 - Present" />
        <Ul>
          <li>Refactoring user-facing documentation for Vantage Compute (AI, HPC, quantum workloads across any environment).</li>
          <li>Restructuring the Getting Started section to improve onboarding for engineers and researchers.</li>
          <li>Auditing and rewriting CLI/API examples for accuracy, collaborating with engineering to validate workflows.</li>
        </Ul>

        <Role title="IT Support Manager" subtitle="KORV Radio — Lakeview, OR" date="Nov 2025 - Present" />
        <Ul>
          <li>Designing and implementing the station's online streaming infrastructure, ensuring reliable broadcast delivery and user accessibility.</li>
          <li>Automating routine IT and business processes using Python, including system backups, content downloads, and log monitoring, reducing manual effort and improving operational consistency.</li>
          <li>Creating and maintaining detailed procedural documentation and knowledge base articles to streamline troubleshooting and onboarding.</li>
          <li>Providing comprehensive technical support for end-users across Windows and Linux environments, resolving hardware, software, and network issues via in-person and remote assistance.</li>
        </Ul>

        <Role title="IT Support Technician" subtitle="KORV Radio — Lakeview, OR" date="May 2021 - Nov 2025" />
        <Ul>
          <li>On-call technical support for the workstation fleet, including hardware upgrades, OS migration, and software troubleshooting.</li>
          <li>Assisted in the imaging, deployment, and configuration of desktop/laptop computers and printers, ensuring standardized setups.</li>
          <li>Designed and implemented a centralized file management system using Dropbox, migrating from disparate local storage to a secure, cloud-based solution.</li>
          <li>Streamlined printer deployment processes, reducing connectivity issues and configuration time.</li>
          <li>Documented procedures and maintained a knowledge base for recurring technical issues.</li>
        </Ul>

        <Role title="Owner / Operator" subtitle="Ward Detail and More — Lakeview, OR" date="May 2021 - Nov 2025" />
        <Ul>
          <li>Managed end-to-end client projects from consultation to completion, designing and installing custom 12V electrical systems with a focus on reliability and safety.</li>
          <li>Performed root-cause analysis on complex technical issues, developed effective repair strategies and preventative solutions.</li>
          <li>Oversaw daily business operations, including inventory management, supply procurement, and financial record-keeping.</li>
          <li>Developed and maintained detailed technical documentation, SOPs, and client manuals.</li>
          <li>Conducted final quality testing and personalized client training on all installed systems.</li>
        </Ul>

        <Role title="Plant Operator" subtitle="Red Rock Biofuels — Lakeview, OR" date="Dec 2020 - May 2021" />
        <Ul>
          <li>Monitored automated production systems, responded to diagnostics, and authored detailed incident and performance reports.</li>
          <li>Participated in technical training to master new systems and optimize operational efficiency.</li>
          <li>Authored detailed technical documentation on equipment performance, incident reports, and production data.</li>
        </Ul>

        <Role title="Install Technician" subtitle="Car Toys — Portland, OR" date="Sep 2018 - Apr 2020" />
        <Ul>
          <li>Earned promotion from Detailer by proactively obtaining MECP certification, demonstrating technical proficiency.</li>
          <li>Conducted technical consultations and sales, analyzed customer needs to design and recommend customized audio, security, and remote-start systems.</li>
          <li>Performed detailed installations and integrations of complex 12V electrical systems.</li>
        </Ul>

        <Role title="Detailer" subtitle="Car Toys — Portland, OR" date="Aug 2017 - Sep 2018" />
        <Ul>
          <li>Performed high-quality interior and exterior vehicle detailing, adhering to strict service standards.</li>
          <li>Developed strong client rapport through clear communication and managing expectations.</li>
          <li>Maintained inventory of cleaning supplies and tools, ensuring organized and efficient workspaces.</li>
        </Ul>
      </Section>

      <Section title="PROJECTS">
        <Role title="Automated Greenhouse" subtitle="Raspberry Pi Pico, MicroPython, Sensors, Relays" date="" />
        <Ul>
          <li>Designed and implemented an embedded system to autonomously regulate greenhouse conditions, including temperature, humidity, and soil moisture.</li>
          <li>Engineered a solution that reduces manual intervention and optimizes plant growth.</li>
        </Ul>

        <Role title="Home Server" subtitle="Proxmox VE, Docker, LXCs, VMs, Plex, Immich" date="" />
        <Ul>
          <li>Architected and maintaining a robust home server environment virtualized on Proxmox, hosting critical services in isolated Linux Containers and Virtual Machines.</li>
          <li>Containerized applications using Docker to streamline deployment, management, and scalability of services such as Plex, Immich, and Nextcloud.</li>
        </Ul>

        <Role title="Game Development" subtitle="Godot Engine, GDScript, Data Structures, Algorithms" date="" />
        <Ul>
          <li>Developed 2D and 3D game prototypes to deepen understanding of core programming principles, including object-oriented design, state management, and common data structures.</li>
          <li>Implemented algorithms for pathfinding and AI behavior, focusing on performance optimization and clean, maintainable code structure.</li>
        </Ul>
      </Section>

      <Section title="EDUCATION & CERTIFICATIONS">
        <Ul>
          <li><strong>Southern New Hampshire University</strong> — B.S. Computer Science (Expected 02/2027) — GPA: 4.0</li>
          <li>Responsive Web Design Certification (2020)</li>
          <li>MECP Skilled Installation Technician (June 2019)</li>
          <li>High School Diploma — Lakeview, OR (2012)</li>
        </Ul>
      </Section>

      <div
        style={{
          textAlign: 'center', marginTop: '16px', paddingTop: '12px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <a
          href="/resume.pdf"
          download
          style={{
            display: 'inline-block', padding: '6px 16px',
            border: '1px solid var(--accent)', borderRadius: '4px',
            color: 'var(--accent)', textDecoration: 'none',
            fontSize: 'calc(0.65rem * var(--os-font-mult))',
          }}
        >
          {'\u2B07'} Download PDF
        </a>
      </div>
    </div>
  );
}
