import type { IPoint, IPointData } from "pixi.js";
import type { BaseCard } from "../baseClasses/BaseCard";
import { Easing, Tween, tweenGroup, yoyo, type BaseAnimator } from "./tweenGroup";


export const createJumpAnimation: BaseAnimator<BaseCard> = (card) => {

    let tween: Tween | null = null;

    const removeTween = () => {
        if (tween) {
            tween.stop();
            tweenGroup.remove(tween);
        }
    }

    return {
        animate(duration: number = 500, offset: number = 30, onComplete = () => { }) {

            removeTween();

            const from = { value: 0, alpha: card.shadow.alpha, scale: card.shadow.scale.x };
            const to = { value: offset, alpha: card.shadow.alpha * 0.4, scale: card.shadow.scale.x * 1.1 };


            tween = new Tween(from, tweenGroup);
            tween.to(to, duration * 2)
                .easing(yoyo(t => Easing.Cubic.InOut(t)))
                // .yoyo(true)
                // .repeat(1)
                .onUpdate(({ value, alpha, scale }) => {
                    card.shadow.alpha = alpha;
                    card.shadow.scale.set(scale);
                    card.shadow.pivot.set(value * 0.8, -value * 0.4);
                    card.body.pivot.y = value;


                })
                .onComplete(onComplete)
                .start();
            const undo = () => {
                removeTween();
            };
            return undo;
        }
    }

}