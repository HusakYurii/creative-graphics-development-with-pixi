export const assetNames = {
    cards: Array.from({ length: 53 }).map((_, i) => {
        return {
            alias: `${i}`,
            src: `secondDeck/${i}.png`
        }
    }),

}