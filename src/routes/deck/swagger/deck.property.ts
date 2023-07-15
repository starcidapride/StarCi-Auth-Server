import { ApiProperty } from '@nestjs/swagger'

export class AddDeckBodyApi{
    
@ApiProperty({ example: 'starci', description: 'DeckName' })
    deckName: string
}

export class SaveDeckBodyApi{
    
    @ApiProperty({ example: 'starci', description: 'DeckName' })
        deckName: string
    
    @ApiProperty({ example: ['Cleanse', 'Heal', 'Fafnir\'s Talon'], description: 'Play Card Names' })
        playCardNames: string[]

    @ApiProperty({ example: ['Krixi', 'Yorn'], description: 'Character Card Names' })
        characterCardNames: string[]
}


