import {
    RootElement,
    DeclarationTree,
    CSSInJs
} from '@types';
import { KEBAB_CASE_REGEXP } from '@constants';


// Convert from CamelCase to kebab-case
const toKebabCase = (value: string): string => {
    return value.replace(KEBAB_CASE_REGEXP, (
        __match: string,
        firstLetter: string,
        restLetters: string,
        offset: number
    ): string => {
        const lowerCased = firstLetter.toLocaleLowerCase();
        if (offset) {
            return `-${lowerCased}${restLetters}`;
        }
        return `--${lowerCased}${restLetters}`;
    });
};

const flatCSSInJsArray = (cssRulesInJsArray: CSSInJs[]): CSSInJs => {
    return cssRulesInJsArray.reduce((flatRules: CSSInJs, rules: CSSInJs): CSSInJs => {
        flatRules = {
            ...flatRules,
            ...rules
        };
        return flatRules;
    }, {});
};

export const getCSSString = (cssInJs: DeclarationTree): string => {
    return Object.entries(cssInJs)
        .map((entry: [string, string]): string => {
            const [decl, value] = entry;
            return `${toKebabCase(decl)}:${value}`;
        })
        .join(';') + ';';
};

export const getCSSRulesString = (cssRulesInJs: CSSInJs | CSSInJs[]): string => {
    const rules = Array.isArray(cssRulesInJs)
        ? flatCSSInJsArray(cssRulesInJs)
        : cssRulesInJs;
    return Object.entries(rules)
        .map((entry: [string, DeclarationTree | false]): string => {
            const [rule, value] = entry;
            if (value === false) {
                return `${rule}{display: none !important}`;
            }
            return `${rule}{${getCSSString(value)}}`;
        }).join('');
};

const getStyleElementId = (
    name: string,
    prefix: string
): string => `${prefix}_${name}`;

const getRootElementName = (root: RootElement): string => {
    if (root instanceof ShadowRoot) {
        return root.host.localName;
    }
    return root.localName;
};

export const getStyleElement = (
    root: RootElement,
    prefix: string
): HTMLStyleElement | null => {
    const id = getStyleElementId(
        getRootElementName(root),
        prefix
    );
    return root.querySelector<HTMLStyleElement>(`#${id}`);
};

export const addStyle = (
    css: string | CSSInJs | CSSInJs[],
    root: RootElement | null,
    prefix: string,
    namespace: string
): void => {
    if (root) {
        let style = getStyleElement(root, prefix);
        if (!style) {
            const id = getStyleElementId(
                getRootElementName(root),
                prefix
            );
            style = document.createElement('style');
            style.setAttribute('id', id);
            root.appendChild(style);
        }
        style.innerHTML = typeof css === 'string'
            ? css
            : getCSSRulesString(css);
    } else {
        console.warn(`${namespace}: no element has been provided in "addStyle"`);
    }
};

export const removeStyle = (
    root: RootElement | null,
    prefix: string,
    namespace: string
): void => {
    if (root) {
        const style = getStyleElement(root, prefix);
        if (style) {
            style.remove();
        }
    } else {
        console.warn(`${namespace}: no element has been provided in "removeStyle"`);
    }
};