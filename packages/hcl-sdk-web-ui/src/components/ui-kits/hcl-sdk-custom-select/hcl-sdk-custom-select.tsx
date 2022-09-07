import { h, Component, Host, Event, Prop, EventEmitter, State, Listen, Watch } from '@stencil/core';
import { OptionType } from '../../../core/types';
import { IconNames } from '../hcl-sdk-icon/iconNames';
import cls from 'classnames';
import { searchMapStore } from '../../../core/stores';

@Component({
  tag: 'hcl-sdk-custom-select',
  styleUrl: 'hcl-sdk-custom-select.scss',
  shadow: false,
})
export class HclSdkCustomSelect {
  @Event() loadMoreOption: EventEmitter<any>;
  @Event() selectService: EventEmitter<any>;
  @State() open: boolean = false;
  @State() selectedValue: OptionType;
  @Prop() name: string;
  @Prop() defaultValue: string;
  @Prop() options: OptionType[];
  @Prop() onChange?: (e: any) => void;
  @Prop() loadMoreOptions?: (e: any) => void;
  @Prop() level: number;
  @Prop() isLoadingService?: boolean;
  @Prop() value?: string;
  @Prop() allowEmpty?: boolean;
  componentWillLoad() {
    if (!this.allowEmpty) {
      this.selectedValue = this.options[0];
    }
  }
  inputElement: HTMLInputElement;
  inputWrapperElement: HTMLDivElement;
  listWrapperEl: HTMLElement;
  lastElement: HTMLElement;
  @Listen('click', { target: 'window' })
  handleClick(ev) {
    if (!this.open) {
      return;
    }
    const allDomNode = ev.composedPath();
    if (!allDomNode.includes(this.inputWrapperElement)) {
      this.open = false;
    }
  }
  handleFocusInput() {
    this.open = true;
  }
  handleBlurInput() {
    this.open = false;
  }

  handleOnClick() {
    this.open = true;
  }

  handleOnChangeRadio(e) {
    const indexSelected = this.options.findIndex(item => item.value === e.target.value);
    if (indexSelected > -1) {
      this.selectedValue = this.options[indexSelected]
    }
  }
  @Watch('selectedValue')
  handleChange(newVal) {
    this.onChange(newVal)
    
  }

  componentDidUpdate() {
    if (!this.open || this.isLoadingService) {
      return;
    }
    const { selectedHco } = searchMapStore.state;
    const options = {
      root: this.listWrapperEl,
      rootMargin: '0px',
      threshold: 1.0,
    };
    const callback: IntersectionObserverCallback = (entries, observe) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadMoreOption.emit(selectedHco.id);
          this.loadMoreOptions?.(selectedHco.id);
          observe.disconnect();
        }
      });
    };
    const observer = new IntersectionObserver(callback, options);
    observer.observe(this.lastElement);
  }

  render() {
    return (
      <Host>
        <div class="input-container">
          <div ref={el => (this.inputWrapperElement = el)} onClick={() => this.handleOnClick()} class="input-wrapper">
            <input
              ref={el => (this.inputElement = el)}
              onFocus={() => this.handleFocusInput()}
              onBlur={() => this.handleBlurInput()}
              type="text"
              disabled
              name={this.name}
              placeholder="Select a value"
              value={this.selectedValue.label}
            />
            {this.isLoadingService && <hcl-sdk-icon width={15} height={15} class="loader-dropdown" name="circular" />}
            <hcl-sdk-icon width={18} height={18} name={IconNames.ArrowDown}></hcl-sdk-icon>
          </div>
          <ul ref={el => (this.listWrapperEl = el)} class={cls('list-dropdown', this.open ? 'open' : '')}>
            {this.open && this.options.map((item, index) => {
              const isLast = index === this.options.length - 1;
              return (
                <li class={cls(isLast ? 'lastEl' : '', 'service-item')} {...(isLast && { ref: el => (this.lastElement = el) })}>
                  <input class="hidden" type="radio" name={this.name} id={`${item.label}`} value={item.value} onChange={(e) => this.handleOnChangeRadio(e)} />
                  <label htmlFor={`${item.label}`}>{item.label}</label>
                </li>
              );
            })}
          </ul>
        </div>
      </Host>
    );
  }
}
