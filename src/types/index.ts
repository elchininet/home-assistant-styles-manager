export type RootElement = Element | ShadowRoot;
export type DeclarationTree = Record<string, string>;
export type CSSInJs = Record<string, DeclarationTree | false>;

export interface Options {
    prefix?: string;
    namespace?: string;
}