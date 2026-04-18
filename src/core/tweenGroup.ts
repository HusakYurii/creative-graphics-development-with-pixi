import { Group, Tween, Easing } from '@tweenjs/tween.js'

type BaseAnimator<T extends any, P extends any[] = any[]> = (target: T) => {
    animate: (duration?: number, ...args: P) => () => void;
}

const tweenGroup = new Group();

export function yoyo(f: (val: number) => number) {
    return (t: number) => {
        if (t < 0.5) {
            return f(2 * t);
        } else {
            return 1 - f(2 * (t - 0.5));
        }
    }
}
/*
// https://github.com/tweenjs/tween.js/issues/677
new TWEEN.Tween({ x: 0 })
  .to({ x: 200 }, 2000 * 2) // duration needs to be doubled 
  .repeat(Infinity)
  //.yoyo(true)
  .easing(yoyo(t => TWEEN.Easing.Cubic.InOut(t)))
*/

export const wait = (time: number, cb: () => any) => {
    new Tween({}, tweenGroup).to({}, time).onComplete(cb).start();
}

export const waitAsync = async (time: number) => {
    return new Promise((res) => {
        new Tween({}, tweenGroup).to({}, time).onComplete(res).start();
    })
}

export {
    tweenGroup,
    Tween,
    Easing,
    type BaseAnimator
}