import { h, State, Component, Prop } from '@stencil/core'
import { RouterStore } from './provider'

@Component({
  tag: 'onekey-sdk-router-store'
})
export class OneKeySDKRouterStore {
  @State() activatedRoute: string = '';
  @Prop() renderer: Function = () => null;

  componentWillLoad() {
    this.setActivatedRoute("/");
  }

  setActivatedRoute = (route) => {
    this.activatedRoute = route
  }


  render() {
    return (
      <RouterStore.Provider state={{ 
        activatedRoute: this.activatedRoute,
        setActivatedRoute: this.setActivatedRoute
      }}>
        {this.renderer()}
      </RouterStore.Provider>
    )
  }
}

