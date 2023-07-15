
export type Deck = {
    deckName: string,
    playDeck: string[],
    characterDeck: string[]
}

export type DeckCollection = {
    selectedDeckIndex: number,
    decks: Deck[]
}

export type CardType = 'character' | 'equipment' | 'spell' | 'other'
export type ComponentDeckType = 'play'|'character';

export type AddDeckRequest = {
    deckName: string
}
export type AlterCardsRequest = {
    deckName: string,
    cardNames: string[]
}