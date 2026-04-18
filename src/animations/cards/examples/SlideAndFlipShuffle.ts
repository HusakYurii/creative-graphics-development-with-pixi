import { BaseCardsDeck, type CardsDeckProps } from "../baseClasses/BaseCardsDeck";
import type { AnimatedCard } from "./AnimatedCard";
import { Easing, Tween, tweenGroup, wait, waitAsync } from "../../../core/tweenGroup";
import { Graphics, Rectangle, type IPointData } from "pixi.js";
import { Button } from "./Button";

export class SlideAndFlipShuffle extends BaseCardsDeck<AnimatedCard> {

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
        rect.drawRect(-200, -100, 400, 200);
        rect.endFill();
        this.view.addChild(rect);

        this._fromContainer.mask = rect;
    }

    public stack(onFinish?: () => void): void {
        this._cards.forEach((card, i) => {
            card.view.position.set(0, 200)
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

        const tw = new Tween({ x: 0, y: 200 }, tweenGroup)
            .to({ x: 0, y: 0 }, 600)
            .onUpdate(({ x, y }) => {
                for (let i = 0; i < cards.length; i++) {
                    cards[i].view.position.set(x, y)
                }
            })
            .easing(Easing.Back.Out)
            .start();

        const tw2 = new Tween({ x: 0, y: 0 }, tweenGroup)
            .to({ x: 200, y: 0 }, 500)
            .onUpdate(({ x, y }) => {
                for (let i = 0; i < cards.length; i++) {
                    const fraction = (i + 1) / 8
                    cards[i].view.position.set(x * fraction, y)
                }
            })
            .easing(Easing.Back.Out)

        const tw3 = new Tween({ val: 0 }, tweenGroup)
            .to({ val: 1 }, 200)

            .onComplete(({ val }) => {
                cards[cards.length - 1].jump(600);
                cards[cards.length - 1].flip(600);
            });

        tw2.chain(tw3);
        tw.chain(tw2);
        this._tweens.push(tw, tw2, tw3)





    }


}