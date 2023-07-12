import { ComponentDeck } from '@apptypes/deck.type'
import { ApiProperty } from '@nestjs/swagger'

export class AddDeckBodyApi{
    
@ApiProperty({ example: 'starci', description: 'DeckName' })
    deckName: string

@ApiProperty({ example: '["Heal", "Fafnir\'s Talon"]', description: 'Play Deck' })
    playDeck: ComponentDeck

@ApiProperty({ example: '["Tel \' Annas "]', description: 'Character Deck' })
    characterDeck: ComponentDeck
}


