import fetch from "node-fetch";
import { HTMLElement, parse } from "node-html-parser";
import { Card } from "./models/card.model";
import { Deck } from "./models/deck.model";
import { Pack } from "./models/pack.model";
import { writeFileSync } from 'fs';

const trimHTML = (el: HTMLElement): string => el.innerHTML.replace(/\n/g, "").trim().replace(/\t/g, "&emsp;");

const trimTitle = (el: HTMLElement): string => el.text.replace(/\n/g, "").trim();

export const parseCard = (card: HTMLElement): Card => {
  const question = trimHTML(card.querySelector(".card-question-text"));
  const answer = trimHTML(card.querySelector(".card-answer-text"));
  return {
    question: question,
    answer: answer
  };
};

export const getDeck = async (href: string): Promise<Deck> => { 
  const html_text = await fetch(`https://www.brainscape.com${href}`).then(a => a.text());
  const dom = parse(html_text) as HTMLElement;
  const title = trimTitle(dom.querySelector(".title-above-cards .deck-name"));
  const cards: Card[] = dom
    .querySelectorAll(".card-table .card")
    .map(parseCard);
  return {
    cards,
    title
  };
};

export const getPack = async (url: string): Promise<Pack> => {
  const html_text = await fetch(url).then(a => a.text());
  const dom = parse(html_text) as HTMLElement;
  const title = trimTitle(dom.querySelector(".market-title"));
  const deckLinks = dom
    .querySelectorAll("a.deck-bar-link")
    .map(n => n.attributes.href);
  const decks = await Promise.all(deckLinks.map(getDeck));
  return {
    title,
    decks
  };
};

export const exportDB = (pack: Pack, output: string) => {
  let tsv = "";
  pack.decks.forEach(deck => {
    deck.cards.forEach(card => {
      tsv += `${card.question}\t${card.answer}\t${deck.title}\n`;
    });
  });
  writeFileSync(output, tsv);
};

export const main = async () => {
  if (require.main !== module) return;
  const args = process.argv.slice(2);
  if (args.length != 2) {
    console.error("usage: node lib/index.js <brainscape_pack_url> <tsv_output_path>");
    return;
  }
  const pack = await getPack(args[0]);
  exportDB(pack, args[1]);
};

main();
