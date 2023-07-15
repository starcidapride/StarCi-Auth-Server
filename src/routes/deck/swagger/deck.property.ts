import { ApiProperty } from '@nestjs/swagger'

export class AddDeckBodyApi{
    
@ApiProperty({ example: 'starci', description: 'DeckName' })
    deckName: string
}

export class AlterCardsBodyApi{
    
    @ApiProperty({ example: 'starci', description: 'DeckName' })
        deckName: string
    
    @ApiProperty({ example: ['Krixi', 'Yorn'], description: 'Card Names' })
        cardNames: string[]
}


