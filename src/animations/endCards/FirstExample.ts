import { Container, Mesh, Shader, Sprite, Text, Texture, type IPointData } from "pixi.js";
import { Easing, Tween, tweenGroup, wait, waitAsync, yoyo } from "../../core/tweenGroup";

import type { ProductCard } from "./ProductCard";
// import { CrackVFX } from "./CrackVFX";

export class FirstExample {
    public view = new Container();

    private _title: Sprite;
    private _backBtn: Sprite;
    private _cards: ProductCard[] = [];
    // private _cracks: CrackVFX[] = [];
    private _finalPositions: IPointData[] = [];

    constructor(cards: ProductCard[], titleTexture: Texture, btnTexture: Texture) {

        this._cards = [...cards];
        // this._cracks = [new CrackVFX(), new CrackVFX(), new CrackVFX()]
        this.view.addChild(...cards.map(c => c.view).reverse());
        // this.view.addChild(...this._cracks.map(c => c.view).reverse());

        this._cards.forEach((card, i) => {
            const x = -300 + 300 * i;
            const y = 0;
            card.view.visible = false;
            card.view.scale.set(0);
            // this._cracks[i].view.position.set(x, y)
            this._finalPositions.push({ x, y });
        });


        this._title = this.view.addChild(new Sprite(titleTexture));
        this._title.anchor.set(0.5);
        this._title.scale.set(0.62);
        this._title.position.set(0, -450);
        this._title.pivot.set(0, 600);

        this._backBtn = this.view.addChild(new Sprite(btnTexture));
        this._backBtn.anchor.set(0.5);
        this._backBtn.scale.set(1.8);
        this._backBtn.position.set(0, 450);
        this._backBtn.pivot.set(0, -450);

        const buttonText = this._backBtn.addChild(new Text('Close', {
            "align": "center",
            "fill": [
                "#fff9b3",
                "#fdbb10"
            ],
            "fillGradientStops": [
                0.5
            ],
            "fontFamily": "Tahoma",
            "fontSize": 50,
            "fontWeight": "bold",
            "stroke": "#6b2002",
            "strokeThickness": 6,
            "wordWrap": true,
            "wordWrapWidth": 600
        }));
        buttonText.anchor.set(0.5);
        buttonText.scale.set(0.6);
        buttonText.position.set(0, -4);

    }

    private _showByPivot(el: Container, duration: number, easing: any) {
        return new Tween(el.pivot, tweenGroup)
            .to({ x: 0, y: 0 }, duration)
            .easing(easing)
            .start()
    }
    private _shake() {
        const amplitude = 10;
        const frequency = 10;

        return new Tween({ value: 0 }, tweenGroup)
            .to({ value: [1, -1] }, 100)
            .easing(t => Math.sin(t * frequency))
            .onUpdate(({ value }) => {
                this.view.position.set(
                    Math.sin(value * Math.PI * frequency) * amplitude,
                    Math.cos(value * Math.PI * frequency) * amplitude
                )
            })
    }
    async play() {
        this._showByPivot(this._title, 650, Easing.Elastic.Out)

        await waitAsync(300)

        for (let i = 0; i < 3; i++) {
            const card = this._cards[i];
            const finalPoint = this._finalPositions[i];
            // const [first, second] = card.flip(300);
            // first.delay(300).start();

            card.view.visible = true;
            const moveTw = card.move(
                { x: 0, y: 0 },
                { x: [0, finalPoint.x / 1.5, finalPoint.x], y: [0, 300, finalPoint.y] },
            );
            const scaleTw = card.scale(
                { x: 0, y: 0 },
                { x: 1, y: 1 },
            );

            // moveTw.delay(i * 400);
            // scaleTw.delay(i * 400);
            moveTw.chain(this._shake())
            moveTw.start();
            scaleTw.start();
            await waitAsync(400)


        }

        await waitAsync(1200)

        this._showByPivot(this._backBtn, 800, Easing.Back.Out)
    }
}