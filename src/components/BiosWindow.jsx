import { useState, useEffect, useCallback } from 'react';

export default function BiosWindow() {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState('Y');

  const boot = useCallback(() => {
    setShow(false);
    document.dispatchEvent(new CustomEvent('boot:bios-yes'));
  }, []);

  const handleKey = useCallback(
    (e) => {
      if (!show) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        setSelected((prev) => (prev === 'Y' ? 'N' : 'Y'));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        boot();
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        boot();
      }
    },
    [show, boot],
  );

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
        <span className="bios-header-title">Optio Setup Utility - v1.0</span>
        <span className="bios-header-copyright">Copyright (C) 2025 American Megahertz</span>
      </div>

      <div className="bios-tabbar">
        <span className="bios-tab bios-tab-selected">Main</span>
        <span className="bios-tab">Advanced</span>
        <span className="bios-tab">Chipset</span>
        <span className="bios-tab">Boot</span>
        <span className="bios-tab">Security</span>
        <span className="bios-tab">Save &amp; Exit</span>
      </div>

      <div className="bios-body">
        <div className="bios-body-left">
          <div className="bios-window">
            <div className="bios-window-titlebar">Boot Confirmation</div>
            <div className="bios-window-body">
              <div className="bios-window-text" style={{ color: '#000' }}>
                My wife made me put this here,
                <br />
                would you like to boot?
              </div>
              <div className="bios-choices">
                <div
                  className={`bios-choice ${selected === 'Y' ? 'bios-choice-selected' : ''}`}
                  onClick={() => {
                    setSelected('Y');
                    boot();
                  }}
                >
                  <span className="bios-choice-label">[Y]</span> Yes
                </div>
                <div
                  className={`bios-choice ${selected === 'N' ? 'bios-choice-selected' : ''}`}
                  onClick={() => {
                    setSelected('N');
                    boot();
                  }}
                >
                  <span className="bios-choice-label">[N]</span> No
                </div>
              </div>
              <div className="bios-dialog-footer">
                &larr; &rarr; Select &nbsp;&nbsp; Enter Accept
              </div>
            </div>
          </div>
        </div>
        <div className="bios-body-right">
          <div className="bios-help-heading">Item Specific Help</div>
          <hr className="bios-help-separator" />
          <div>
            Confirm whether to
            <br />
            continue booting into
            <br />
            Portfolio OS.
          </div>
          <hr className="bios-help-separator" />
          <div className="bios-help-hints">
            &larr; &rarr; Change
            <br />
            Enter Accept
          </div>
        </div>
      </div>

      <div className="bios-footer">
        <span>
          <span className="bios-footer-key">F1</span> Help
        </span>
        <span>
          <span className="bios-footer-key">ESC</span> Exit
        </span>
        <span>
          <span className="bios-footer-key">&larr; &rarr;</span> Select
        </span>
        <span>
          <span className="bios-footer-key">Enter</span> Accept
        </span>
      </div>
    </div>
  );
}
