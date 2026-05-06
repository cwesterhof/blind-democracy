import { Component } from "react";

export class ErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return (
                <main style={{ padding: "2rem" }}>
                    <h2>Er is iets misgegaan</h2>
                    <p>Ververs de pagina. Als het probleem aanhoudt, neem contact op.</p>
                    <details>
                        <summary>Technische details</summary>
                        <pre>{this.state.error.message}</pre>
                    </details>
                </main>
            );
        }
        return this.props.children;
    }
}
