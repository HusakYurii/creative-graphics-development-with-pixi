import type { IPoint, IPointData } from "pixi.js";
import type { BaseCard } from "../baseClasses/BaseCard";
import { Easing, Tween, tweenGroup, type BaseAnimator } from "./tweenGroup";


export const createMoveAnimation: BaseAnimator<BaseCard> = (card) => {

    let tween: Tween | null = null;
    // const animationProps: {
    //     from: IPointData | null;
    //     to: IPointData | null;
    // } = {
    //     from: null,
    //     to: null,
    // }

    return {
        animate(duration: number = 1000, to: IPointData) {

            if (tween) {
                tween.stop();
                tweenGroup.remove(tween);
            }

            const dx = to.x - card.view.position.x;
            const dy = to.y - card.view.position.y;
            card.view.position.set(to.x, to.y);
            card.view.pivot.set(dx, dy);

            tween = new Tween({ x: dx, y: dy }, tweenGroup);
            tween.to({ x: 0, y: 0 }, duration)
                .easing(Easing.Cubic.InOut)
                .onUpdate(({ x, y }: IPointData) => {
                    card.view.pivot.set(x, y)
                }).start();
            return tween;
        }
    }

}