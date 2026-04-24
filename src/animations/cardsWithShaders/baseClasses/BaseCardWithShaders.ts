import { Container, Mesh, Shader, type IPointData, type Texture } from "pixi.js";
import { imageByShaderWithPerspective } from "./imageByShaderWithPerspective";

export interface BaseCardWithShadersProps {
    back: Texture;
    front: Texture;
    shadow: Texture;
    id: string;
}

export abstract class BaseCardWithShaders {
    public id: string; // this is the card id
    public view: Container;

    public body: Container;
    public back: Mesh<Shader>;
    public front: Mesh<Shader>;
    public shadow: Container;
    public isOpen: boolean = false;

    constructor({ back, front, shadow, id }: BaseCardWithShadersProps) {
        this.id = id;
        this.view = new Container();



        const actualShadowSprite = imageByShaderWithPerspective(shadow);
        // actualShadowSprite.anchor.set(0.5);
        actualShadowSprite.tint = 0x000000;
        actualShadowSprite.alpha = 0.7;
        actualShadowSprite.scale.set(0.95);

        this.shadow = this.view.addChild(new Container());
        this.shadow.addChild(actualShadowSprite);

        this.body = this.view.addChild(new Container());

        this.back = this.body.addChild(imageByShaderWithPerspective(back));
        // this.back.anchor.set(0.5);

        this.front = this.body.addChild(imageByShaderWithPerspective(front));
        // this.front.anchor.set(0.5);

        this.front.visible = this.isOpen;
        this.back.visible = !this.isOpen;
    }
    reset() {
        this.isOpen = false;
        this.front.visible = this.isOpen;
        this.back.visible = !this.isOpen;
    }
    abstract flip(): void;
    abstract unflip(): void;
    abstract move(to: IPointData): void
    abstract unmove(): void;
    abstract jump(): void;
}