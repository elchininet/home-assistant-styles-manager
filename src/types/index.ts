export type RootElement = Element | ShadowRoot;

export type CSSInJs = {
    [key: string]: string | number | boolean | CSSInJs;
};

export interface Options {
    prefix?: string;
    namespace?: string;
    throwWarnings?: boolean;
}