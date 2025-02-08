import _ from "lodash";
import {match} from "ts-pattern";
import type {Input, Part} from "./model";
import { totalDuration } from "./model";
import inputBc from "./input-bc";
import inputMgr from "./input-mgr";

const wh = window.innerHeight - 50;

const barXOffset = 50;
const barYOffset = 50;
const barWidth = 200;
const barHeight = wh - barYOffset * 2;
const barX2 = barXOffset + barWidth;

const pointerX1 = barXOffset - 20;
const pointerX2 = barX2 + 20;
let pointerY = barYOffset;

let startTime = Date.now();
let timeOffsetSec = 0;

type PartInfo = Part & {
    start: number;
    end: number;
};

type Rectangle = {
    y1: number;
    y2: number;
    color: string;
    name: string;
};

type Data = {
    modelName: string;
    totalDurationInSecs: number;
    yPerSec: number;
    rectangles: Rectangle[];
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
    function drawBar() {
        data.rectangles.forEach((rect) => {
            ctx.fillStyle = rect.color;
            ctx.fillRect(barXOffset, rect.y1, barWidth, rect.y2 - rect.y1);
            // Render label
            ctx.fillStyle = "#101010";
            ctx.font = "20px Arial";
            ctx.fillText(rect.name, barXOffset + 10, rect.y1 + 30);
        });
    }

    getModelLabelEl().innerText = data.modelName;
    const now = Date.now();
    const elapsed = Math.round((now + (timeOffsetSec * 1000) - startTime) / 1000);
    pointerY = barYOffset + elapsed * data.yPerSec;
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBar();

    ctx.beginPath();
    ctx.moveTo(pointerX1, pointerY);
    ctx.lineTo(pointerX2, pointerY);
    ctx.stroke();
    ctx.closePath();
}

function getInput(): Input {
    const selected = getModelSelectEl().value;
    console.log(selected);
    return match(getModelSelectEl().value)
        .with("bachelor", () => inputBc)
        .with("master", () => inputMgr)
        .otherwise(() => { throw new Error("Unknown model"); });
}

function resetTime() {
    const val = getInputEl().valueAsNumber;
    startTime = Date.now();
    timeOffsetSec = val * 60;
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

    const rectangles: Rectangle[] = partsInfos.map((info) => ({
        y1: Math.round(barYOffset + yPerMinute * info.start),
        y2: Math.round(barYOffset + yPerMinute * info.end),
        color: info.color,
        name: info.name,
    }));

    return {
        modelName: input.name,
        totalDurationInSecs: totalDurationInMins * 60,
        yPerSec: yPerMinute / 60,
        rectangles,
    };

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
