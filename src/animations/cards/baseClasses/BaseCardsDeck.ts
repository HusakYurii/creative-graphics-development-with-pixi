import { Container, Texture } from "pixi.js";
import { BaseCard, type BaseCardProps } from "./BaseCard";

export interface CardsDeckProps<Card extends BaseCard = BaseCard> {
    assets: {
        cards: string[];
        cardBack: string;
    };
    getTexture(name: string): Texture | undefined;
    CardCreator: new (props: BaseCardProps) => Card;
}

export abstract class BaseCardsDeck<Card extends BaseCard = BaseCard> {
    public view: Container;
    public get cards(): ReadonlyArray<Card> {
        return this._cards;
    }
    protected _cards: Card[];
    protected _fromContainer: Container;
    protected _toContainer: Container;

    constructor({ assets, getTexture, CardCreator }: CardsDeckProps<Card>) {
        this.view = new Container();
        this._fromContainer = this.view.addChild(new Container());
        this._toContainer = this.view.addChild(new Container());

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
            this._fromContainer.addChild(card.view)
        });
    }

    public abstract stack(onFinish: () => void): void;
    public abstract shuffle(onFinish: () => void): void;
}