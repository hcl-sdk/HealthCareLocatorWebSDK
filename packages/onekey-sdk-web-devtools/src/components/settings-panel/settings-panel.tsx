import { Component, h, State, Event, EventEmitter, Listen } from '@stencil/core';
import { DEFAULT_THEME_PROPERTIES } from 'onekey-sdk-core';

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 22];

const ALL_PROPS = Object.keys(DEFAULT_THEME_PROPERTIES).map(k => ({
  key: k.replace(/--onekeysdk-([a-z]+)-/, (_, p) => p + '.'),
  cssKey: k,
  defaultValue: DEFAULT_THEME_PROPERTIES[k],
}));

const FONTS = ALL_PROPS.filter(n => /^font\./.test(n.key))
  .map(p => p.key.replace(/-(name|size|weight)$/, ''))
  // remove duplicated items from array
  .filter((item, pos, self) => self.indexOf(item) === pos);

const DEFAULT_VALUES = ALL_PROPS.map(font => ({ key: font.cssKey, value: getDefaultValue(font.cssKey) })).reduce(
  (acc, font) => ({
    ...acc,
    [font.key]: font.value,
  }),
  {},
);

const COLORS = ALL_PROPS.filter(n => /^color\./.test(n.key)).map(c => c.key);

function getDefaultValue(key: string) {
  const value = DEFAULT_THEME_PROPERTIES[key];
  if (/^var/.test(value)) {
    const matches = value.match(/^var\((.+)\)/);
    if (matches) {
      return DEFAULT_THEME_PROPERTIES[matches[1]];
    } else {
      throw new Error(`[devtools] problem while getting default value of '${key}'`);
    }
  }
  return value;
}

function getCustomThemeFromStorage() {
  const stored = window.localStorage.getItem('__onekeysdk-devtools-custom-theme');
  if (stored) {
    return JSON.parse(stored);
  }
  return {};
}

interface SelectedFont {
  key: string;
  name: string;
  size: string;
  weight: string;
}

interface SelectedColor {
  key: string;
  hex: string;
  r: string;
  g: string;
  b: string;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return {
    r: result ? String(parseInt(result[1], 16)) : '0',
    g: result ? String(parseInt(result[2], 16)) : '0',
    b: result ? String(parseInt(result[3], 16)) : '0',
  };
}

function componentToHex(c: string) {
  var hex = Number(c).toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}

function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function isValidRGBValue(v: string) {
  const n = Number(v);
  if (isNaN(n)) {
    return false;
  }
  return n >= 0 && n <= 255;
}
@Component({
  tag: 'settings-panel',
  styleUrl: 'settings-panel.css',
  shadow: true,
})
export class SettingsPanel {
  @Event() applyChanges: EventEmitter<any>;
  @Event() backPressed: EventEmitter<any>;

  @State() view: 'main' | 'theme' | 'font' | 'color' = 'main';

  @State() customThemeOverrides: {
    [k: string]: string;
  } = getCustomThemeFromStorage();

  @State() fields: Fields = {
    apiKey: '1234AZERTY',
    theme: (localStorage.getItem('__onekeysdk-devtools-selected-theme') as Theme) || 'default',
  };

  @State() editedFont: null | SelectedFont = null;
  @State() editedColor: null | SelectedColor = null;
  @State() isFontsExpanded: boolean = false;
  @State() isColorsExpanded: boolean = false;
  @State() colorPickerField: null | string = null;

  @Listen('jeepColorpickerGetColor')
  onColorHandler(event: CustomEvent) {
    const { r, g, b } = event.detail.rgb;
    this.editedColor = {
      ...this.editedColor,
      hex: event.detail.hex.hex,
      r: String(r),
      g: String(g),
      b: String(b),
    };
  }

  picker: any;

  componentWillLoad() {
    if (this.fields.theme === 'custom') {
      this.setCustomTheme();
    }
  }

  handleBackButton = () => {
    this.backPressed.emit();
  };

  handleChange(fieldName: keyof Fields) {
    return (evt: InputEvent) => {
      const value = (evt.target as any).value as any;
      if (fieldName === 'theme') {
        if (value === 'custom') {
          this.setCustomTheme();
        } else if (value === 'default') {
          this.setDefaultTheme();
        }
        window.localStorage.setItem('__onekeysdk-devtools-selected-theme', value);
      }
      this.fields = {
        ...this.fields,
        [fieldName]: value,
      };
    };
  }

  setDefaultTheme = () => {
    for (const k of Object.keys(this.customThemeOverrides)) {
      this.removeCustomStyleProperty(k);
    }
  };

  setCustomTheme = () => {
    for (const k of Object.keys(this.customThemeOverrides)) {
      this.setCustomStyleProperty(k, this.customThemeOverrides[k]);
    }
  };

  editTheme = () => {
    this.view = 'theme';
  };

  editFont = (fontKey: string) => {
    this.view = 'font';
    this.editedFont = {
      key: fontKey,
      name: this.getPropertyValue(`${fontKey}-name`),
      size: this.getPropertyValue(`${fontKey}-size`).replace('px', ''),
      weight: this.getPropertyValue(`${fontKey}-weight`),
    };
  };

  editColor = (colorKey: string) => {
    this.view = 'color';
    const colorHex = this.getPropertyValue(colorKey);
    this.editedColor = {
      key: colorKey,
      hex: colorHex,
      ...hexToRgb(colorHex),
    };
  };

  backToCustomTheme = () => {
    this.view = 'theme';
    this.editedFont = null;
  };

  backToSettingsHome = () => {
    this.view = 'main';
    this.editedFont = null;
  };

  setCustomStyleProperty = (propName: string, propValue: string) => {
    const el = document.querySelector('onekey-sdk') as HTMLElement;
    if (el) {
      el.style.setProperty(propName, propValue);
    }
  };

  removeCustomStyleProperty = (propName: string) => {
    const el = document.querySelector('onekey-sdk') as HTMLElement;
    if (el) {
      el.style.removeProperty(propName);
    }
  };

  applyCustomThemeProp = (prop: typeof ALL_PROPS[number], value: string) => {
    const nextCustomTheme = { ...this.customThemeOverrides };
    if (this.customThemeOverrides[prop.cssKey]) {
      if (value === DEFAULT_VALUES[prop.cssKey]) {
        delete nextCustomTheme[prop.cssKey];
        this.removeCustomStyleProperty(prop.cssKey);
      } else if (value === this.customThemeOverrides[prop.cssKey]) {
        return;
      } else {
        nextCustomTheme[prop.cssKey] = value;
        this.setCustomStyleProperty(prop.cssKey, value);
      }
    } else if (value !== DEFAULT_VALUES[prop.cssKey]) {
      nextCustomTheme[prop.cssKey] = value;
      this.setCustomStyleProperty(prop.cssKey, value);
    }
    window.localStorage.setItem('__onekeysdk-devtools-custom-theme', JSON.stringify(nextCustomTheme));
    this.customThemeOverrides = nextCustomTheme;
  };

  applyFont = () => {
    const fonts = ALL_PROPS.filter(p => p.key.includes(this.editedFont.key));
    if (fonts.length) {
      for (const k of ['name', 'size', 'weight']) {
        const prop = fonts.filter(f => f.key === `${this.editedFont.key}-${k}`)[0];
        if (prop) {
          let value = this.editedFont[k];
          if (k === 'size') {
            value = value.trim() + 'px';
          }
          this.applyCustomThemeProp(prop, value);
        }
      }
    }
    this.backToCustomTheme();
  };

  applyColor = () => {
    const value = this.editedColor.hex.trim();
    const prop = ALL_PROPS.filter(p => p.key === this.editedColor.key)[0];
    if (prop) {
      this.applyCustomThemeProp(prop, value);
    }
    this.backToCustomTheme();
  };

  updateEditedFont = (propName: string) => e => (this.editedFont = { ...this.editedFont, [propName]: (e.target as any).value });

  updateEditedColorHex = e => {
    const hex = (e.target as any).value;
    const { r, g, b } = hexToRgb(hex);
    this.editedColor = {
      ...this.editedColor,
      hex,
      r,
      g,
      b,
    };
    if (/^#[0-9a-zA-Z]{6}$/.test(hex.trim()) && this.picker) {
      this.picker.color = hex.trim();
    }
  };

  updateEditedColorRGB = (k: string) => e => {
    this.editedColor = {
      ...this.editedColor,
      [k]: (e.target as any).value,
    };
    const { r, g, b } = this.editedColor;
    if ([r, g, b].every(isValidRGBValue)) {
      this.editedColor.hex = rgbToHex(r, g, b);
    }
  };

  getPropertyValue = (propName: string) => {
    const font = ALL_PROPS.filter(f => f.key === propName)[0];
    if (font) {
      if (this.customThemeOverrides[font.cssKey]) {
        return this.customThemeOverrides[font.cssKey];
      }
      return DEFAULT_VALUES[font.cssKey];
    }
    return '';
  };

  renderPropName(propType: 'color' | 'font', propName: string) {
    return propName.replace(`${propType}.`, '').replace(/_/g, ' ').replace('bkg', 'background');
  }

  renderFontButton = (fontKey: string) => {
    return (
      <button class="var-button" onClick={() => this.editFont(fontKey)}>
        <b>{this.renderPropName('font', fontKey)}</b> <i class="right-arrow"></i>
      </button>
    );
  };

  renderColorButton = (colorKey: string) => {
    return (
      <button class="var-button" onClick={() => this.editColor(colorKey)}>
        <b>{this.renderPropName('color', colorKey)}</b>
        <i style={{ backgroundColor: this.getPropertyValue(colorKey) }} class="color-field" />
        <i class="right-arrow"></i>
      </button>
    );
  };

  renderFontWeightSelectItem = (propName: string) => {
    if (!this.editedFont) {
      return;
    }
    return (
      <option value={propName} selected={this.editedFont.weight === propName}>
        {propName}
      </option>
    );
  };

  renderMainView() {
    return (
      <section>
        <div class="title-wrapper">
          <button onClick={this.handleBackButton} class="back">
            <i class="icono-arrow1-right"></i>
          </button>
          <h2>Settings</h2>
        </div>
        <div class="row">
          <label>API Key</label>
          <input name="api-key" type="text" value={this.fields.apiKey} onChange={this.handleChange('apiKey')} />
        </div>
        <div class="row">
          <label>
            <span>Theme</span>{' '}
            {this.fields.theme === 'custom' && (
              <a class="edit-link link" href="javascript:;" onClick={this.editTheme}>
                Edit
              </a>
            )}
          </label>
          <select name="theme" onChange={this.handleChange('theme')}>
            <option value="default" selected={this.fields.theme === 'default'}>
              Default
            </option>
            {/* <option value="green" selected={this.fields.theme === 'green'}>
              Green
            </option>
            <option value="blue" selected={this.fields.theme === 'blue'}>
              Blue
            </option>
            <option value="red" selected={this.fields.theme === 'red'}>
              Red
            </option>
            <option value="purple" selected={this.fields.theme === 'purple'}>
              Purple
            </option> */}
            <option value="custom" selected={this.fields.theme === 'custom'}>
              Custom
            </option>
          </select>
        </div>
      </section>
    );
  }

  renderThemeView() {
    return (
      <section>
        <div class="title-wrapper">
          <button onClick={this.backToSettingsHome} class="back">
            <i class="icono-arrow1-right"></i>
          </button>
          <h2>Custom Theme</h2>
        </div>
        <div class="row">
          <label class="section">
            <span>Fonts</span>
            <a class="link" href="javascript:;" onClick={() => (this.isFontsExpanded = !this.isFontsExpanded)}>
              view {this.isFontsExpanded ? 'less' : 'more'}
            </a>
          </label>
          <div class="var-buttons">{FONTS.filter((_, i) => (this.isFontsExpanded ? true : i < 6)).map(this.renderFontButton)}</div>
        </div>
        <div class="row">
          <label class="section">
            <span>Colors</span>{' '}
            <a class="link" href="javascript:;" onClick={() => (this.isColorsExpanded = !this.isColorsExpanded)}>
              view {this.isColorsExpanded ? 'less' : 'more'}
            </a>
          </label>
          <div class="var-buttons">{COLORS.filter((_, i) => (this.isColorsExpanded ? true : i < 6)).map(this.renderColorButton)}</div>
        </div>
      </section>
    );
  }

  renderFontView() {
    return (
      <section>
        <div class="title-wrapper">
          <button onClick={this.backToCustomTheme} class="back">
            <i class="icono-arrow1-right"></i>
          </button>
          <h2 class="title-var">Font {this.renderPropName('font', this.editedFont.key)}</h2>
        </div>
        <div
          class="font-preview"
          style={{
            fontSize: `${this.editedFont.size}px`,
            fontFamily: this.editedFont.name,
            fontWeight: this.editedFont.weight === 'bolder' ? '900' : this.editedFont.weight,
          }}
        >
          Text Preview
        </div>
        <div class="row">
          <label>
            <span>Name</span>
          </label>
          <select name="theme" onChange={this.updateEditedFont('name')}>
            <option value="Arial" selected={this.editedFont.name === 'Arial'}>
              Arial
            </option>
            <option value="'Comic Sans MS'" selected={this.editedFont.name === `'Comic Sans MS'`}>
              Comic Sans MS
            </option>
            <option value="inherit" selected={this.editedFont.name === 'inherit'}>
              Roboto
            </option>
            <option value="Impact" selected={this.editedFont.name === 'Impact'}>
              Impact
            </option>
            <option value="Verdana" selected={this.editedFont.name === 'Verdana'}>
              Verdana
            </option>
            <option value="'Times New Roman'" selected={this.editedFont.name === `'Times New Roman'`}>
              Times New Roman
            </option>
            <option value="'Courier New'" selected={this.editedFont.name === `'Courier New'`}>
              Courier New
            </option>
          </select>
        </div>
        <div class="row">
          <label>Size</label>
          <select name="font-size" onChange={this.updateEditedFont('size')}>
            {FONT_SIZES.map(String).map(size => (
              <option value={size} selected={this.editedFont && this.editedFont.size === size}>
                {size}
              </option>
            ))}
          </select>
        </div>
        <div class="row">
          <label>Weight</label>
          <select name="font-weight" onChange={this.updateEditedFont('weight')}>
            {['lighter', 'normal', 'bold', 'bolder'].map(this.renderFontWeightSelectItem)}
          </select>
        </div>
        <button class="btn-full save-theme" onClick={this.applyFont}>
          OK
        </button>
      </section>
    );
  }

  renderColorView() {
    return (
      <section>
        <div class="title-wrapper">
          <button onClick={this.backToCustomTheme} class="back">
            <i class="icono-arrow1-right"></i>
          </button>
          <h2 class="title-var">Color {this.renderPropName('color', this.editedColor.key)}</h2>
        </div>
        <div class="row">
          <label>
            <span>Hex</span>
          </label>
          <div class="color-hex-wrapper">
            <input name="color-hex" onInput={this.updateEditedColorHex} value={this.editedColor.hex} />
            <div class="color-hex-thumb" style={{ backgroundColor: this.editedColor.hex }} />
          </div>
        </div>
        <div class="row">
          <div class="subrow">
            <label>R</label> <input type="number" min="0" max="255" name="r" onInput={this.updateEditedColorRGB('r')} value={this.editedColor.r} />
            <label>G</label> <input type="number" min="0" max="255" name="g" onInput={this.updateEditedColorRGB('g')} value={this.editedColor.g} />
            <label>B</label> <input type="number" min="0" max="255" name="b" onInput={this.updateEditedColorRGB('b')} value={this.editedColor.b} />
          </div>
        </div>
        <div class="row color-picker-wrapper">
          <jeep-colorpicker
            ref={el => {
              if (el && el !== this.picker) {
                el.open();
                el.color = this.editedColor.hex;
                this.picker = el;
              }
            }}
            opacity="1"
            hidebuttons
            hideopacity
            hideheader
            class="hydrated"
            style={{
              '--colorpicker-left': '0',
              '--colorpicker-top': '0',
              '--colorpicker-width': '260px',
              '--colorpicker-height': '210px',
              '--colorpicker-background-color': '#d6d7da',
            }}
          ></jeep-colorpicker>
        </div>
        <button class="btn-full save-theme" onClick={this.applyColor}>
          OK
        </button>
      </section>
    );
  }

  render() {
    return (
      <div class="wrapper">
        {this.view === 'main' && this.renderMainView()}
        {this.view === 'theme' && this.renderThemeView()}
        {this.view === 'font' && this.renderFontView()}
        {this.view === 'color' && this.renderColorView()}
      </div>
    );
  }
}
