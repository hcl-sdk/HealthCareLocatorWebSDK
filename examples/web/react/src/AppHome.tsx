import { Link } from "react-router-dom";
import Logo from './assets/logo-health-care-locator.png'
// import HclSdk from '@healthcarelocator/sdk-react';
// import { useConfig } from "./useConfig";

export default function AppHome() {
  // const config = useConfig()

  return (
    <div className="home-content">
      <img src={Logo} alt="logo" />
      <section className="home-text">
        <p>This sample app is a demo of the integration of HealthCare Locator SDK UI inside a simple server side rendered web application, using ReactJS.</p>
      </section>
      <Link to="/search" className="ui-cta">
        Search for HCPs
      </Link>
      {/* <div>
        <HclSdk config={config} widget="map" widgetProps={{
          country: 'fr',
          latitude: 48.864716,
          longitude: 2.349014,
          interactive: true
        }} />
      </div> */}
    </div>
  )
}