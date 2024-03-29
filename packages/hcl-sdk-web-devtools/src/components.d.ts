/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { Fields } from "./types";
export namespace Components {
    interface SettingsPanel {
        "getFields": () => Promise<Fields>;
    }
}
declare global {
    interface HTMLSettingsPanelElement extends Components.SettingsPanel, HTMLStencilElement {
    }
    var HTMLSettingsPanelElement: {
        prototype: HTMLSettingsPanelElement;
        new (): HTMLSettingsPanelElement;
    };
    interface HTMLElementTagNameMap {
        "settings-panel": HTMLSettingsPanelElement;
    }
}
declare namespace LocalJSX {
    interface SettingsPanel {
        "onApplyChanges"?: (event: CustomEvent<any>) => void;
        "onBackPressed"?: (event: CustomEvent<any>) => void;
        "onReady"?: (event: CustomEvent<any>) => void;
    }
    interface IntrinsicElements {
        "settings-panel": SettingsPanel;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "settings-panel": LocalJSX.SettingsPanel & JSXBase.HTMLAttributes<HTMLSettingsPanelElement>;
        }
    }
}
