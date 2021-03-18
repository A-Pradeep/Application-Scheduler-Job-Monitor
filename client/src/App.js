import { Route, Switch } from "react-router-dom";
import Dashboard from "./Components/Dashboard";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Dashboard} />
      </Switch>
    </div>
  );
}

export default App;
