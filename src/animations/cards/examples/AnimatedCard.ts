import type { IPointData } from "pixi.js";
import { BaseCard, type BaseCardProps } from "../baseClasses/BaseCard";
import { createSimpleFlipAnimation } from "../tweens/createSimpleFlipAnimation";
import { createMoveAnimation } from "../tweens/createMoveAnimation";
import { createJumpAnimation } from "../tweens/createJumpAnimation";

const ANIMATION_TIME = 800;
export class AnimatedCard extends BaseCard {

    private _flipAnimation: ReturnType<typeof createSimpleFlipAnimation>;
    private _flipAnimationUndo: Function | null = null;

    private _moveAnimation: ReturnType<typeof createMoveAnimation>;
    private _moveAnimationUndo: Function | null = null;

    private _jumpAnimation: ReturnType<typeof createJumpAnimation>;

    private _canJump = true;
    constructor(props: BaseCardProps) {
        super(props);

        this._flipAnimation = createSimpleFlipAnimation(this);
        this._moveAnimation = createMoveAnimation(this);
        this._jumpAnimation = createJumpAnimation(this);

    }

    flip(time = ANIMATION_TIME) {
        if (!this.isOpen) {
            this.isOpen = true;
            this._flipAnimationUndo = this._flipAnimation.animate(time);
        }
    }

    unflip() {
        if (this.isOpen) {
            this.isOpen = false;
            this._flipAnimationUndo && this._flipAnimationUndo();
            this._flipAnimationUndo = null;
        }
    }

    move(to: IPointData, time = ANIMATION_TIME) {
        this._moveAnimationUndo = this._moveAnimation.animate(time, to)
    }

    unmove() {
        this._moveAnimationUndo && this._moveAnimationUndo();
    }

    jump(time = ANIMATION_TIME) {
        if (!this._canJump) {
            return;
        }
        this._canJump = false;
        this._jumpAnimation.animate(time / 2, 25, () => {
            this._canJump = true;
        });
    }

}