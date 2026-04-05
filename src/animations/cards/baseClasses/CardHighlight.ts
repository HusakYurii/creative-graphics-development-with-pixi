import { AnimatedSprite, Container, type Texture } from "pixi.js";

interface CardHighlightProps {
    textures: Texture[];

}
export class CardHighlight {
    public view: Container;
    private _animatedSprite: AnimatedSprite;


    constructor({ textures }: CardHighlightProps) {
        this.view = new Container();

        this._animatedSprite = new AnimatedSprite(textures);
        this._animatedSprite.anchor.set(0.5);
        this._animatedSprite.play();
        this._animatedSprite.animationSpeed = 0.3;
        this.view.addChild(this._animatedSprite);
    }
}