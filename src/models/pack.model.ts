import { Deck } from './deck.model';

export interface Pack {
    title: string;

    tags: string[];

    decks: Deck[];
}