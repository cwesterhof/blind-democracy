import { useState } from "react";

const PASSPHRASE = import.meta.env.VITE_EDITORIAL_PASSPHRASE;

export default function EditorialLoginPage({ onUnlock }) {
    const [value, setValue] = useState("");
    const [error, setError] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        if (PASSPHRASE && value === PASSPHRASE) {
            try {
                sessionStorage.setItem("blind-democracy.editorial-session", "1");
            } catch {
                // sessionStorage unavailable — proceed anyway
            }
            onUnlock();
        } else {
            setError(true);
            setValue("");
        }
    }

    return (
        <main className="reliability-page editorial-login-page">
            <section className="editorial-login-card">
                <p className="eyebrow">Redactie</p>
                <h1>Redactionele toegang</h1>
                <p>Voer de toegangscode in om de redactionele hub te openen.</p>

                <form className="editorial-login-form" onSubmit={handleSubmit}>
                    <input
                        autoComplete="current-password"
                        autoFocus
                        className={error ? "editorial-login-input error" : "editorial-login-input"}
                        onChange={(e) => { setValue(e.target.value); setError(false); }}
                        placeholder="Toegangscode"
                        type="password"
                        value={value}
                    />
                    {error && (
                        <p className="editorial-login-error">
                            {PASSPHRASE ? "Toegangscode onjuist." : "Geen toegangscode geconfigureerd (VITE_EDITORIAL_PASSPHRASE)."}
                        </p>
                    )}
                    <button className="editorial-login-submit" type="submit">
                        Toegang verlenen
                    </button>
                </form>
            </section>
        </main>
    );
}
