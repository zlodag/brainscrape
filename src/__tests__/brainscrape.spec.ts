import { getPack } from "../index";

describe('brainscrape', () => {
    test('should return cards', async () => {
        const pack = await getPack(`https://www.brainscape.com/packs/cs4052-logic-and-software-verification-13772696`);
        expect(pack.decks.length).not.toBe(0);
        expect(pack.decks[0].cards.length).not.toBe(0);
    });
});
