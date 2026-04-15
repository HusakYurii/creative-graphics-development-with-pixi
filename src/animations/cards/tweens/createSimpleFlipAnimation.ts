import type { BaseCard } from "../baseClasses/BaseCard";
import { Easing, Tween, tweenGroup, type BaseAnimator } from "./tweenGroup";


export const createSimpleFlipAnimation: BaseAnimator<BaseCard> = (card) => {

    let tween: Tween | null = null;
    const animationProps = {
        current: { value: 0 },
        timePassed: { value: 0 },
        skewMagnitude: 0.3,
    }

    const removeTween = () => {
        if (tween) {
            tween.stop();
            tweenGroup.remove(tween);
        }
    }

    const fn = (from: { value: number }, to: { value: number }, duration: number) => {
        return new Tween(from, tweenGroup)
            .to(to, duration)
            .easing(Easing.Cubic.InOut)
            .onUpdate(({ value }, progress) => {
                animationProps.current.value = value;
                animationProps.timePassed.value = duration * progress;
                const normalized = Math.abs(value);
                card.body.scale.x = normalized;
                card.shadow.scale.x = normalized;
                const rounded = Math.floor(normalized * 10) / 10;
                if (rounded === 0) {
                    card.front.visible = card.isOpen;
                    card.back.visible = !card.isOpen;
                }
                const skewSide = Math.sign(value);
                card.body.skew.y = (1 - normalized) * skewSide * animationProps.skewMagnitude;
                card.shadow.skew.y = (1 - normalized) * skewSide * animationProps.skewMagnitude;
            }).start();
    }
    return {

        animate(duration: number = 1000) {
            // Always start from unflipped to flipped
            removeTween();

            // Set up for flip (unflipped -> flipped)
            const from = { value: 1 };
            const to = { value: -1 };

            tween = fn(from, to, duration);

            // Undo function: flips back from current state to unflipped
            const undo = () => {
                removeTween();
                const undoDuration = animationProps.timePassed.value;
                const undoFrom = { value: animationProps.current.value };
                const undoTo = { value: 1 };

                tween = fn(undoFrom, undoTo, undoDuration);
            };

            return undo;
        }
    }

}