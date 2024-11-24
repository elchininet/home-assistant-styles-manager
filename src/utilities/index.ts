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

export const getCSSString = (cssInJs: DeclarationTree): string => {
    return Object.entries(cssInJs)
        .map((entry: [string, string]): string => {
            const [decl, value] = entry;
            return `${toKebabCase(decl)}:${value}`;
        })
        .join(';') + ';';
};

export const getCSSRulesString = (cssRulesInJs: CSSInJs | (string | CSSInJs)[]): string => {
    const cssInJsArray = Array.isArray(cssRulesInJs)
        ? cssRulesInJs
        : [ cssRulesInJs ];

    const cssArray = cssInJsArray.map((item: string | CSSInJs): string => {
        if (typeof item === 'string') {
            return item;
        }
        return Object.entries(item).map((entry: [string, DeclarationTree | false]): string => {
            const [rule, value] = entry;
            if (value === false) {
                return `${rule}{display: none !important}`;
            }
            return `${rule}{${getCSSString(value)}}`;
        }).join('');
    });

    return cssArray.join('');
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
    css: string | CSSInJs | (string | CSSInJs)[],
    root: RootElement | null,
    prefix: string,
    namespace: string,
    throwWarnings: boolean
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
    } else if (throwWarnings) {
        console.warn(`${namespace}: no element has been provided calling "addStyle"`);
    }
};

export const removeStyle = (
    root: RootElement | null,
    prefix: string,
    namespace: string,
    throwWarnings: boolean
): void => {
    if (root) {
        const style = getStyleElement(root, prefix);
        if (style) {
            style.remove();
        } else if (throwWarnings) {
            console.warn(`${namespace}: no style to remove calling "removeStyle"`);
        }
    } else if (throwWarnings) {
        console.warn(`${namespace}: no element has been provided calling "removeStyle"`);
    }
};