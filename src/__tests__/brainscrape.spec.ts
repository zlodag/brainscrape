import { getPack } from "../index";

describe('brainscrape', () => {
    it('should return cards', async () => {
        const pack = await getPack(`https://www.brainscape.com/packs/cs4052-logic-and-software-verification-13772696`);

        console.log(pack);
    })
})