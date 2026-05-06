import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    function changeLanguage(language) {
        i18n.changeLanguage(language);
    }

    return (
        <div className="language-switcher" aria-label="Taal kiezen">
            <button
                className={i18n.language === "nl" ? "active" : ""}
                onClick={() => changeLanguage("nl")}
                type="button"
            >
                NL
            </button>

            <span>/</span>

            <button
                className={i18n.language === "en" ? "active" : ""}
                onClick={() => changeLanguage("en")}
                type="button"
            >
                EN
            </button>
        </div>
    );
}