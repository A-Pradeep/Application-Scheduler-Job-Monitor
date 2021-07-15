import { Redirect, Route, Switch } from "react-router-dom";

import Dashboard from "./Components/Dashboard";
import { DetailsPage } from "./Components/DetailsPage";
import PageNotFound from "./Components/Error Page/PageNotFound";
import LandingPage from "./Components/LandingPage";

// Toast Notify
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Switch>
        <Route path="/404" component={PageNotFound} />
        <Route path="/Dashboard" component={Dashboard} />
        <Route exact path="/jobDetails/:id" component={DetailsPage} />
        <Route exact path="/" component={LandingPage} />
        <Redirect to="/404" />
      </Switch>
    </div>
  );
}

export default App;
