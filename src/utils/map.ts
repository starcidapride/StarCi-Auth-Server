import { ARTHUR, BALDUM, BARRIER, CLEANSE, CRESHT, FAFNIRS_TALON, HEAL, INVOCATION, PEURA, SHIELD_OF_THE_LOST, TELS_ANNAS } from '@utils/constants'
import { CardType } from '@apptypes/deck.type'

interface CardMap {
    [key: string]: CardType;
  }

export const cardMap : CardMap= {
    [ARTHUR]: 'character',
    [BALDUM]: 'character',
    [CRESHT]: 'character',
    [PEURA]: 'character',
    [TELS_ANNAS] : 'character',

    [FAFNIRS_TALON]: 'equipment',
    [SHIELD_OF_THE_LOST]: 'equipment',

    [BARRIER]: 'spell',
    [CLEANSE]: 'spell',
    [HEAL]: 'spell',

    [INVOCATION]: 'other'
}