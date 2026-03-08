export function transpileTGLSLtoGLSL(source: string): string {
    let glsl = source;

    // 1. Convert Function Signatures
    // Matches: function name(args): type {
    // Captures: 1: name, 2: args, 3: returnType
    glsl = glsl.replace(
        /function\s+(\w+)\s*\(([\s\S]*?)\)\s*:\s*(\w+)/g,
        (_, name, args, returnType) => {
            // Process the arguments inside the function parentheses
            const processedArgs = args.replace(
                /(\w+)\s*:\s*(\w+)/g,
                '$2 $1'
            );
            return `${returnType} ${name}(${processedArgs})`;
        }
    );

    // 2. Convert Uniforms, Varyings, and Attributes
    // Matches: uniform name: type;
    // Captures: 1: qualifier, 2: name, 3: type
    glsl = glsl.replace(
        /^(uniform|varying|attribute)\s+(\w+)\s*:\s*(\w+)/gm,
        '$1 $3 $2'
    );

    // 3. Convert Local Variables (var name: type)
    // Matches: var name: type
    // Captures: 1: name, 2: type
    glsl = glsl.replace(
        /\bvar\s+(\w+)\s*:\s*(\w+)/g,
        '$2 $1'
    );

    // 4. Handle specific "void" cases (like function main(void))
    // If we find (void) after our swap, it might look like (void void), so we clean it
    glsl = glsl.replace(/\(\s*void\s+void\s*\)/g, '(void)');

    // 5. Cleanup remaining TypeScript-isms
    // Map 'number' to 'float' if used in TS style
    glsl = glsl.replace(/\bfloat\b/g, 'float'); // already correct
    glsl = glsl.replace(/\bint\b/g, 'int');

    return glsl.trim();
}