import './App.scss';
import {
  BrowserRouter,
  Switch,
  Route
} from "react-router-dom";
import AppHclSdk from "./AppHclSdk";
import AppHome from './AppHome';
import Devtools from './Devtools';

function App() {
  return (
    <BrowserRouter basename="/">
      <Devtools />
      <section className="content-wrapper">
        <Switch>
          <Route path="/search">
            <AppHclSdk />
          </Route>
          <Route path="/">
            <AppHome />
          </Route>
        </Switch>
      </section>
    </BrowserRouter>
  );
}

export default App;
