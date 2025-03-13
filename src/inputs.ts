import type { Input } from "./model";

export const bcFull: Input = {
    name: "Bakalář komplet",
    parts: [
        {
            name: "Prezentace",
            duration: 10,
            color: "#76f377"
        }, {
            name: "Posudky & diskuse",
            duration: 5,
            color: "#59bb69"
        }, {
            name: "Otázka 1",
            duration: 5,
            color: "#f9a146"
        }, {
            name: "Otázka 2",
            duration: 5,
            color: "#c69635"
        }, {
            name: "Jednání",
            duration: 5,
            color: "#9da9e8"
        }
    ],
};

export const bcPrezOnly: Input = {
    name: "Bakalář jen obhajoba",
    parts: [
        {
            name: "Prezentace",
            duration: 10,
            color: "#76f377"
        }, {
            name: "Posudky & diskuse",
            duration: 5,
            color: "#59bb69"
        }, {
            name: "Jednání",
            duration: 5,
            color: "#9da9e8"
        }
    ],
};

export const bcExamOnly: Input = {
    name: "Bakalář jen zkoušení",
    parts: [
        {
            name: "Otázka 1",
            duration: 5,
            color: "#f9a146"
        }, {
            name: "Otázka 2",
            duration: 5,
            color: "#c69635"
        }, {
            name: "Jednání",
            duration: 5,
            color: "#9da9e8"
        }
    ],
};

export const mgrFull: Input = {
    name: "Magistr komplet",
    parts: [
        {
            name: "Prezentace",
            duration: 15,
            color: "#76f377"
        }, {
            name: "Posudky & diskuse",
            duration: 5,
            color: "#59bb69"
        }, {
            name: "Otázka 1",
            duration: 5,
            color: "#f9a146"
        }, {
            name: "Otázka 2",
            duration: 5,
            color: "#c69635"
        }, {
            name: "Jednání",
            duration: 5,
            color: "#9da9e8"
        }
    ],
};

export const mgrPrezOnly: Input = {
    name: "Magistr jen prezentace",
    parts: [
        {
            name: "Prezentace",
            duration: 15,
            color: "#76f377"
        }, {
            name: "Posudky & diskuse",
            duration: 5,
            color: "#59bb69"
        }, {
            name: "Jednání",
            duration: 5,
            color: "#9da9e8"
        }
    ],
};

export const mgrExamOnly: Input = {
    name: "Magistr jen zkoušení",
    parts: [
        {
            name: "Otázka 1",
            duration: 5,
            color: "#f9a146"
        }, {
            name: "Otázka 2",
            duration: 5,
            color: "#c69635"
        }, {
            name: "Jednání",
            duration: 5,
            color: "#9da9e8"
        }
    ],
};
