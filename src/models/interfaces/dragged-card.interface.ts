import { DRAG } from '../enums';
import { BackroomsCard } from './digimon-card.interface';

export interface IDraggedCard {
  card: BackroomsCard;
  drag: DRAG;
}
