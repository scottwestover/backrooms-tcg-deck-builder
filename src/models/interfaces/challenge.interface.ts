export interface IChallenge {
  id: string;
  name: string;
  description: string;
  difficulty: number;
  type: string;
  creator: string;
  userId?: string;
}
