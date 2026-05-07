import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const SLIDE_TONES = ["blind", "votes", "truth", "evidence"];
const SLIDE_PAGES = ["blind", "betrouwbaarheid", "leugens", "methode"];

export default function HeroSlider({ setPage, paused }) {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);

    const slides = [
        { eyebrow: t("hero.eyebrow1"), title: t("hero.title1"), text: t("hero.text1"), cta: t("hero.cta1"), tone: SLIDE_TONES[0], targetPage: SLIDE_PAGES[0] },
        { eyebrow: t("hero.eyebrow2"), title: t("hero.title2"), text: t("hero.text2"), cta: t("hero.cta2"), tone: SLIDE_TONES[1], targetPage: SLIDE_PAGES[1] },
        { eyebrow: t("hero.eyebrow3"), title: t("hero.title3"), text: t("hero.text3"), cta: t("hero.cta3"), tone: SLIDE_TONES[2], targetPage: SLIDE_PAGES[2] },
        { eyebrow: t("hero.eyebrow4"), title: t("hero.title4"), text: t("hero.text4"), cta: t("hero.cta4"), tone: SLIDE_TONES[3], targetPage: SLIDE_PAGES[3] },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            if (!paused) {
                setActiveIndex((current) => (current + 1) % slides.length);
            }
        }, 7000);

        return () => clearInterval(timer);
    }, [paused]);

    function handleCtaClick(targetPage) {
        setPage(targetPage);
        if (targetPage === "blind") {
            setTimeout(() => {
                document.querySelector(".match-workspace")?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }, 150);
        }
    }

    return (
        <header className="hero-slider" aria-label="Blind Democracy introductie">
            {slides.map((slide, index) => (
                <section
                    aria-hidden={activeIndex !== index}
                    className={activeIndex === index ? "hero-slide active" : "hero-slide"}
                    key={slide.tone}
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
                {slides.map((slide, index) => (
                    <button
                        aria-label={`${slide.eyebrow}`}
                        className={activeIndex === index ? "active" : ""}
                        key={slide.tone}
                        onClick={() => setActiveIndex(index)}
                        type="button"
                    />
                ))}
            </div>
        </header>
    );
}
