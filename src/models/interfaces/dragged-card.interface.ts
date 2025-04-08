import { DRAG } from '../enums';
import { BackroomsCard } from './backroom-card.interface';

export interface IDraggedCard {
  card: BackroomsCard;
  drag: DRAG;
}
