import { useEffect, useState, useRef } from 'react';

const TUX_ART = `                .88888888:.
                88888888.88888.
              .8888888888888888.
              888888888888888888
              88' _\`88'_  \`88888
              88 88 88 88  88888
              88_88_::_88_:88888
              88:::,::,:::::8888
              88\`:::::::::'\`8888
             .88  \`::::'    8:88.
            8888            \`8:888.
          .8888'             \`888888.
         .8888:..  .::.  ...:'8888888:.
        .8888.'     :'     \`'::\`88:88888
       .8888        '         \`.888:8888.
      888:8         .           888:88888
    .888:88        .:           888:88888:
    8888888.       ::           88:888888
    \`.::.888.      ::          .88888888
   .::::::.888.    ::         :::\`8888'.:.
  ::::::::::.888   '         .::::::::::::
  ::::::::::::.8    '      .:8::::::::::::.
 .::::::::::::::.        .:888:::::::::::::
 :::::::::::::::88:.__..:88888:::::::::::'
  \`'.:::::::::::88888888888.88:::::::::'
     \`':::_:' -- '' -'-' \`':_::::'\``;

function buildFields(projectCount, postCount) {
  return [
    { key: 'name',      value: 'Bryan Ward',                                                            cls: 'green' },
    { key: 'status',    value: 'building cool stuff',                                                   cls: 'green' },
    { key: 'level',     value: 'CS student / developer',                                                cls: 'purple' },
    { key: 'focus',     value: 'full-stack web',                                                        cls: 'white' },
    { key: 'tools',     value: 'TypeScript, JavaScript, React, Next.js, Node.js, Python, Java, C++, Rust, SQL, Git, Docker, Linux, Astro', cls: 'white' },
    { key: 'projects',  value: `${projectCount} active`,                                                cls: 'white' },
    { key: 'posts',     value: `${postCount} published`,                                                cls: 'white' },
    { key: 'github',    value: 'github.com/wardbryan3',                                                 cls: 'link', href: 'https://github.com/wardbryan3' },
    { key: 'linkedin',  value: 'linkedin.com/in/bryan-ward-298292196',                                  cls: 'link', href: 'https://www.linkedin.com/in/bryan-ward-298292196/' },
  ];
}

function buildFieldSegments(fields) {
  const segments = [];
  const maxKeyLen = Math.max(...fields.map(f => f.key.length));
  const padLen = maxKeyLen + 5;
  for (let fi = 0; fi < fields.length; fi++) {
    const f = fields[fi];
    const paddedKey = f.key.padEnd(padLen, ' ');
    for (let ci = 0; ci < paddedKey.length; ci++) {
      segments.push({ fieldIdx: fi, part: 'key', char: paddedKey[ci], color: 'key' });
    }
    for (let ci = 0; ci < f.value.length; ci++) {
      segments.push({ fieldIdx: fi, part: 'value', char: f.value[ci], color: f.cls });
    }
    if (fi < fields.length - 1) {
      segments.push({ fieldIdx: -1, part: 'newline', char: '\n', color: null });
    }
  }
  return segments;
}

export default function FastfetchWindow({ projectCount = 0, postCount = 0 }) {
  const [phase, setPhase] = useState('growing');
  const [commandText, setCommandText] = useState('');
  const [outputIndex, setOutputIndex] = useState(0);

  const fieldsRef = useRef(buildFields(projectCount, postCount));
  const tuxCharsRef = useRef(TUX_ART.split(''));
  const fieldSegmentsRef = useRef(buildFieldSegments(fieldsRef.current));
  const maxOutputRef = useRef(Math.max(
    tuxCharsRef.current.length,
    fieldSegmentsRef.current.length
  ));

  // Phase: growing → prompt (after CSS animation completes)
  useEffect(() => {
    const timer = setTimeout(() => setPhase('prompt'), 450);
    return () => clearTimeout(timer);
  }, []);

  // Phase: prompt → command
  useEffect(() => {
    if (phase !== 'prompt') return;
    const timer = setTimeout(() => setPhase('command'), 600);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase: command — type "fastfetch"
  useEffect(() => {
    if (phase !== 'command') return;
    const target = 'fastfetch';
    let i = 0;
    let doneTimer;
    const timer = setInterval(() => {
      i++;
      setCommandText(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(timer);
        doneTimer = setTimeout(() => setPhase('output'), 300);
      }
    }, 60);
    return () => {
      clearInterval(timer);
      clearTimeout(doneTimer);
    };
  }, [phase]);

  // Phase: output — type tux + fields simultaneously
  useEffect(() => {
    if (phase !== 'output') return;
    const max = maxOutputRef.current;
    let i = 0;
    let doneTimer;
    const timer = setInterval(() => {
      i += 3;
      setOutputIndex(Math.min(i, max));
      if (i >= max) {
        clearInterval(timer);
        doneTimer = setTimeout(() => setPhase('done'), 400);
      }
    }, 12);
    return () => {
      clearInterval(timer);
      clearTimeout(doneTimer);
    };
  }, [phase]);

  // Build visible tux art
  const tuxChars = tuxCharsRef.current;
  const visibleTux = outputIndex < tuxChars.length
    ? tuxChars.slice(0, outputIndex).join('')
    : TUX_ART;

  // Build visible field parts (computed each render based on outputIndex)
  const fieldSegments = fieldSegmentsRef.current;
  const visibleFieldParts = [];
  let segCount = 0;
  for (const seg of fieldSegments) {
    const before = segCount;
    segCount += seg.char.length;
    if (before >= outputIndex) break;
    if (seg.part === 'newline') {
      visibleFieldParts.push({ ...seg, visible: segCount <= outputIndex });
    } else {
      const avail = Math.max(0, Math.min(seg.char.length, outputIndex - before));
      visibleFieldParts.push({ ...seg, char: seg.char.slice(0, avail), visible: avail > 0 });
    }
    if (segCount >= outputIndex) break;
  }

  const showCursor = phase === 'prompt' || phase === 'command';

  return (
    <div className={`terminal-window${phase === 'growing' ? ' growing' : ''}`}>
      <div className="terminal-window-body">
        {/* Prompt + command line */}
        <div className="ff-line">
          <span className="ff-prompt">bryan@ward:~$ </span>
          {(phase === 'command' || phase === 'output' || phase === 'done') && commandText && (
            <span className="ff-command">{commandText}</span>
          )}
          {showCursor && <span className="ff-cursor">&nbsp;</span>}
        </div>

        {/* Output: tux + fields */}
        {(phase === 'output' || phase === 'done') && (
          <div className="ff-output">
            <pre className="ff-tux">{visibleTux}</pre>
            <div className="ff-fields">
              {visibleFieldParts.map((seg, i) => {
                if (seg.part === 'newline') {
                  return seg.visible ? <br key={i} /> : null;
                }
                if (!seg.char) return null;
                let cls = 'ff-value';
                if (seg.color === 'green') cls += ' ff-value-green';
                else if (seg.color === 'purple') cls += ' ff-value-purple';
                else if (seg.color === 'link') cls += ' ff-value-link';
                else if (seg.color === 'key') cls = 'ff-key';

                if (seg.color === 'link' && seg.fieldIdx >= 0) {
                  const field = fieldsRef.current[seg.fieldIdx];
                  return (
                    <a key={i} href={field.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {seg.char}
                    </a>
                  );
                }
                return <span key={i} className={cls}>{seg.char}</span>;
              })}
            </div>
          </div>
        )}

        {/* Final prompt */}
        {phase === 'done' && (
          <div className="ff-prompt" style={{ marginTop: '0.75rem' }}>
            bryan@ward:~${' '}
            <span className="ff-cursor">&nbsp;</span>
          </div>
        )}
      </div>
    </div>
  );
}
