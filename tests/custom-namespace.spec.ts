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

    let myElement: HTMLDivElement | null;
    let myCustomElement: HTMLElement | null;
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
        myElement = document.querySelector('.my-element');
        await customElements.whenDefined('my-custom-html-element')
            .then(() => {
                myCustomElement = document.querySelector('my-custom-html-element');
            });
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

            expect(consoleWarningFn).toHaveBeenCalledWith('custom-namespace: no element has been provided calling "addStyle"');

        });

    });

    describe('removeStyle', () => {

        it('should throw a warning if it is used with a non-existent element', () => {

            styleManager.removeStyle(
                document.querySelector('.non-existent')
            );

            expect(consoleWarningFn).toHaveBeenCalledWith('custom-namespace: no element has been provided calling "removeStyle"');

        });

        it('should throw a warning if it is used in an element without style', () => {

            styleManager.removeStyle(myElement);

            expect(consoleWarningFn).toHaveBeenCalledWith('custom-namespace: no style to remove calling "removeStyle"');

        });

        it('should throw a warning if it is used in a custom element without style', () => {

            styleManager.removeStyle(myCustomElement);

            expect(consoleWarningFn).toHaveBeenCalledWith('custom-namespace: no style to remove calling "removeStyle"');

        });

        it('should throw a warning if it is used in a custom element shadowRoot without style', () => {

            styleManager.removeStyle(myCustomElement?.shadowRoot);

            expect(consoleWarningFn).toHaveBeenCalledWith('custom-namespace: no style to remove calling "removeStyle"');

        });

    });

});