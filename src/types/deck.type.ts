
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


export type AddDeckRequest = {
    deckName: string
}

export type SaveDeckRequest = {
    deckName: string,
    playCardNames: string[]
    characterCardNames: string[]
}

