import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Error boundary para capturar erros de renderização
class ErrorBoundary extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Erro na aplicação:', error, errorInfo);
  }

  render() {
    if ((this.state as any).hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#f8fafc',
          flexDirection: 'column',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Ops! Algo deu errado</h1>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);