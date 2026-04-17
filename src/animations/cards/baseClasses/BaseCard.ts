import { Container, Sprite, type IPointData, type Texture } from "pixi.js";

export interface BaseCardProps {
    back: Texture;
    front: Texture;
    id: string;
}

export abstract class BaseCard {
    public id: string; // this is the card id
    public view: Container;

    public body: Container;
    public back: Sprite;
    public front: Sprite;
    public shadow: Container;
    public isOpen: boolean = false;

    constructor({ back, front, id }: BaseCardProps) {
        this.id = id;
        this.view = new Container();

        const actualShadowSprite = new Sprite(back);
        actualShadowSprite.anchor.set(0.5);
        actualShadowSprite.tint = 0x000000;
        actualShadowSprite.alpha = 0.7;
        actualShadowSprite.scale.set(0.95);

        this.shadow = this.view.addChild(new Container());
        this.shadow.addChild(actualShadowSprite);

        this.body = this.view.addChild(new Container());

        this.back = this.body.addChild(new Sprite(back));
        this.back.anchor.set(0.5);

        this.front = this.body.addChild(new Sprite(front));
        this.front.anchor.set(0.5);

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