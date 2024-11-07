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

class NotMyCustomHtmlElement extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.innerHTML = `
            <span>Not my custom HTMLElement</span>
        `;
    }
}

const BASE_BODY = `
    <div class="my-element">My HTML element</div>
    <div class="not-my-element">
        Not my HTML element
        <style>
            .not-my-element {
                color: green;
            }
        </style>
    </div>
    <my-custom-html-element></my-custom-html-element>
    <not-my-custom-html-element>
        <style>
            not-my-custom-html-element {
                background: green;
            }
        </style>
    </not-my-custom-html-element>
`;

describe('HomeAssistantStylesManager methods', () => {

    let myElement: HTMLDivElement | null;
    let notMyElement: HTMLDivElement | null;
    let myCustomElement: HTMLElement | null;
    let notMyCustomElement: HTMLElement | null;
    let styleManager: HomeAssistantStylesManager;

    let consoleWarningFn: jest.Mock;
    let consoleSpy: jest.SpyInstance<void, Parameters<typeof console.warn>>;

    beforeAll(() => {
        customElements.define('my-custom-html-element', MyCustomHtmlElement);
        customElements.define('not-my-custom-html-element', NotMyCustomHtmlElement);
    });

    beforeEach(async () => {
        consoleWarningFn = jest.fn();
        consoleSpy = jest
            .spyOn(console, 'warn')
            .mockImplementation(consoleWarningFn);
        document.body.innerHTML = BASE_BODY;
        myElement = document.querySelector('.my-element');
        notMyElement = document.querySelector('.not-my-element');
        await customElements.whenDefined('my-custom-html-element')
            .then(() => {
                myCustomElement = document.querySelector('my-custom-html-element');
            });
        await customElements.whenDefined('not-my-custom-html-element')
            .then(() => {
                notMyCustomElement = document.querySelector('not-my-custom-html-element');
            });
        styleManager = new HomeAssistantStylesManager();
        styleManager.addStyle(
            `.my-element {
                background: red;
            }`,
            myElement
        );
        styleManager.addStyle(
            `my-custom-html-element {
                color: red;
            }`,
            myCustomElement
        );
        styleManager.addStyle(
            `.custom-li {
                background: blue;
            }`,
            myCustomElement?.shadowRoot
        );
    });

    afterEach(() => {
        consoleSpy.mockRestore();
        document.body.innerHTML = '';
    });

    describe('addStyle', () => {

        it('should add the style element to a regular HTMLElement', () => {
            const styleElement = document.querySelector<HTMLStyleElement>('#ha-styles-manager_div');
            expect(styleElement).toBeDefined();
            expect(styleElement).toBeInstanceOf(HTMLStyleElement);
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('.my-element {background: red;}');
        });

        it('should add the style element to a custom element', () => {
            const styleElement = document.querySelector<HTMLStyleElement>('#ha-styles-manager_my-custom-html-element');
            expect(styleElement).toBeDefined();
            expect(styleElement).toBeInstanceOf(HTMLStyleElement);
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('my-custom-html-element {color: red;}');
        });

        it('should add the style element to a custom element shadowRoot', () => {
            const styleElement = myCustomElement?.shadowRoot?.querySelector<HTMLStyleElement>('#ha-styles-manager_my-custom-html-element');
            expect(styleElement).toBeDefined();
            expect(styleElement).toBeInstanceOf(HTMLStyleElement);
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('.custom-li {background: blue;}');
        });

        it('should update the style element if a new CSS string is sent to a regular HTMLElement', () => {
            styleManager.addStyle(
                `.my-element {
                    background: blue;
                }`,
                myElement
            );
            const styleElement = document.querySelector<HTMLStyleElement>('#ha-styles-manager_div');
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('.my-element {background: blue;}');
        });

        it('should update the style element if a new CSS object is sent to a regular HTMLElement', () => {
            styleManager.addStyle(
                {
                    '.my-element': {
                        background: 'green'
                    },
                    '.my-element > .child': false
                },
                myElement
            );
            const styleElement = document.querySelector<HTMLStyleElement>('#ha-styles-manager_div');
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('.my-element {background: green;}');
            expect(styleElement?.sheet?.cssRules[1].cssText).toBe('.my-element > .child {display: none !important;}');
        });

        it('should update the style element if a new CSS array object is sent to a regular HTMLElement', () => {
            styleManager.addStyle(
                [
                    {
                        '.my-element': {
                            background: 'green'
                        },
                    },
                    {
                        '.my-element > .child': false
                    }
                ],
                myElement
            );
            const styleElement = document.querySelector<HTMLStyleElement>('#ha-styles-manager_div');
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('.my-element {background: green;}');
            expect(styleElement?.sheet?.cssRules[1].cssText).toBe('.my-element > .child {display: none !important;}');
        });

        it('should update the style element if a new CSS string is sent to a custom element', () => {
            styleManager.addStyle(
                `my-custom-element {
                    color: yellow;
                }`,
                myCustomElement
            );
            const styleElement = document.querySelector<HTMLStyleElement>('#ha-styles-manager_my-custom-html-element');
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('my-custom-element {color: yellow;}');
        });

        it('should update the style element if a new CSS object is sent to a custom element', () => {
            styleManager.addStyle(
                {
                    'my-custom-element': {
                        'background-color': 'gray'
                    },
                    'my-custom-element + div': false
                },
                myCustomElement
            );
            const styleElement = document.querySelector<HTMLStyleElement>('#ha-styles-manager_my-custom-html-element');
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('my-custom-element {background-color: gray;}');
            expect(styleElement?.sheet?.cssRules[1].cssText).toBe('my-custom-element + div {display: none !important;}');
        });

        it('should update the style element if a new CSS array object is sent to a custom element', () => {
            styleManager.addStyle(
                [
                    {
                        'my-custom-element': {
                            'background-color': 'gray'
                        }
                    },
                    {
                        'my-custom-element + div': false
                    }
                ],
                myCustomElement
            );
            const styleElement = document.querySelector<HTMLStyleElement>('#ha-styles-manager_my-custom-html-element');
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('my-custom-element {background-color: gray;}');
            expect(styleElement?.sheet?.cssRules[1].cssText).toBe('my-custom-element + div {display: none !important;}');
        });

        it('should update the style element if a new CSS string is sent to a custom element shadowRoot', () => {
            styleManager.addStyle(
                `.custom-li {
                    background: purple;
                }`,
                myCustomElement?.shadowRoot
            );
            const styleElement = myCustomElement?.shadowRoot?.querySelector<HTMLStyleElement>('#ha-styles-manager_my-custom-html-element');
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('.custom-li {background: purple;}');
        });

        it('should update the style element if a new CSS object is sent to a custom element shadowRoot', () => {
            styleManager.addStyle(
                {
                    '.custom-li': {
                        textAlign: 'right',
                        WebkitTextFillColor: 'red'
                    },
                    '.custom-li::after': false
                },
                myCustomElement?.shadowRoot
            );
            const styleElement = myCustomElement?.shadowRoot?.querySelector<HTMLStyleElement>('#ha-styles-manager_my-custom-html-element');
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('.custom-li {text-align: right; --webkit-text-fill-color: red;}');
            expect(styleElement?.sheet?.cssRules[1].cssText).toBe('.custom-li::after {display: none !important;}');
        });

        it('should update the style element if a new CSS array object is sent to a custom element shadowRoot', () => {
            styleManager.addStyle(
                [
                    {
                        '.custom-li': {
                            textAlign: 'right',
                            WebkitTextFillColor: 'red'
                        }
                    },
                    {
                        '.custom-li::after': false
                    }
                ],
                myCustomElement?.shadowRoot
            );
            const styleElement = myCustomElement?.shadowRoot?.querySelector<HTMLStyleElement>('#ha-styles-manager_my-custom-html-element');
            expect(styleElement?.sheet?.cssRules[0].cssText).toBe('.custom-li {text-align: right; --webkit-text-fill-color: red;}');
            expect(styleElement?.sheet?.cssRules[1].cssText).toBe('.custom-li::after {display: none !important;}');
        });

        it('should throw a warning if it is used with a non-existent element', () => {

            styleManager.addStyle(
                '.custom { display: none }',
                document.querySelector('.non-existent')
            );

            expect(consoleWarningFn).toHaveBeenCalledWith('home-assistant-styles-manager: no element has been provided calling "addStyle"');

        });

    });

    describe('getStyleElement', () => {

        it('should return the correct element from a regular HTMLElement', () => {
            const styleElement = document.querySelector('#ha-styles-manager_div');
            expect(styleManager.getStyleElement(myElement)).toBe(styleElement);
        });

        it('should return the correct element from a custom element', () => {
            const styleElement = document.querySelector('#ha-styles-manager_my-custom-html-element');
            expect(styleManager.getStyleElement(myCustomElement)).toBe(styleElement);
        });

        it('should return the correct element from a custom element shadowRoot', () => {
            const styleElement = myCustomElement?.shadowRoot?.querySelector('#ha-styles-manager_my-custom-html-element');
            expect(styleManager.getStyleElement(myCustomElement?.shadowRoot)).toBeDefined();
            expect(styleManager.getStyleElement(myCustomElement?.shadowRoot)).toBe(styleElement);
        });

        it('should return null if a regular HTML Element doesn\'t have a style created with the class', () => {
            expect(styleManager.getStyleElement(notMyElement)).toBeNull();
        });

        it('should return null if a custom element doesn\'t have a style created with the class', () => {
            expect(styleManager.getStyleElement(notMyCustomElement)).toBeNull();
        });

        it('should return null if a custom element shadowRoot doesn\'t have a style created with the class', () => {
            expect(styleManager.getStyleElement(notMyCustomElement?.shadowRoot)).toBeNull();
        });

    });

    describe('removeStyle', () => {

        it('should remove the style element from a regular element', () => {
            styleManager.removeStyle(myElement);
            const styleElement = document.querySelector('#ha-styles-manager_div');
            expect(styleElement).toBeNull();
        });

        it('should remove the style from a custom element', () => {
            styleManager.removeStyle(myCustomElement);
            const styleElement = document.querySelector('#ha-styles-manager_my-custom-html-element');
            expect(styleElement).toBeNull();
        });

        it('should remove the style from a custom element shadowRoot', () => {
            styleManager.removeStyle(myCustomElement?.shadowRoot);
            const styleElement = myCustomElement?.shadowRoot?.querySelector('#ha-styles-manager_my-custom-html-element');
            expect(styleElement).toBeNull();
        });

        it('should throw a warning if it is used with a non-existent element', () => {

            styleManager.removeStyle(
                document.querySelector('.non-existent')
            );

            expect(consoleWarningFn).toHaveBeenCalledWith('home-assistant-styles-manager: no element has been provided calling "removeStyle"');

        });

    });

});