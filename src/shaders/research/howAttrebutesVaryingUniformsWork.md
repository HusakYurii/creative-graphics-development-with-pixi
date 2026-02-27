- Attrebutes are provided by the CPU to vertex shader only. Attrebutes carry unique values per vertex.
- Varying are defined in vertex shader, so it can pass data to fragment shader. Varying data gets interpolated automatically per pixel.
- Uniforms are constant values during a draw call and are available in both shaders

Summary table
| Type      | Set by        | Read by Vertex | Read by Fragment | Changes per |
| --------- | ------------- | -------------- | ---------------- | ----------- |
| attribute | CPU           | YES            | NO               | vertex      |
| uniform   | CPU           | YES            | YES              | draw call   |
| varying   | vertex shader | YES (write)    | YES (read)       | pixel       |
