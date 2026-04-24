import { BaseCardsDeck, type CardsDeckProps } from "../baseClasses/BaseCardsDeck";
import type { AnimatedCard } from "./AnimatedCard";
import { Easing, Tween, tweenGroup, wait, waitAsync } from "../../../core/tweenGroup";
import { DisplayObject, Graphics, Rectangle, Sprite, type IPointData } from "pixi.js";
import { Button } from "../../cards/examples/Button";

const width = 400;
const cardsAmount = 8;

const targetPoints = Array.from({ length: 8 }).map((_, i) => {
    return {
        x: -width / 2 + (width / cardsAmount) * i,
        y: 0,
    }
})

export class SlideAndFlipShuffle extends BaseCardsDeck<AnimatedCard> {
    private _cardsToMove: AnimatedCard[] = [];
    private _tweens: Tween[] = [];
    constructor(props: CardsDeckProps<AnimatedCard>) {
        super(props);

        this._cards.forEach(card => card.view.scale.set(1.5));
        this.stack();

        this._fromContainer.position.set(0, 0);

        this._toContainer.position.set(0, 0)




        const button = new Button();
        button.view.position.set(-button.view.width / 2, 100);
        this.view.addChild(button.view);


        button.view.on("mouseover", () => {
            this.shuffle(() => {

            });
        })
        button.view.on('mouseleave', () => {
        });

        // const rect = new Graphics();
        // rect.beginFill(0x00ff00);
        // rect.drawRect(-200, -100, 400, 200);
        // rect.endFill();
        // this.view.addChild(rect);

        // this._fromContainer.mask = rect;
    }

    public stack(onFinish?: () => void): void {
        this._cards.forEach((card, i) => {
            card.view.position.set(0, -170 - 0.5 * i);
            card.view.scale.set(1.1);
            card.view.rotation = 0;
        });
        onFinish && onFinish();
    }


    public shuffle(onFinish?: () => void): void {
        this._tweens.forEach(tw => {
            tw.stop();
            tweenGroup.remove(tw);
        })
        this._tweens.length = 0;

        if (this._toContainer.children.length) {
            this._cardsToMove.reverse();
            this._cardsToMove[0].reset();

            this._fromContainer.addChild(...this._cardsToMove.map(card => card.view))
        }


        this.stack();
        this._cardsToMove = [];
        let lastTween: Tween = new Tween({});

        for (let i = 1; i < cardsAmount; i++) {
            const card = this._cards[this._cards.length - i]

            const from = {
                x: card.view.position.x,
                y: card.view.position.y,
                sX: card.view.scale.x,
                sY: card.view.scale.y,
                r: card.view.rotation
            }
            const to = {
                ...targetPoints[i],
                sX: 1.5,
                sY: 1.5,
                r: 0
            }

            lastTween = new Tween(from, tweenGroup)
                .to(to, 450)
                .onStart(() => {
                    card.jump(420, 20);
                })
                .onUpdate(({ x, y, sX, sY, r }, progress) => {
                    card.view.position.set(x, y);
                    card.view.scale.set(sX, sY);
                    card.view.rotation = r;
                    if (Math.ceil(progress * 100) / 100 > 0.3 && !this._cardsToMove.includes(card)) {
                        this._toContainer.addChild(card.view);
                        this._cardsToMove.push(card);
                    }
                })

                .delay(i * 250)
                // .easing(Easing.Quadratic.Out)
                .start();
            this._tweens.push(lastTween);
        }






        const tw = new Tween({ val: 0 }, tweenGroup)
            .to({ val: 1 }, 200)

            .onComplete(({ val }) => {
                this._cardsToMove[this._cardsToMove.length - 1].jump(600, 30);
                this._cardsToMove[this._cardsToMove.length - 1].flip(600);
            });

        lastTween.chain(tw);
        this._tweens.push(tw)





    }


}