import { Component } from "react";
import { useTranslation } from "react-i18next";

function ErrorFallback({ error }) {
    const { t } = useTranslation();

    return (
        <main style={{ padding: "2rem" }}>
            <h2>{t("error.title")}</h2>
            <p>{t("error.body")}</p>
            <details>
                <summary>{t("error.details")}</summary>
                <pre>{error.message}</pre>
            </details>
        </main>
    );
}

export class ErrorBoundary extends Component {
    state = { error: null };

    static getDerivedStateFromError(error) {
        return { error };
    }

    render() {
        if (this.state.error) {
            return <ErrorFallback error={this.state.error} />;
        }
        return this.props.children;
    }
}
