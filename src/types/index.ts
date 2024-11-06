export type RootElement = HTMLElement | ShadowRoot;
export type DeclarationTree = Record<string, string>;
export type CSSInJs = Record<string, DeclarationTree | false>;