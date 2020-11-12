'use strict';

const index = require('./index-7beb5087.js');

const appendToMap = (map, propName, value) => {
    const items = map.get(propName);
    if (!items) {
        map.set(propName, [value]);
    }
    else if (!items.includes(value)) {
        items.push(value);
    }
};
const debounce = (fn, ms) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            timeoutId = 0;
            fn(...args);
        }, ms);
    };
};

/**
 * Check if a possible element isConnected.
 * The property might not be there, so we check for it.
 *
 * We want it to return true if isConnected is not a property,
 * otherwise we would remove these elements and would not update.
 *
 * Better leak in Edge than to be useless.
 */
const isConnected = (maybeElement) => !('isConnected' in maybeElement) || maybeElement.isConnected;
const cleanupElements = debounce((map) => {
    for (let key of map.keys()) {
        map.set(key, map.get(key).filter(isConnected));
    }
}, 2000);
const stencilSubscription = ({ on }) => {
    const elmsToUpdate = new Map();
    if (typeof index.getRenderingRef === 'function') {
        // If we are not in a stencil project, we do nothing.
        // This function is not really exported by @stencil/core.
        on('dispose', () => {
            elmsToUpdate.clear();
        });
        on('get', (propName) => {
            const elm = index.getRenderingRef();
            if (elm) {
                appendToMap(elmsToUpdate, propName, elm);
            }
        });
        on('set', (propName) => {
            const elements = elmsToUpdate.get(propName);
            if (elements) {
                elmsToUpdate.set(propName, elements.filter(index.forceUpdate));
            }
            cleanupElements(elmsToUpdate);
        });
        on('reset', () => {
            elmsToUpdate.forEach((elms) => elms.forEach(index.forceUpdate));
            cleanupElements(elmsToUpdate);
        });
    }
};

const createObservableMap = (defaultState, shouldUpdate = (a, b) => a !== b) => {
    let states = new Map(Object.entries(defaultState !== null && defaultState !== void 0 ? defaultState : {}));
    const handlers = {
        dispose: [],
        get: [],
        set: [],
        reset: [],
    };
    const reset = () => {
        states = new Map(Object.entries(defaultState !== null && defaultState !== void 0 ? defaultState : {}));
        handlers.reset.forEach((cb) => cb());
    };
    const dispose = () => {
        // Call first dispose as resetting the state would
        // cause less updates ;)
        handlers.dispose.forEach((cb) => cb());
        reset();
    };
    const get = (propName) => {
        handlers.get.forEach((cb) => cb(propName));
        return states.get(propName);
    };
    const set = (propName, value) => {
        const oldValue = states.get(propName);
        if (shouldUpdate(value, oldValue, propName)) {
            states.set(propName, value);
            handlers.set.forEach((cb) => cb(propName, value, oldValue));
        }
    };
    const state = (typeof Proxy === 'undefined'
        ? {}
        : new Proxy(defaultState, {
            get(_, propName) {
                return get(propName);
            },
            ownKeys(_) {
                return Array.from(states.keys());
            },
            getOwnPropertyDescriptor() {
                return {
                    enumerable: true,
                    configurable: true,
                };
            },
            has(_, propName) {
                return states.has(propName);
            },
            set(_, propName, value) {
                set(propName, value);
                return true;
            },
        }));
    const on = (eventName, callback) => {
        handlers[eventName].push(callback);
        return () => {
            removeFromArray(handlers[eventName], callback);
        };
    };
    const onChange = (propName, cb) => {
        const unSet = on('set', (key, newValue) => {
            if (key === propName) {
                cb(newValue);
            }
        });
        const unReset = on('reset', () => cb(defaultState[propName]));
        return () => {
            unSet();
            unReset();
        };
    };
    const use = (...subscriptions) => subscriptions.forEach((subscription) => {
        if (subscription.set) {
            on('set', subscription.set);
        }
        if (subscription.get) {
            on('get', subscription.get);
        }
        if (subscription.reset) {
            on('reset', subscription.reset);
        }
    });
    return {
        state,
        get,
        set,
        on,
        onChange,
        use,
        dispose,
        reset,
    };
};
const removeFromArray = (array, item) => {
    const index = array.indexOf(item);
    if (index >= 0) {
        array[index] = array[array.length - 1];
        array.length--;
    }
};

const createStore = (defaultState, shouldUpdate) => {
    const map = createObservableMap(defaultState, shouldUpdate);
    stencilSubscription(map);
    return map;
};

const initStateAppStore = {};
class StoreProvider {
  constructor(initState) {
    this.setState = (states) => {
      Object.keys(states).forEach((k) => {
        this.storeInstance.set(k, states[k]);
      });
    };
    this.storeInstance = createStore(initState);
  }
  get state() {
    return this.storeInstance.state;
  }
  set state(states) {
    if (typeof states !== 'object') {
      return;
    }
    this.setState(states);
  }
}

const initStateRouterStore = {
  currentRoutePath: '/',
  routes: [{
      routePath: '/'
    }]
};
class RouterStore extends StoreProvider {
  constructor(state) {
    super(state);
    this.push = (routePath, state) => {
      this.setState({
        currentRoutePath: routePath,
        routes: [...this.state.routes, {
            name: routePath,
            state
          }]
      });
    };
    this.state = state;
  }
}

console.log(document.querySelector('onekey-sdk').offsetHeight);
const initStateConfigStore = {
  appWidth: '300px',
  appHeight: '700px',
  styles: {
    fontFamily: 'Roboto',
    color: 'black'
  },
  mapTileLayer: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
  mapLink: '<a href="http://openstreetmap.org">OpenStreetMap</a>',
  mapDefaultZoom: 5,
  markerIcon: '',
  markerIconCurrentLocation: ''
};
class ConfigStore extends StoreProvider {
  constructor(state) {
    super(state);
    this.state = state;
  }
}

const initStateSearchMapStore = {
  hcpNearMe: [],
  search: {}
};
class SearchMapStore extends StoreProvider {
  constructor(state) {
    super(state);
    this.state = state;
  }
}

const appStore = new StoreProvider(initStateAppStore);
const routerStore = new RouterStore(initStateRouterStore);
const searchMapStore = new SearchMapStore(initStateSearchMapStore);
const configStore = new ConfigStore(initStateConfigStore);

exports.configStore = configStore;
exports.routerStore = routerStore;
exports.searchMapStore = searchMapStore;
