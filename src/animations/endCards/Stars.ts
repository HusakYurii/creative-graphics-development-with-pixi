import {
    ParticleContainer,
    BLEND_MODES,
    Container,
    Texture,
    Sprite,
} from 'pixi.js';

class Star extends Sprite {

    public dirX: number = 0;
    public dirY: number = 0;

    public t: number = 0;

    // interpolation value for smooth stretching
    public stretch: number = 0;

    constructor(texture?: Texture) {
        super(texture);
    }
}

export class StarsContainer {

    public view: Container = new Container();

    // ---------------------------------------------------------
    // PUBLIC
    // ---------------------------------------------------------

    public isAccelerated: boolean = false;

    // ---------------------------------------------------------
    // PRIVATE
    // ---------------------------------------------------------

    private _stars: Star[] = [];

    private _moveDistance: number;

    constructor(
        starTexture: Texture,
        moveDistance: number = 1200
    ) {

        this._moveDistance = moveDistance;

        const container = new ParticleContainer(1000, {
            position: true,
            rotation: true,
            scale: true,
            alpha: true,
        });

        container.blendMode = BLEND_MODES.ADD;

        this.view.addChild(container);

        const STAR_COUNT = 1000;

        for (let i = 0; i < STAR_COUNT; i++) {

            const star = new Star(starTexture);

            star.anchor.set(0.5);

            container.addChild(star);

            this._resetStar(star, true);

            this._stars.push(star);
        }
    }

    // ---------------------------------------------------------
    // UPDATE
    // ---------------------------------------------------------

    public update(deltaMS: number): void {

        let delta = deltaMS * 0.0001;

        // faster movement during acceleration
        if (this.isAccelerated) {
            delta *= 2.0;
        }

        for (const star of this._stars) {

            star.t += delta * 0.35;

            // recycle star
            if (star.t >= 1.0) {

                this._resetStar(star);

                continue;
            }

            this._updateStarVisual(star);
        }
    }

    // ---------------------------------------------------------
    // RESET STAR
    // ---------------------------------------------------------

    private _resetStar(
        star: Star,
        randomT: boolean = false
    ): void {

        const angle = Math.random() * Math.PI * 2;

        star.dirX = Math.cos(angle);
        star.dirY = Math.sin(angle);

        // store rotation once
        star.rotation = angle;

        // randomized timeline start
        star.t = randomT
            ? Math.random()
            : 0;

        star.x = 0;
        star.y = 0;

        // reset stretch interpolation
        star.stretch = 0;

        this._updateStarVisual(star);
    }

    // ---------------------------------------------------------
    // UPDATE VISUAL
    // ---------------------------------------------------------

    private _updateStarVisual(star: Star): void {

        // accelerated distance curve
        const distance = star.t * star.t;

        // movement
        const moveDistance =
            distance * this._moveDistance;

        star.x = star.dirX * moveDistance;
        star.y = star.dirY * moveDistance;

        // -----------------------------------------------------
        // STRETCH TRANSITION
        // -----------------------------------------------------

        const targetStretch =
            this.isAccelerated ? 1.0 : 0.0;

        // smooth interpolation
        star.stretch +=
            (targetStretch - star.stretch) * 0.08;

        // -----------------------------------------------------
        // SCALE
        // -----------------------------------------------------

        // default circular size
        const circleSize =
            0.02 + distance * 0.15;

        // stretched hyperdrive size
        const streakLength =
            0.02 + distance * 8.0;

        // interpolate between circle and streak
        const scaleX =
            circleSize +
            (streakLength - circleSize) * star.stretch;

        const scaleY = circleSize;

        star.scale.set(scaleX, scaleY);

        // brightness
        star.alpha =
            Math.min(1.0, 0.2 + distance * 1.5);
    }
}