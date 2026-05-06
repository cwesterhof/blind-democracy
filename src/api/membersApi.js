import data from "../data/members.json";

export function fetchMembers() {
    return Promise.resolve(data);
}