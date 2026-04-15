import { BaseCardsDeck, type CardsDeckProps } from "../baseClasses/BaseCardsDeck";
import type { AnimatedCard } from "./AnimatedCard";
import { wait, waitAsync } from "../tweens/tweenGroup";
import { type IPointData } from "pixi.js";
import { Button } from "./Button";

export class SimpleShuffle extends BaseCardsDeck<AnimatedCard> {
    private _canContinueShuffling = false;
    private _currentCardIndex = 0;
    private _finalPositions: IPointData[] = [];

    constructor(props: CardsDeckProps<AnimatedCard>) {
        super(props);

        this._cards.forEach(card => card.view.scale.set(1.5));
        this.stack();

        this._finalPositions = this._cards.map((card) => {
            return {
                x: card.view.position.x + 200,
                y: card.view.position.y + 0
            }
        });

        const button = new Button();
        button.view.position.set(-50, 100);
        this.view.addChild(button.view);


        button.view.on("mouseover", () => {
            this._canContinueShuffling = true;
            this.shuffle(() => {
                // this._canContinueShuffling = false;
                // this._currentCardIndex = 0;
                // this.cards.forEach(card => this._fromContainer.addChild(card.view))
                // this.stack();
            });

        })
        button.view.on('mouseleave', () => {
            this._canContinueShuffling = false;
        })
    }

    public stack(onFinish?: () => void): void {
        this._cards.forEach((card, i) => {
            card.view.position.set(0.3 * i, -0.2 * i)
        });
        onFinish && onFinish();
    }


    public shuffle(onFinish?: () => void): void {

        const speed = 800;
        const nextCardDelay = 100;
        const cardsToShuffle = [...this._cards].reverse();

        const moveAndWait = async () => {
            if (!this._canContinueShuffling) {
                return;
            }
            const card = cardsToShuffle[this._currentCardIndex];
            const finalPosition = this._finalPositions[this._currentCardIndex];
            card.move({
                x: card.view.position.x - 50,
                y: card.view.position.y - 30,
            }, speed * 0.4);
            card.jump(speed);

            await waitAsync(speed * 0.4);

            this._toContainer.addChild(card.view);
            card.move(finalPosition, speed * 0.6);

            this._currentCardIndex++;
            if (this._currentCardIndex >= this._cards.length) {
                onFinish && onFinish();
                return;
            }

            await waitAsync(nextCardDelay);
            moveAndWait();
        }

        moveAndWait();
    }


}