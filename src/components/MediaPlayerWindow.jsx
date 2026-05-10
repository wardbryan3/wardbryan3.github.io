import { useState } from 'react';

const TRACKS = [
  { num: '01', title: 'Featured on CSS Design Awards', duration: '2:14' },
  { num: '02', title: 'Open-source contributor \u2014 500+ stars', duration: '3:02' },
  { num: '03', title: 'Guest speaker: Design Systems Summit', duration: '1:58' },
];

const SHUFFLE_QUOTES = [
  '"Bryan delivered beyond expectations." \u2014 Former Manager',
  '"A pleasure to work with \u2014 great code, great attitude." \u2014 Colleague',
  '"The terminal portfolio was a standout in the hiring process." \u2014 Recruiter',
  '"Technical skills and design sense are a rare combo." \u2014 Client',
];

export default function MediaPlayerWindow() {
  const [currentTrack, setCurrentTrack] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quote, setQuote] = useState(null);

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

  const handleShuffle = () => {
    const q = SHUFFLE_QUOTES[Math.floor(Math.random() * SHUFFLE_QUOTES.length)];
    setQuote(q);
    setTimeout(() => setQuote(null), 4000);
  };

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        fontSize: '0.7rem',
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
                <span style={{ color: 'var(--accent)', fontSize: '0.65rem' }}>
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
                fontSize: '0.65rem',
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
            {[20, 40, 60, 35, 50, 25, 45, 30].map((h, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: isPlaying && currentTrack >= 0 ? `${h}px` : '20px',
                  background: 'var(--accent)', borderRadius: '2px',
                  transition: 'height 300ms',
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
        <button onClick={handlePrev} style={ctrlBtnStyle}>{'\u23EE'}</button>
        <button onClick={handlePlay} style={{ ...ctrlBtnStyle, color: 'var(--accent)', fontSize: '1rem' }}>
          {isPlaying ? '\u23F8' : '\u25B6'}
        </button>
        <button onClick={handleNext} style={ctrlBtnStyle}>{'\u23ED'}</button>
        <span style={{ flex: 1 }} />
        <button onClick={handleShuffle} style={{ ...ctrlBtnStyle, color: 'var(--text-muted)' }} title="Shuffle">
          {'\uD83D\uDD00'}
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
          {currentTrack >= 0 ? TRACKS[currentTrack].duration : '0:00'}
        </span>
      </div>
    </div>
  );
}

const ctrlBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text)', fontSize: '0.7rem',
};
