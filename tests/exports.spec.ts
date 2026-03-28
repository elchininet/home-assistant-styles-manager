import * as bundle from '../src';
import { HomeAssistantStylesManager } from '../src';
import { getCSSRulesString } from '../src/utilities';

describe('public exports', () => {
    it('should export the proper elements', () => {
        expect(bundle).toEqual({
            HomeAssistantStylesManager,
            getCSSRulesString
        });
    });
});