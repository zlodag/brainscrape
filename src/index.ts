import fetch from 'node-fetch';
import { HTMLElement, parse } from 'node-html-parser';
import { Card } from './models/card.model';
import { Deck } from './models/deck.model';
import { Pack } from './models/pack.model';

export const parseTags = (text: string): string[] => text.replace('\nTags:\n', '').split(',\n').map(t => t.replace('\n', ''));

export const parseCard = (card: HTMLElement): Card => ({
    question: card.querySelector('.card-question-text').text,
    answer: card.querySelector('.card-answer-text').text
})

export const getDeck = async (url: string): Promise<Deck> => {
    const dom = parse(await fetch(url).then(a => a.text())) as HTMLElement;

    const title = dom.querySelector('.title-above-cards .deck-name').text.replace(/\n/g, '');
    const cards: Card[] = dom.querySelectorAll('.card-table .card').map(parseCard);

    return {
        cards,
        title,
    }
}

/**
 * Get all the cards from a pack organised into decks.
 * 
 * @param packId to extract cards from
 */
export const getPack = async (url: string): Promise<Pack> => {
    const dom = parse(await fetch(url).then(a => a.text())) as HTMLElement;

    const title = dom.querySelector('.market-title').text.replace(/\n/g, '').replace(/ \b(\w+)\W*$/g, '');

    const tags = parseTags(dom.querySelector('.market-subtitle').text);

    const deckLinks = dom.querySelectorAll('a.deck-bar-link').map(n => `https://www.brainscape.com${n.attributes.href}`);

    const decks = await Promise.all(deckLinks.map(getDeck));

    return {
        title,
        decks,
        tags,
    }
}