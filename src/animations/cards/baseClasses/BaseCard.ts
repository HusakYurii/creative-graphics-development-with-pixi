import { Container, Sprite, type Texture } from "pixi.js";

export interface BaseCardProps {
    back: Texture;
    front: Texture;
    id: string;
}

export class BaseCard {
    public id: string; // this is the card id
    public view: Container;

    public body: Container;
    public back: Sprite;
    public front: Sprite;
    public shadow: Sprite;
    public isOpen: boolean = false;

    constructor({ back, front, id }: BaseCardProps) {
        this.id = id;
        this.view = new Container();

        this.shadow = this.view.addChild(new Sprite(back));
        this.shadow.anchor.set(0.5);
        this.shadow.scale.set(0.95);
        this.shadow.tint = 0x000000;
        this.shadow.alpha = 0.7;

        this.body = this.view.addChild(new Container());

        this.back = this.body.addChild(new Sprite(back));
        this.back.anchor.set(0.5);

        this.front = this.body.addChild(new Sprite(front));
        this.front.anchor.set(0.5);

        this.front.visible = this.isOpen;
        this.back.visible = !this.isOpen;
    }
}