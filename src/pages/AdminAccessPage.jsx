export default function AdminAccessPage() {
    return (
        <main className="reliability-page admin-access-page">
            <section className="admin-access-card">
                <p className="eyebrow">Admin / moderatie</p>
                <h1>Redactie is afgeschermd</h1>
                <p>
                    Deze omgeving is afgeschermd achter Supabase Auth en rolrechten.
                </p>
            </section>
        </main>
    );
}
