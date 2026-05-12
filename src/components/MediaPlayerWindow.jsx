import { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { num: '01', title: 'Southern New Hampshire University — B.S. Computer Science (Expected 02/2027) — GPA: 4.0', duration: '4:00' },
  { num: '02', title: 'Responsive Web Design Certification (freeCodeCamp.com)', duration: '2:02' },
  { num: '03', title: 'Guest speaker: Design Systems Summit', duration: '1:58' },
];

const SHUFFLE_QUOTES = [
  '"Bryan delivered beyond expectations." \u2014 Former Manager',
  '"A pleasure to work with \u2014 great code, great attitude." \u2014 Colleague',
  '"The terminal portfolio was a standout in the hiring process." \u2014 Recruiter',
  '"Technical skills and design sense are a rare combo." \u2014 Client',
];

const BAR_COUNT = 8;
const INITIAL_BARS = [50, 65, 70, 35, 50, 25, 45, 30];

export default function MediaPlayerWindow() {
  const [currentTrack, setCurrentTrack] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quote, setQuote] = useState(null);
  const [bars, setBars] = useState(INITIAL_BARS);
  const shuffleTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(shuffleTimerRef.current);
  }, []);

  const handlePlay = () => {
    if (currentTrack < 0) setCurrentTrack(0);
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setCurrentTrack((p) => (p > 0 ? p - 1 : TRACKS.length - 1));
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentTrack((p) => (p < TRACKS.length - 1 ? p + 1 : 0));
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || currentTrack < 0) {
      setBars(INITIAL_BARS);
      return;
    }
    const interval = setInterval(() => {
      setBars(INITIAL_BARS.map(min => min + Math.floor(Math.random() * 30)));
    }, 180);
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  const handleShuffle = () => {
    clearTimeout(shuffleTimerRef.current);
    const q = SHUFFLE_QUOTES[Math.floor(Math.random() * SHUFFLE_QUOTES.length)];
    setQuote(q);
    shuffleTimerRef.current = setTimeout(() => setQuote(null), 4000);
  };

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        fontSize: 'calc(0.7rem * var(--os-font-mult))',
      }}
    >
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, padding: '8px', overflow: 'auto' }}>
          {TRACKS.map((track, i) => (
            <div
              key={track.num}
              onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
              style={{
                display: 'flex', gap: '6px', padding: '5px 6px',
                cursor: 'pointer', borderRadius: '3px',
                background: currentTrack === i ? 'var(--surface-hover)' : 'transparent',
                color: currentTrack === i ? 'var(--accent)' : 'var(--text)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ color: 'var(--text-muted)', width: '20px' }}>
                {track.num}
              </span>
              <span style={{ flex: 1 }}>{track.title}</span>
              <span style={{ color: 'var(--text-muted)' }}>{track.duration}</span>
              {isPlaying && currentTrack === i && (
                <span style={{ color: 'var(--accent)', fontSize: 'calc(0.65rem * var(--os-font-mult))' }}>
                  {'\u266A'}
                </span>
              )}
            </div>
          ))}
          {quote && (
            <div
              style={{
                marginTop: '12px', padding: '8px',
                border: '1px solid var(--accent)', borderRadius: '4px',
                fontStyle: 'italic', color: 'var(--accent)',
                fontSize: 'calc(0.65rem * var(--os-font-mult))',
              }}
            >
              {quote}
            </div>
          )}
        </div>

        <div
          style={{
            width: '120px', borderLeft: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--surface)',
          }}
        >
          <div
            style={{
              display: 'flex', alignItems: 'flex-end', gap: '3px',
              height: '80px',
            }}
          >
            {bars.map((h, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: isPlaying && currentTrack >= 0 ? `${h}px` : '20px',
                  background: 'var(--accent)', borderRadius: '2px',
                  transition: 'height 300ms ease',
                  opacity: isPlaying && currentTrack >= 0 ? 0.8 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '6px 10px', borderTop: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <button onClick={handlePrev} style={ctrlBtnStyle}>
          <img src="/img/icons/rewind.svg" style={{ width: '14px', height: '14px', display: 'block' }} alt="Previous" />
        </button>
        <button onClick={handlePlay} style={{ ...ctrlBtnStyle }}>
          <img src={isPlaying ? '/img/icons/pause.svg' : '/img/icons/play.svg'} style={{ width: '16px', height: '16px', display: 'block' }} alt={isPlaying ? 'Pause' : 'Play'} />
        </button>
        <button onClick={handleNext} style={ctrlBtnStyle}>
          <img src="/img/icons/fast-forward.svg" style={{ width: '14px', height: '14px', display: 'block' }} alt="Next" />
        </button>
        <span style={{ flex: 1 }} />
        <button onClick={handleShuffle} style={ctrlBtnStyle} title="Shuffle">
          <img src="/img/icons/shuffle.svg" style={{ width: '14px', height: '14px', display: 'block' }} alt="Shuffle" />
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: 'calc(0.6rem * var(--os-font-mult))' }}>
          {currentTrack >= 0 ? TRACKS[currentTrack].duration : '0:00'}
        </span>
      </div>
    </div>
  );
}

const ctrlBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text)', fontSize: 'calc(0.7rem * var(--os-font-mult))',
};
