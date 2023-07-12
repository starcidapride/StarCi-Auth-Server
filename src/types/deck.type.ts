export type ComponentDeck = {
    cardNames: string[]
}

export type Deck = {
    deckName: string,
    playDeck: ComponentDeck,
    characterDeck: ComponentDeck
}

export type DeckCollection = {
    selectedDeckIndex: number,
    decks: Deck[]
}
