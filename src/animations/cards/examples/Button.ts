import { Container, Graphics, Rectangle, Text } from "pixi.js";

export class Button {
    public view: Container;

    constructor() {
        this.view = new Container();

        const text = new Text('Hover to Play', {
            fontSize: 18,
            fill: '#ffffff',
            align: 'center',
        });
        text.anchor.set(0.5);
        text.position.set(169 / 2, 36 / 2);

        const button = new Graphics();
        button.beginFill(0x3366ff);
        button.drawRoundedRect(0, 0, 169, 36, 8);
        button.endFill();

        this.view.addChild(button);
        this.view.addChild(text);

        this.view.hitArea = new Rectangle(0, 0, 169, 36)
        this.view.eventMode = 'static';
        this.view.interactiveChildren = false;
    }
}