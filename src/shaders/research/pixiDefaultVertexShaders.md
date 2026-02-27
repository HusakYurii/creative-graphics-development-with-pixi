#### PIXI.js v7 has two default vertex shaders
---
The first one is `defaultVergtex` and it is a string constant which gets exported from the PIXI library and is being used as "Standard object rendering shader".

```glsl
attribute vec2 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

void main(void)
{
    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
    vTextureCoord = aTextureCoord;
}
```

Which is used when drawing:
- Sprites
- Meshes
- Graphics
- Text
- Etc. anything drawn normally

The common attributes per vertex are bing passed dirrectly from geometry buffers of an object
```glsl
attribute vec2 aVertexPosition; // actual pixes of an pixi object
attribute vec2 aTextureCoord; // normilized pixes which produce range form 0 to 1
```

Also it gets a default `projectionMatrix` uniform for a standard GPU transformation of visible object from World space → Clip space (from what is in the scene to what you can actually see)

```glsl
uniform projectionMatrix;

// here each pixel gets converted via projeection matrix
gl_Position = projectionMatrix * vec3(aVertexPosition, 1.0)
```

And the `variyng` is what gets passed from vertex shader to a fragment shader. We sometinmes do that if we need some data which is related to attributes which are available only in vertex shader

```glsl
// basically copies whatever is in aTextureCoord to make it available in fragment shader
varying vec2 vTextureCoord; 
```

__IMPORTANT ⚠️__

Those attributes start at `{ x: 0 , y: 0 }` which is TOP-LEFT corner of a pixi object. For example if we have a sprite with sizes of `{ width: 250, height: 150 }`, the shader program for a pixel in the middle will get `aVertexPosition` as `{ x: 125, y: 75 }` and `aTextureCoord` as `{ x: 0.5, y: 0.5 }` and so on.


__Example__
Here I create a plane using graphics and color pixes which start form top-left until they are in the radius of 0.5 (half of the pixi object size)
```typescript
import { Filter, defaultVertex } from 'pixi.js';


const myFragmentShader = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;

    void main(void) {
        // we get a color from the current plane
        vec4 color = texture2D(uSampler, vTextureCoord); 

        // and modify only part of it
        if(length(vTextureCoord) < 0.5) {
            color = vec4(color.r * 0.5, color.g * 0.5, color.b * 0.5, color.a);
        }
        gl_FragColor = color;
    }
`;
// just pass default defaultVertex if you don't need anyting extra
const filter = new Filter(defaultVertex, myFragmentShader, {});

const graphics = new Graphics();
graphics.beginFill(0xffffff);
graphics.drawRect(-200, -200, 400, 400);
graphics.endFill();

graphics.filters = [filter];
app.stage.addChild(graphics);

```

The result in the browser

![The putput image](image.png)

---
The second default vertex shader is `defaultFilterVertex` and it is used only for "Filter system shader" - and it is also can be used in your custom filters - confusing right? This one is more complex because filters operate differently.

__Notice ⚠️__ There is NO aTextureCoord attribute - that's the key difference. Plus it has more uniforms



```glsl
attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;
varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
}

```

