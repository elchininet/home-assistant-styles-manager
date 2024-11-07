import { HomeAssistantStylesManager } from '../src';

class MyCustomHtmlElement extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <ul>
                <li class="custom-li">List item 1</li>
                <li class="custom-li">List item 2</li>
                <li class="custom-li">List item 3</li>
            </ul>
        `;
    }
}

const BASE_BODY = `
    <div class="my-element">My HTML element</div>
    <my-custom-html-element></my-custom-html-element>
`;

describe('HomeAssistantStylesManager with custom namespace', () => {

    let styleManager: HomeAssistantStylesManager;

    let consoleWarningFn: jest.Mock;
    let consoleSpy: jest.SpyInstance<void, Parameters<typeof console.warn>>;

    beforeAll(() => {
        customElements.define('my-custom-html-element', MyCustomHtmlElement);
    });

    beforeEach(async () => {
        consoleWarningFn = jest.fn();
        consoleSpy = jest
            .spyOn(console, 'warn')
            .mockImplementation(consoleWarningFn);
        document.body.innerHTML = BASE_BODY;
        styleManager = new HomeAssistantStylesManager({
            namespace: 'custom-namespace'
        });
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        document.body.innerHTML = '';
    });

    describe('addStyle', () => {

        it('should throw a warning if it is used with a non-existent element', () => {

            styleManager.addStyle(
                '.custom { display: none }',
                document.querySelector('.non-existent')
            );

            expect(consoleWarningFn).toHaveBeenCalledWith('custom-namespace: no element has been provided in "addStyle"');

        });

    });

    describe('removeStyle', () => {

        it('should throw a warning if it is used with a non-existent element', () => {

            styleManager.removeStyle(
                document.querySelector('.non-existent')
            );

            expect(consoleWarningFn).toHaveBeenCalledWith('custom-namespace: no element has been provided in "removeStyle"');

        });

    });

});