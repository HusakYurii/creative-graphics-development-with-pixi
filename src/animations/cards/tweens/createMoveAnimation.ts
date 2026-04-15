import type { IPoint, IPointData } from "pixi.js";
import type { BaseCard } from "../baseClasses/BaseCard";
import { Easing, Tween, tweenGroup, type BaseAnimator } from "./tweenGroup";

export const createMoveAnimation: BaseAnimator<BaseCard> = (card) => {
    let tween: Tween | null = null;
    const animationProps = {
        startPosition: { x: 0, y: 0 },
        timePassed: { value: 0 },
    };

    const removeTween = () => {
        if (tween) {
            tween.stop();
            tweenGroup.remove(tween);
        }
    }

    const fn = (from: IPointData, to: IPointData, duration: number) => {
        return new Tween(from, tweenGroup)
            .to(to, duration)
            .easing(Easing.Cubic.InOut)
            .onUpdate(({ x, y }: IPointData, progress) => {
                animationProps.timePassed.value = duration * progress;
                card.view.position.set(x, y);
            }).start();
    };

    return {
        animate(duration: number = 1000, to: IPointData) {
            removeTween();

            // Save start and end positions for undo
            animationProps.startPosition = { x: card.view.position.x, y: card.view.position.y };

            tween = fn({ ...animationProps.startPosition }, to, duration);

            // Undo function: animates back to the original position from current state
            const undo = () => {
                removeTween();
                // Move card back to original position

                const undoDuration = animationProps.timePassed.value;
                tween = fn(
                    { x: card.view.position.x, y: card.view.position.y },
                    { ...animationProps.startPosition },
                    undoDuration);
            };

            return undo;
        }
    };
};