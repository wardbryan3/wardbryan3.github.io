import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const msg = this.state.error?.message || 'Unknown error';
      return (
        <div className="error-boundary-fallback">
          <p className="term-muted">Component crashed: {msg}</p>
          <p className="term-muted" style={{ fontSize: '0.75rem' }}>Refresh to restart</p>
        </div>
      );
    }
    return this.props.children;
  }
}
