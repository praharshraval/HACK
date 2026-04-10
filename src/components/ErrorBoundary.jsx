import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d1117',
          color: '#c9d1d9',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem'
        }}>
          <div style={{ maxWidth: '500px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f85149' }}>Something went wrong</h1>
            <p style={{ color: '#8b949e', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
              style={{
                padding: '0.5rem 1.5rem',
                background: '#238636',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
