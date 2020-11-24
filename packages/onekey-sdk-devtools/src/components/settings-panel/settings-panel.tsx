import { Color } from '@jeepq/core/dist/types/global/interfaces/color';
import { Component, h, State, Event, EventEmitter } from '@stencil/core';
import { THEMES } from '../../constants/themes';

const FONT_SIZES = [8, 10, 12, 14, 16, 18, 20, 22];

@Component({
  tag: 'settings-panel',
  styleUrl: 'settings-panel.css',
  shadow: true,
})
export class SettingsPanel {
  @Event() applyChanges: EventEmitter<any>;
  @Event() backPressed: EventEmitter<any>;

  @State() view: 'main' | 'theme' = 'main';

  @State() fields: Fields = {
    apiKey: '1234AZERTY',
    theme: 'blue',
    customTheme: {
      font: 'Arial',
      colorPrimary: '#0074D9',
      colorSecondary: '#2ECC40',
      colorMarker: '#FF851B',
      colorMarkerSelected: '#85144b',
      fontSizeBase: '14',
      fontSizeTitle: '20',
    },
  };

  @State() customThemeEdit: CustomThemeFields = this.fields.customTheme;

  @State() colorPickerField: null | string = null;

  handleBackButton = () => {
    this.backPressed.emit();
  }

  handleChange(fieldName: keyof Fields) {
    return (evt: InputEvent) => {
      const value = (evt.target as any).value as any;
      if (fieldName === 'theme' && value === 'custom') {
        this.view = 'theme';
      }
      this.fields = {
        ...this.fields,
        [fieldName]: value,
      };
    };
  }

  handleChangeCustomTheme(fieldName: keyof CustomThemeFields) {
    return (evt: InputEvent) => {
      const value = (evt.target as any).value as any;
      this.customThemeEdit = {
        ...this.customThemeEdit,
        [fieldName]: value,
      };
    };
  }

  discardEditTheme = () => {
    if (this.customThemeEdit === this.fields.customTheme) {
      this.view = 'main';
    } else if (confirm('Discard changes?')) {
      this.customThemeEdit = this.fields.customTheme;
      this.view = 'main';
    }
  };

  saveEditTheme = () => {
    this.fields.customTheme = this.customThemeEdit;
    this.view = 'main';
  }

  editTheme = () => {
    this.view = 'theme';
  };

  handleColorPickerClose = (evt) => {
    if (evt.detail.button === 1) {
      const color = evt.detail.color as Color;
      this.customThemeEdit = {
        ...this.customThemeEdit,
        [this.colorPickerField]: color.hex.hex
      }
    }
    this.colorPickerField = null;
  };

  setStyles = (el: HTMLElement) => {
    const theme = this.fields.theme === 'custom' ? this.fields.customTheme : THEMES[this.fields.theme];
    el.style.setProperty('--onekeysdk-color-primary', theme.colorPrimary);
    el.style.setProperty('--onekeysdk-color-secondary', theme.colorSecondary);
    el.style.setProperty('--onekeysdk-color-marker', theme.colorMarker);
    el.style.setProperty('--onekeysdk-color-marker-selected', theme.colorMarkerSelected);
    el.style.setProperty('--onekeysdk-font-size', theme.fontSizeBase + 'px');
    el.style.setProperty('--onekeysdk-font-size-title', theme.fontSizeTitle + 'px');
  }

  handleApplyChanges = () => {
    const el = document.querySelector('onekey-sdk') as HTMLElement;
    if (el) {
      this.setStyles(el);
    }
    this.applyChanges.emit(this.fields);
  };

  renderMainView() {
    return (
      <section>
        <div class="title-wrapper">
          <button onClick={this.handleBackButton} class="back">{`⬅`}</button>
          <h2>Settings</h2>
        </div>
        <div class="row">
          <label>API Key</label>
          <input name="api-key" type="text" value={this.fields.apiKey} onChange={this.handleChange('apiKey')} />
        </div>
        <div class="row">
          <label>Theme</label>
          <select name="theme" onChange={this.handleChange('theme')}>
            <option value="green" selected={this.fields.theme === 'green'}>
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
            </option>
            <option value="custom" selected={this.fields.theme === 'custom'}>
              Custom
            </option>
          </select>
          {this.fields.theme === 'custom' && (
            <a class="edit-link" href="javascript:;" onClick={this.editTheme}>
              Edit
            </a>
          )}
        </div>
        <button class="btn-full save-theme" onClick={this.handleApplyChanges}>Apply</button>
      </section>
    );
  }

  renderThemeView() {
    return (
      <section>
        <div class="title-wrapper">
          <button onClick={this.discardEditTheme} class="back">{`⬅`}</button>
          <h2>Custom Theme</h2>
        </div>
        <div class="row">
          <label>Font</label>
          <select name="theme" onChange={this.handleChangeCustomTheme('font')}>
            <option value="Arial" selected={this.fields.customTheme.font === 'Arial'}>
              Arial
            </option>
            <option value="Roboto" selected={this.fields.customTheme.font === 'Roboto'}>
              Roboto
            </option>
            <option value="Impact" selected={this.fields.customTheme.font === 'Impact'}>
              Impact
            </option>
          </select>
        </div>
        <div class="row">
          <label>Font Sizes</label>
          <div class="subrow">
            <label>Base</label> {this.renderFontSelect('fontSizeBase')}
            <label>Title</label> {this.renderFontSelect('fontSizeTitle')}
          </div>
        </div>
        <div class="row">
          <label>Colors</label>
          <div class="subrow">
            <div class="color-field-wrapper">
              {this.renderColorField('colorPrimary')}
              <label htmlFor="color-colorPrimary">Primary</label>
            </div>
            <div class="color-field-wrapper">
              {this.renderColorField('colorSecondary')}
              <label htmlFor="color-colorSecondary">Secondary</label>
            </div>
            <div class="color-field-wrapper">
              {this.renderColorField('colorMarker')}
              <label htmlFor="color-colorMarker">Marker</label>
            </div>
            <div class="color-field-wrapper">
              {this.renderColorField('colorMarkerSelected')}
              <label htmlFor="color-colorMarkerSelected">Selected Marker</label>
            </div>
          </div>
        </div>
        <button class="btn-full save-theme" onClick={this.saveEditTheme}>Save</button>
      </section>
    );
  }

  renderColorField(fieldName: string) {
    return (
      <button
        id={`color-${fieldName}`}
        style={{ backgroundColor: this.customThemeEdit[fieldName] }}
        onClick={() => {
          this.colorPickerField = fieldName;
        }}
        class="color-field"
      />
    );
  }

  renderFontSelect(fieldName: keyof CustomThemeFields) {
    return (
      <select name={fieldName} class="font-size" onChange={this.handleChangeCustomTheme(fieldName)}>
        {FONT_SIZES.map(String).map(size => (
          <option value={size} selected={this.fields.customTheme[fieldName] === size}>
            {size}
          </option>
        ))}
      </select>
    );
  }

  render() {
    return (
      <div class="wrapper">
        {this.view === 'main' && this.renderMainView()}
        {this.view === 'theme' && this.renderThemeView()}
        {this.colorPickerField && (
          <jeep-cpicker
            onJeepCpickerClose={this.handleColorPickerClose}
            color={this.customThemeEdit[this.colorPickerField] || '#FFFFFF'}
            opacity="1"
            buttons="[✔,X]"
            hideopacity
            class="hydrated"
            style={{
              '--cpicker-left': '20px',
              '--cpicker-top': '150px',
              '--cpicker-width': '260px'
            }}
          ></jeep-cpicker>
        )}
      </div>
    );
  }
}
