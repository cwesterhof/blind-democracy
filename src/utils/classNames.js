export function cardClass(positionId, selectedPositionId, revealed) {
    const classes = ["blind-card"];

    if (selectedPositionId === positionId) classes.push("selected");
    if (selectedPositionId && selectedPositionId !== positionId) classes.push("dimmed");
    if (revealed) classes.push("revealed-card");

    return classes.join(" ");
}

export function dossierNavClass(active, answered) {
    const classes = ["dossier-button"];

    if (active) classes.push("active");
    if (answered) classes.push("answered");

    return classes.join(" ");
}
