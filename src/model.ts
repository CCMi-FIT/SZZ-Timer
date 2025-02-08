export type Part = {
    name: string;
    duration: number; // Duration in minutes
    color: string;
}

export type Input = {
    name: string;
    parts: Part[];
}

export function totalDuration(parts: Part[]): number {
    return parts.reduce(
        (sum, part) => sum + part.duration,
        0
    );
}
