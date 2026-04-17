import { BaseCardsDeck, type CardsDeckProps } from "../baseClasses/BaseCardsDeck";
import type { AnimatedCard } from "./AnimatedCard";
import { Easing, Tween, tweenGroup, wait, waitAsync } from "../tweens/tweenGroup";
import { Graphics, Rectangle, type IPointData } from "pixi.js";
import { Button } from "./Button";

export class SlideInShuffle extends BaseCardsDeck<AnimatedCard> {

    private _tweens: Tween[] = [];
    constructor(props: CardsDeckProps<AnimatedCard>) {
        super(props);

        this._cards.forEach(card => card.view.scale.set(1.5));
        this.stack();

        this._fromContainer.position.set(-100, 0);


        const button = new Button();
        button.view.position.set(-50, 100);
        this.view.addChild(button.view);


        button.view.on("mouseover", () => {
            this.shuffle(() => {

            });

        })
        button.view.on('mouseleave', () => {
        });

        const rect = new Graphics();
        rect.beginFill(0x00ff00);
        rect.drawRect(-200, -120, 400, 220);
        rect.endFill();
        this.view.addChild(rect);

        this._fromContainer.mask = rect;
    }

    public stack(onFinish?: () => void): void {
        this._cards.forEach((card, i) => {
            card.view.position.set(20 * (i % 8), 200)
        });
        onFinish && onFinish();
    }


    public shuffle(onFinish?: () => void): void {
        this._tweens.forEach(tw => {
            tw.stop();
            tweenGroup.remove(tw);
        })
        this._tweens.length = 0;

        this.stack();

        const amount = 8;
        const cards = this._cards.slice(0, amount);
        cards[cards.length - 1].reset();

        for (let i = 0; i < cards.length; i++) {
            const card = cards[i];
            const tw = new Tween(card.view.position, tweenGroup)
                .to({ x: card.view.x, y: 0 }, 500)
                .delay(i * 180)
                .easing(Easing.Back.Out)
                .start();
            this._tweens.push(tw)
        }
        const lastTw = this._tweens[this._tweens.length - 1];

        const tw = new Tween({ val: 0 }, tweenGroup)
            .to({ val: 1 }, 200)
            .onComplete(() => {
                cards[cards.length - 1].jump(600);
                cards[cards.length - 1].flip(600);
            })

        lastTw.chain(tw)
    }


}