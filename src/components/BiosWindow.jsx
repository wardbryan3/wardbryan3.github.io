import { useState, useEffect, useCallback } from 'react';

export default function BiosWindow() {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState('Y');

  const handleKey = useCallback((e) => {
    if (!show) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      setSelected(prev => prev === 'Y' ? 'N' : 'Y');
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selected === 'Y') {
        setShow(false);
        document.dispatchEvent(new CustomEvent('boot:bios-yes'));
      }
    }
  }, [show, selected]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    const handler = () => {
      setShow(true);
      setSelected('Y');
    };
    document.addEventListener('boot:show-bios', handler);
    return () => document.removeEventListener('boot:show-bios', handler);
  }, []);

  if (!show) return null;

  return (
    <div className="bios-overlay">
      <div className="bios-header">
        <div className="bios-header-label">BIOS SETUP UTILITY</div>
        <div className="bios-header-version">Portfolio Edition v1.0</div>
      </div>
      <div className="bios-body">
        <div className="bios-window">
          <div className="bios-window-titlebar">Boot Confirmation</div>
          <div className="bios-window-body">
            <div className="bios-window-text">
              My wife made me put this here,<br />would you like to boot?
            </div>
            <div className="bios-choices">
              <div
                className={`bios-choice ${selected === 'Y' ? 'bios-choice-selected' : ''}`}
                onClick={() => setSelected('Y')}
              >
                <span className="bios-choice-label">[Y]</span> Yes
              </div>
              <div
                className={`bios-choice ${selected === 'N' ? 'bios-choice-selected' : ''}`}
                onClick={() => setSelected('N')}
              >
                <span className="bios-choice-label">[N]</span> No
              </div>
            </div>
            <div className="bios-footer">
              ← → Select   Enter Accept
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
