import type { IPointData } from "pixi.js";
import { BaseCard, type BaseCardProps } from "../baseClasses/BaseCard";
import { createFlipAnimation } from "../tweens/createFlipAnimation";
import { createMoveAnimation } from "../tweens/createMoveAnimation";
import { createJumpAnimation } from "../tweens/createJumpAnimation";

const ANIMATION_TIME = 800;
export class AnimatedCard extends BaseCard {

    private _flipAnimation: ReturnType<typeof createFlipAnimation>;
    private _moveAnimation: ReturnType<typeof createMoveAnimation>;
    private _jumpAnimation: ReturnType<typeof createJumpAnimation>;

    constructor(props: BaseCardProps) {
        super(props);

        this._flipAnimation = createFlipAnimation(this);
        this._moveAnimation = createMoveAnimation(this);
        this._jumpAnimation = createJumpAnimation(this);

    }

    flip() {
        this.isOpen = !this.isOpen;
        this._flipAnimation.animate(ANIMATION_TIME);
    }

    move(to: IPointData) {
        this._moveAnimation.animate(ANIMATION_TIME, to)
    }

    jump() {
        this._jumpAnimation.animate(ANIMATION_TIME / 2, 25);
    }

}