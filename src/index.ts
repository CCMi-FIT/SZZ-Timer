import _ from "lodash";
import {match} from "ts-pattern";
import type {Input, Part} from "./model";
import {totalDuration} from "./model";
import {bcFull, bcPrezOnly, bcExamOnly, mgrFull, mgrPrezOnly, mgrExamOnly} from "./inputs";

const wh = window.innerHeight - 50;

const barXOffset = 80;
const barYOffset = 50;
const barWidth = 200;
const barHeight = wh - barYOffset * 2;
const barX2 = barXOffset + barWidth;

const pointerX1 = barXOffset;
const pointerX2 = barX2;
let pointerY = barYOffset;

let startTime = Date.now();
let timeOffsetMs = 0;

type PartInfo = Part & {
    start: number;
    end: number;
};

type Section = {
    y1: number;
    y2: number;
    color: string;
    name: string;
    start: Date;
    duration: number;
};

type Data = {
    modelName: string;
    totalDurationInSecs: number;
    yPerSec: number;
    sections: Section[];
};


function getModelLabelEl(): HTMLHeadingElement {
    return document!.getElementById("model-label") as HTMLHeadingElement;
}

function getModelSelectEl(): HTMLSelectElement {
    return document!.getElementById("model-select") as HTMLSelectElement;
}

function getInputEl(): HTMLInputElement {
    return document!.getElementById("timeOffset") as HTMLInputElement;
}

function getStartButtonEl(): HTMLButtonElement {
    return document!.getElementById("startButton") as HTMLButtonElement;
}


function drawBar(
    data: Data,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    function drawSections() {
        data.sections.forEach((section) => {
            ctx.fillStyle = section.color;
            ctx.fillRect(barXOffset, section.y1, barWidth, section.y2 - section.y1);
            // Render label
            ctx.fillStyle = "#101010";
            ctx.font = "20px Arial";
            ctx.fillText(section.name, barXOffset + 10, section.y1 + 30);
            // Render duration
            ctx.font = "14px Arial";
            ctx.fillText(section.duration.toString() + " min", barXOffset - 50, section.y1 + (section.y2 - section.y1) / 2);
            // Render section time start
            ctx.fillText(section.start.toTimeString().slice(0, 5), barX2 +10, section.y1 + 5);
        });
    }

    getModelLabelEl().innerText = data.modelName;

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    pointerY = barYOffset + elapsed * data.yPerSec;
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSections();
    // Render last section end time
    const lastSection = _.last(data.sections)!;
    const endTime = new Date(lastSection.start.getTime() + lastSection.duration * 60 * 1000);
    ctx.fillStyle = "#101010";
    ctx.font = "14px Arial";
    ctx.fillText(endTime.toTimeString().slice(0, 5), barX2 +10, lastSection.y2 + 5);

    // Render pointer line
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pointerX1, pointerY);
    ctx.lineTo(pointerX2, pointerY);
    ctx.stroke();
    ctx.closePath();
}

function getInput(): Input {
    return match(getModelSelectEl().value)
        .with("bcFull", () => bcFull)
        .with("bcPrezOnly", () => bcPrezOnly)
        .with("bcExamOnly", () => bcExamOnly)
        .with("mgrFull", () => mgrFull)
        .with("mgrPrezOnly", () => mgrPrezOnly)
        .with("mgrExamOnly", () => mgrExamOnly)
        .otherwise(() => { throw new Error("Unknown model"); });
}

function mkData(): Data {
    const input = getInput();
    const partsInfos: PartInfo[] = input.parts.reduce(
        (infos: PartInfo[], part: Part) => {
            const newPartInfo =
                infos.length === 0
                    ? {
                        ...part,
                        start: 0,
                        end: part.duration,
                    }
                    : {
                        ...part,
                        start: _.last(infos)!.end,
                        end: _.last(infos)!.end + part.duration,
                    };
            return [...infos, newPartInfo];
        },
        [] as PartInfo[]
    );

    const totalDurationInMins = totalDuration(input.parts);

    const yPerMinute = barHeight / totalDurationInMins;

    let sectionStartTime = startTime;
    const sections: Section[] = partsInfos.map((info) => {
        const res: Section = {
            y1: Math.round(barYOffset + yPerMinute * info.start),
            y2: Math.round(barYOffset + yPerMinute * info.end),
            color: info.color,
            name: info.name,
            start: new Date(sectionStartTime),
            duration: info.duration,
        };
        sectionStartTime = sectionStartTime + (info.duration * 60 * 1000);
        return res;
    });

    return {
        modelName: input.name,
        totalDurationInSecs: totalDurationInMins * 60,
        yPerSec: yPerMinute / 60,
        sections,
    };

}

function resetTime() {
    const offsetMins = getInputEl().valueAsNumber;
    timeOffsetMs = offsetMins * 60 * 1000;
    startTime = Date.now() - timeOffsetMs;
}

function main(): void {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement | null;
    if (!canvas) {
        console.error("Did not find the #canvas element");
    } else {
        canvas.width = barWidth * 2;
        canvas.height = wh;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Getting canvas context failed");
        } else {
            setInterval(() => drawBar(mkData(), canvas, ctx), 200);
        }
    }
}


window!.addEventListener("load", () => (getStartButtonEl().onclick = resetTime));
main();
