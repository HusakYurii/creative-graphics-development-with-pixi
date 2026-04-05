import type { BaseCard } from "../baseClasses/BaseCard";
import { Easing, Tween, tweenGroup, type BaseAnimator } from "./tweenGroup";


export const createFlipAnimation: BaseAnimator<BaseCard> = (card) => {

    let tween: Tween | null = null;
    const animationProps = {
        from: { value: 1 },
        to: { value: -1 },
        skewMagnitude: 0.3,
    }

    return {
        animate(duration: number = 1000) {

            if (tween) {
                tween.stop();
                tweenGroup.remove(tween);
            }

            const from = { ...animationProps.from }
            const to = { ...animationProps.to };
            animationProps.to.value *= -1;

            tween = new Tween(from, tweenGroup);
            tween.to(to, duration)
                .easing(Easing.Cubic.InOut)
                .onUpdate(({ value }) => {
                    // I do this to save this value for cases when I want to unflip the card,
                    // then I know where the animation was interrupted
                    animationProps.from.value = value;

                    const normalized = Math.abs(value);
                    card.body.scale.x = normalized;
                    card.shadow.scale.x = normalized * 0.9;
                    const rounded = Math.floor(normalized * 10) / 10; // so we go in steps with 0.x precision

                    if (rounded === 0) {
                        card.front.visible = card.isOpen;
                        card.back.visible = !card.isOpen;
                    }
                    // I need side for skew because 1 is for left and -1 for right
                    const skewSide = Math.sign(value);
                    // (1 - normalized) to remap it from 1 => 0 => 1 TO 0 => 1 => 0
                    card.body.skew.y = (1 - normalized) * skewSide * animationProps.skewMagnitude;
                    card.shadow.skew.y = (1 - normalized) * skewSide * animationProps.skewMagnitude;
                }).start();
            return tween;
        }
    }

}