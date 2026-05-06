import { RELIABILITY_DIMENSIONS } from "../data/reliability";

export default function MethodPage() {
    return (
        <main className="reliability-page method-page">
            <header className="page-heading">
                <p className="eyebrow">Methode</p>
                <h1>Geen zwarte doos</h1>
                <p>
                    De meter bestaat uit vier lagen: stemgedrag, standpunt-herkomst, belofte versus stem en claim-accuratesse.
                    Alleen stemgedrag en deels standpunt-herkomst zijn nu aangesloten. De rest blijft expliciet open.
                </p>
            </header>

            <section className="metric-legend method-grid">
                {RELIABILITY_DIMENSIONS.map((dimension) => (
                    <article key={dimension.id}>
                        <strong>{dimension.label}</strong>
                        <p>{dimension.description}</p>
                    </article>
                ))}
            </section>
        </main>
    );
}
