import { Container, Sprite, Texture } from "pixi.js";
import { BaseCard, type BaseCardProps } from "./BaseCard";

interface CardsDeckProps<Card extends BaseCard = BaseCard> {
    assets: {
        cards: string[];
        cardBack: string;
    };
    getTexture(name: string): Texture | undefined;
    CardCreator: new (props: BaseCardProps) => Card;
}

export class BaseCardsDeck<Card extends BaseCard = BaseCard> {
    public view: Container;
    public get cards(): ReadonlyArray<Card> {
        return this._cards;
    }
    protected _cards: Card[];

    constructor({ assets, getTexture, CardCreator }: CardsDeckProps<Card>) {
        this.view = new Container();
        this._cards = [];

        const backTexture = getTexture(assets.cardBack);

        assets.cards.forEach((cardName) => {
            const frontTexture = getTexture(cardName);
            const card = new CardCreator({
                back: backTexture || Texture.EMPTY,
                front: frontTexture || Texture.EMPTY,
                id: cardName
            });

            this._cards.push(card);
            this.view.addChild(card.view)
        });
    }


    // layInCircle() {
    //     let r = 150;
    //     let rStep = 0.5;
    //     let angle = 0;
    //     let angleStep = (Math.PI * 2) / this._cards.length;

    //     this._cards.forEach((val, i) => {
    //         const x = Math.cos(angle) * r;
    //         const y = Math.sin(angle) * r;
    //         val.view.position.set(x, y);
    //         val.view.rotation = angle + Math.PI / 2;

    //         angle += angleStep;
    //         r -= rStep;


    //     })
    // }
}