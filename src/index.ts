import {
    Options,
    RootElement,
    CSSInJs
} from '@types';
import { NAMESPACE, PREFIX } from '@constants';
import * as utilities from '@utilities';

export class HomeAssistantStylesManager {

    constructor(options: Options = {}) {
        this._prefix = options.prefix ?? PREFIX;
        this._namespace = options.namespace ?? NAMESPACE;
    }

    private _prefix: string;
    private _namespace: string;
    
    public getStyleElement(root: RootElement): HTMLStyleElement | null {
        return utilities.getStyleElement(root, this._prefix);
    }

    public addStyle(css: string | CSSInJs | CSSInJs[], root: RootElement): void {
        utilities.addStyle(
            css,
            root,
            this._prefix,
            this._namespace
        );
    }

    public removeStyle(root: RootElement): void {
        utilities.removeStyle(
            root,
            this._prefix,
            this._namespace
        );
    }
}

export type { RootElement, CSSInJs };

// These utilities are already tested
export {
    /* istanbul ignore next */
    getCSSRulesString,
    /* istanbul ignore next */
    getCSSString
} from '@utilities';