import { useEffect, useState } from "react";

const HERO_SLIDES = [
    {
        eyebrow: "Blind kiezen",
        title: "Kies eerst het beleid. Zie daarna pas de partij.",
        text: "Geen logo’s, kleuren of gezichten. Alleen de inhoud telt.",
        cta: "Start de blind test",
        tone: "blind",
        targetPage: "blind"
    },
    {
        eyebrow: "Stemgedrag telt",
        title: "Zie wat partijen écht doen.",
        text: "Vergelijk verkiezingsbeloftes met daadwerkelijk stemgedrag.",
        cta: "Bekijk stemgedrag",
        tone: "votes",
        targetPage: "onderwerpen"
    },
    {
        eyebrow: "De Leugendetector",
        title: "Waar breken partijen hun beloftes?",
        text: "Ontdek welke partijen anders stemmen dan ze aan kiezers beloofden.",
        cta: "Open de leugendetector",
        tone: "truth",
        targetPage: "leugens"
    },
    {
        eyebrow: "Feiten boven framing",
        title: "Feiten, bronnen en context.",
        text: "Elke claim krijgt bronvermelding, bewijsniveau en uitleg over impact.",
        cta: "Lees de methode",
        tone: "evidence",
        targetPage: "methode"
    }
];

export default function HeroSlider({ setPage }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((current) => (current + 1) % HERO_SLIDES.length);
        }, 7000);

        return () => clearInterval(timer);
    }, []);

    function handleCtaClick(targetPage) {
        console.log("Hero CTA clicked:", targetPage);

        if (targetPage && targetPage !== "blind") {
            setPage(targetPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        document.querySelector(".test-shell")?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    return (
        <header className="hero-slider" aria-label="Blind Democracy introductie">
            {HERO_SLIDES.map((slide, index) => (
                <section
                    aria-hidden={activeIndex !== index}
                    className={activeIndex === index ? "hero-slide active" : "hero-slide"}
                    key={slide.eyebrow}
                >
                    <div className={`hero-slide-bg tone-${slide.tone}`} />
                    <div className="hero-slide-overlay" />

                    <div className="hero-slide-content">
                        <p className="eyebrow">{slide.eyebrow}</p>
                        <h1>{slide.title}</h1>
                        <p>{slide.text}</p>

                        <button className="hero-cta" onClick={() => handleCtaClick(slide.targetPage)} type="button">
                            {slide.cta}
                        </button>
                    </div>
                </section>
            ))}

            <div className="hero-slider-dots" aria-label="Hero slides">
                {HERO_SLIDES.map((slide, index) => (
                    <button
                        aria-label={`Toon slide: ${slide.eyebrow}`}
                        className={activeIndex === index ? "active" : ""}
                        key={slide.eyebrow}
                        onClick={() => setActiveIndex(index)}
                        type="button"
                    />
                ))}
            </div>
        </header>
    );
}