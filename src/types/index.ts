export type RootElement = Element | ShadowRoot;
export type DeclarationTree = Record<string, string | number>;
export type CSSInJs = Record<string, DeclarationTree | boolean>;

export interface Options {
    prefix?: string;
    namespace?: string;
}