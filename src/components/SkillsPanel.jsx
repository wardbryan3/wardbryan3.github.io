const skills = [
  'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js',
  'Python', 'Java', 'C++', 'Rust', 'SQL',
  'Git', 'Docker', 'Linux', 'Astro',
];

export default function SkillsPanel() {
  return (
    <div className="terminal-panel">
      <div className="panel-header">~/tools</div>
      <div className="panel-body">
        <div className="skills-wrap">
          {skills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
