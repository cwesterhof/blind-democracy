import data from "../data/members.json";

export function fetchMembers() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(data);
        }, 500);
    });
}