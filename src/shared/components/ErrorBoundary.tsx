import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '40px', backgroundColor: '#121212', color: '#ff4444', height: '100vh', fontFamily: 'monospace' }}>
                    <h1>🛑 Critical Application Error</h1>

                    <div style={{ marginBottom: '20px' }}>
                        <h2>Error Message:</h2>
                        <pre style={{ backgroundColor: '#000', padding: '15px', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
                            {this.state.error && this.state.error.toString()}
                        </pre>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h2>Component Stack:</h2>
                        <pre style={{ backgroundColor: '#000', padding: '15px', borderRadius: '5px', fontSize: '12px', overflowX: 'auto' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: '1px solid #555' }}
                    >
                        Reload Application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
