import { Jumbotron } from "react-bootstrap";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div>
      <Jumbotron>
        <h1>Application Scheduler & Job Monitor</h1>
      </Jumbotron>
      <Link to="/Dashboard">Let's get started.</Link>
    </div>
  );
};

export default LandingPage;
