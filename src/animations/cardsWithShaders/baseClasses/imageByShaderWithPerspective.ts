import { Geometry, Shader, Mesh, Matrix, Texture } from "pixi.js";


export const imageByShaderWithPerspective = (texture: Texture) => {
    const h = texture.height;
    const w = texture.width;

    const geometry = new Geometry()
        .addAttribute('aVertexPosition', [
            -w / 2, -h / 2, // Top Left
            w / 2, -h / 2, // Top Right
            w / 2, h / 2, // Bottom Right
            -w / 2, h / 2, // Bottom Left
        ], 2)
        .addAttribute('aUvs', [0, 0, 1, 0, 1, 1, 0, 1], 2)
        .addIndex([0, 1, 2, 0, 2, 3]);

    const vertexSrc = `
        attribute vec2 aVertexPosition;
        attribute vec2 aUvs;

        uniform mat3 translationMatrix;
        uniform mat3 projectionMatrix;

        uniform float uRotateX; // Rotation in radians
        uniform float uPerspective; // Perspective strength (try 0.002 to 0.005)

        varying vec2 vUvs;

        void main() {
            vUvs = aUvs;

            // 1. Start with local position
            vec3 pos = vec3(aVertexPosition, 0.0);

            // 2. Apply X-axis rotation manually
            // y' = y * cos(angle) - z * sin(angle)
            // z' = y * sin(angle) + z * cos(angle)
            float cosX = cos(uRotateX);
            float sinX = sin(uRotateX);
            
            float rotatedY = pos.y * cosX;
            float rotatedZ = pos.y * sinX; // Since pos.z was 0

            // 3. Apply Perspective (The "Divide by Z" trick)
            // We adjust the scale based on how far the vertex "tilted" away
            float perspectiveFactor = 1.0 + (rotatedZ * uPerspective);
            
            // Apply perspective to X and Y, and keep Z for depth if needed
            vec3 finalPos = vec3(pos.x / perspectiveFactor, rotatedY / perspectiveFactor, rotatedZ);

            // 4. Pass to PIXI's standard 2D matrices
            gl_Position = vec4((projectionMatrix * translationMatrix * vec3(finalPos.xy, 1.0)).xy, 0.0, 1.0);
        }
    `;

    const fragmentSrc = `
        precision mediump float;
        varying vec2 vUvs;
        uniform sampler2D uTexture;

        void main() {
            gl_FragColor = texture2D(uTexture, vUvs);
        }
    `;

    const uniforms = {
        uTexture: texture,
         uRotateX: -0.91,        // Tilt the card
         uPerspective: 0.0015,  // Strength of the 3D effect
    };


    const shader = Shader.from(vertexSrc, fragmentSrc, uniforms);
    return new Mesh(geometry, shader);
};


// export const imageByShaderWithPerspective = (texture: Texture) => {
//     const h = texture.height;
//     const w = texture.width;

//     const geometry = new Geometry()
//         .addAttribute('aVertexPosition', [
//             -w / 2, -h / 2, // Top Left
//             w / 2, -h / 2, // Top Right
//             w / 2, h / 2, // Bottom Right
//             -w / 2, h / 2, // Bottom Left
//         ], 2)
//         .addAttribute('aUvs', [0, 0, 1, 0, 1, 1, 0, 1], 2)
//         .addIndex([0, 1, 2, 0, 2, 3]);

//     const vertexSrc = `
//         precision mediump float;
//         attribute vec2 aVertexPosition;
//         attribute vec2 aUvs;

//         uniform mat3 translationMatrix;
//         uniform mat3 projectionMatrix;
//         uniform float uPitch; // Tilt forward/backward
        
//         varying vec2 vUvs;

//         void main() {
//             vUvs = aUvs;
            
//             // Pixi's standard 2D position
//             vec3 worldPos = projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0);
            
//             // Perspective Factor: This is a "fake" perspective trick
//             // We modify the Z based on the Y position to simulate depth
//             float z = 1.0 + (worldPos.y * uPitch); 
            
//             gl_Position = vec4(worldPos.xy, 0.0, z);
//         }
//     `;

//     const fragmentSrc = `
//         precision mediump float;
//         varying vec2 vUvs;
//         uniform sampler2D uTexture;

//         void main() {
//             gl_FragColor = texture2D(uTexture, vUvs);
//         }
//     `;
//     const base = texture.baseTexture;
//     const frame = texture.frame;

//     const uFrame = [
//         frame.x / base.width,            // Start X
//         frame.y / base.height,           // Start Y
//         frame.width / base.width,        // Width ratio
//         frame.height / base.height       // Height ratio
//     ];

//     const uniforms = {
//         uTexture: texture,
//         uPitch: 0.2,
//         uFrame: uFrame,
//         uTrapezoid: 0.085,
//         uHeight: frame.height, // Use frame height, not base texture height
//     };


//     const shader = Shader.from(vertexSrc, fragmentSrc, uniforms);
//     return new Mesh(geometry, shader);
// };