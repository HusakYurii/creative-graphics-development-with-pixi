import { Geometry } from "pixi.js";

export const createPlaneGeometry = (w: number, h: number) => {
    return new Geometry()
        .addAttribute(
            'aVertexPosition', // the attribute name
            [
                -w / 2, -h / 2, // x, y
                w / 2, -h / 2, // x, y
                w / 2, h / 2,
                -w / 2, h / 2,
            ], // x, y
            2,
        ) // the size of the attribute
        .addAttribute(
            'aUv', // the attribute name
            [
                0, 0, // u, v
                1, 0, // u, v
                1, 1,
                0, 1,
            ], // u, v
            2,
        ) // the size of the attribute
        .addIndex([0, 1, 2, 0, 2, 3]);
}