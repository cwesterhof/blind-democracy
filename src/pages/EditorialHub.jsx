import { useState } from "react";
import PositionReviewPage from "./PositionReviewPage";
import PromiseVoteReviewPage from "./PromiseVoteReviewPage";

export default function EditorialHub() {
    const [activeTab, setActiveTab] = useState("standpunten");

    return (
        <>
            <section className="hub-tabs" aria-label="Redactie onderdelen">
                <button className={activeTab === "standpunten" ? "active" : ""} onClick={() => setActiveTab("standpunten")} type="button">
                    Standpunten
                </button>
                <button className={activeTab === "stemreview" ? "active" : ""} onClick={() => setActiveTab("stemreview")} type="button">
                    Stemkoppelingen
                </button>
            </section>
            {activeTab === "standpunten" && <PositionReviewPage />}
            {activeTab === "stemreview" && <PromiseVoteReviewPage />}
        </>
    );
}
