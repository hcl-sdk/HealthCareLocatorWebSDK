import { Component, h, Prop, State, Watch } from '@stencil/core';
import { graphql } from '../../../../../hcl-sdk-core/src';
import { ActivityCriteriaScope, ActivitiesResult, QueryActivitiesArgs } from '../../../../../hcl-sdk-core/src/graphql/types';
import { configStore, i18nStore, searchMapStore } from '../../../core/stores';
import { WidgetMap, WidgetProps } from '../../../core/types';
import { handleMapActivities } from '../../../utils/helper';

const defaultProps = () => ({
  mapHeight: "150px",
  interactive: false,
  isSearchNearMe: true
})

@Component({
  tag: 'hcl-sdk-widget-map',
  styleUrl: 'hcl-sdk-widget-map.scss',
})

export class HclSdkWidgetMap {
  @State() locations: any[] = []
  @State() props: WidgetMap
  @Prop() widgetProps: WidgetMap = {}

  cachedQuery: Record<string, ActivitiesResult[] | boolean> = {}

  @Watch('widgetProps')
  watchWidgetPropsHandler(newValue: WidgetProps, _: WidgetProps) {
    const newProps = {
      ...this.props,
      ...newValue
    }
    const oldParams = this.generateParams(this.props)
    const newParams = this.generateParams(newProps)

    this.props = newProps

    if (JSON.stringify(oldParams) !== JSON.stringify(newParams)) {
      this.loadActivities()
    }
  }

  componentWillLoad() {
    this.props = {
      ...defaultProps(),
      ...(this.widgetProps || {})
    }
    configStore.storeInstance.onChange('countryGeo', this.onChangeGeoCountry)

    if (!searchMapStore.isGrantedGeoloc || !configStore.state.countryGeo) return

    this.loadActivities()
  }

  onChangeGeoCountry = (newGeoCountry: string) => {
    if (newGeoCountry) {
      this.loadActivities()
    }
  }

  generateParams = (props: WidgetMap) => {
    const isSearchNearMe = !props.latitude && !props.longitude
    const params: Partial<QueryActivitiesArgs> = {
      country: isSearchNearMe ? configStore.state.countryGeo : props.country,
      first: 50,
      offset: 0,
      locale: i18nStore.state.lang,
    };

    if (isSearchNearMe) {
      params.location = {
        lat: searchMapStore.state.geoLocation.latitude,
        lon: searchMapStore.state.geoLocation.longitude,
      }
    } else if (props.latitude && props.longitude) {
      params.location = {
        lat: props.latitude,
        lon: props.longitude,
      }
    }

    if (props.specialties?.length) {
      params.specialties = props.specialties
    }

    if (props.medTerms?.length) {
      params.medTerms = props.medTerms
    }

    if (props.criteria?.length) {
      params.criterias = [
        { text: props.criteria, scope: ActivityCriteriaScope.IndividualNameAutocomplete }
      ]
    }
    return params
  }

  async loadActivities() {
    try {
      const params = this.generateParams(this.props)
      const paramsStr = JSON.stringify(params)
      const cachedValue = this.cachedQuery[paramsStr]

      if (cachedValue) {
        if (typeof cachedValue !== 'boolean') {
          this.locations = cachedValue
        }
        return
      }

      this.cachedQuery[paramsStr] = true
      const activitiesResult = await graphql.activities(params, configStore.configGraphql)

      this.locations = (activitiesResult?.activities?.edges || []).map(activity => handleMapActivities(activity));
      this.cachedQuery[paramsStr] = this.locations
    } catch(err) {}
  }

  render() {
    const isSearchNearMe = !this.props.latitude && !this.props.longitude

    return (
      <div class="hcl-sdk-widget-map">
        <hcl-sdk-map
          locations={this.locations}
          selectedLocationIdx={0}
          noCurrentLocation
          zoomControl={false}
          mapHeight={this.props.mapHeight}
          interactive={this.props.interactive}
          dragging={this.props.interactive}
          isShowMeMarker={true}
          isForcedZoomToMe={isSearchNearMe}
        />
      </div>
    )
  }
}