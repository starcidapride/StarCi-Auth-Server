import { ApiProperty } from '@nestjs/swagger'

export class AddDeckBodyApi{
    
@ApiProperty({ example: 'starci', description: 'DeckName' })
    deckName: string

@ApiProperty({ example: '["Heal", "Fafnir\'s Talon"]', description: 'Play Deck' })
    playDeck: string[]

@ApiProperty({ example: '["Tel \' Annas "]', description: 'Character Deck' })
    characterDeck: string[]
}

export class AlterCardBodyApi{
    
    @ApiProperty({ example: 'starci', description: 'DeckName' })
        deckName: string
    
    @ApiProperty({ example: 'Krixi', description: 'Card Name' })
        cardName: string
}


