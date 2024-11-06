import {
    RootElement,
    DeclarationTree,
    CSSInJs
} from '@types';

// Convert a CSS in JS to string
export const getCSSString = (cssInJs: DeclarationTree): string => {
    return Object.entries(cssInJs)
        .map((entry: [string, string]): string => {
            const [decl, value] = entry;
            return `${decl}:${value}`;
        })
        .join(';') + ';';
};

// Convert a CSS rules object to string
export const getCSSRulesString = (cssRulesInJs: CSSInJs): string => {
    return Object.entries(cssRulesInJs)
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
    css: string | CSSInJs,
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
        console.warn(`${namespace}: not element has been provided in "addStyle"`);
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
        } else {
            console.warn(`${namespace}: not style to remove in "removeStyle"`);
        }
    } else {
        console.warn(`${namespace}: not element has been provided in "removeStyle"`);
    }
};