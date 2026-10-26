import { Container, Sprite, Text, Texture, type IPointData } from "pixi.js";
import { Easing, Interpolation, Tween, tweenGroup } from "../../core/tweenGroup";

export interface ProductCardProps {
    background: Texture;
    content: Texture;
    button: Texture;
    coinIcon: Texture;
    item: string;
    price: string;
}

interface Value {
    value: number;
}

export class ProductCard {
    public view = new Container();

    private _front = new Container();
    private _back = new Container();
    private _isOpen = true;

    constructor(props: ProductCardProps) {
        this.view.addChild(this._back, this._front);

        const backBg = this._back.addChild(new Sprite(props.background));
        backBg.anchor.set(0.5);

        const bg = this._front.addChild(new Sprite(props.background));
        bg.anchor.set(0.5);

        const content = this._front.addChild(new Sprite(props.content));
        content.anchor.set(0.5);
        content.scale.set(0.8);
        content.position.set(0, -45)

        const button = this._front.addChild(new Sprite(props.button));
        button.anchor.set(0.5);
        button.scale.x = 0.9;
        button.position.set(0, 140);

        const buttonText = this._front.addChild(new Text('BUY', {
            "fill": "#dacdcd",
            "fontFamily": "Tahoma",
            "fontSize": 48,
            "fontWeight": "bold",
            "strokeThickness": 4
        }));
        buttonText.anchor.set(0.5);
        buttonText.scale.set(0.6);
        buttonText.position.set(0, 138);

        const coinIcon = this._front.addChild(new Sprite(props.coinIcon));
        coinIcon.anchor.set(0.5);
        coinIcon.scale.set(0.4);
        coinIcon.position.set(-25, 86);

        const price = this._front.addChild(new Text(props.price, {
            "fill": "#d56c6c",
            "fontFamily": "Comic Sans MS",
            "fontSize": 48,
            "fontWeight": "bold"
        }));
        price.anchor.set(0.5);
        price.scale.set(0.5);
        price.position.set(14, 85);

        const itemName = this._front.addChild(new Text(props.item, {
            "fill": "#2e2626",
            "fontFamily": "Comic Sans MS",
            "fontSize": 48,
            "fontWeight": "bold"
        }));
        itemName.anchor.set(0.5);
        itemName.scale.set(0.6);
        itemName.position.set(0, 50);

        this._front.visible = this._isOpen;
        this._back.visible = !this._isOpen;
    }

    private _flipTween(from: Value, to: Value, duration: number, skewSide: number) {
        const skewMagnitude = 0.3;

        return new Tween(from, tweenGroup)
            .to(to, duration)
            .easing(Easing.Quadratic.InOut)
            .onUpdate(({ value }) => {
                this._front.scale.x = value;
                this._back.scale.x = value;

                this._front.skew.y = (1 - value) * skewSide * skewMagnitude;
                this._back.skew.y = (1 - value) * skewSide * skewMagnitude;
            })
    }

    flip(duration = 300) {

        this._isOpen = !this._isOpen;

        const first = this._flipTween({ value: 1 }, { value: 0 }, duration / 2, 1);
        const second = this._flipTween({ value: 0 }, { value: 1 }, duration / 2, -1);

        second
            .onStart(() => {
                this._front.visible = this._isOpen;
                this._back.visible = !this._isOpen;
            })
            .easing(Easing.Quadratic.InOut)


        first.chain(second);

        return [first, second];
    }

    move(from: IPointData, to: { x: number[], y: number[] }, duration = 500, easing = Easing.Quintic.In) {
        return new Tween(from, tweenGroup)
            .to(to, duration)
            .easing(easing)
            .interpolation(Interpolation.Bezier)
            .onUpdate(({ x, y }) => {
                this.view.position.set(x, y);
            });
    }

    scale(from: IPointData, to: IPointData, duration = 500, easing = Easing.Quintic.In) {
        return new Tween(from, tweenGroup)
            .to(to, duration)
            .easing(easing)
            .onUpdate(({ x, y }) => {
                this.view.scale.set(x, y);
            });
    }
}