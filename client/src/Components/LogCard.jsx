import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import parentAnimation from "../Util/animationExport";
import { http } from "../Util/http";
import StatusAnimation from "./Common/StatusAnimation";

import Logs from "./Logs";

export default function LogCard({ jobUID }) {
  const [logData, setLogData] = useState([]);
  const [loadingIcon, setLoadingIcon] = useState(false);

  useEffect(() => {
    setLoadingIcon(true);
    http
      .get(`/job/log/${jobUID}`)
      .then((response) => {
        setLogData(response.data);
        setLoadingIcon(false);
      })
      .catch((_) => {
        setLoadingIcon(false);
      });

    return () => {
      setLogData([]);
    };
  }, [jobUID]);

  if (loadingIcon) {
    return (
      <div style={{ textAlign: "center" }}>
        <StatusAnimation statusName={parentAnimation.loading3} /> Loading
        logs...
      </div>
    );
  }

  if (logData.length === 0 && !loadingIcon)
    return (
      <div style={{ textAlign: "center" }}>
        <strong>No Log for this job.</strong>
      </div>
    );

  return (
    <>
      <Card style={{ cursor: "auto" }}>
        <Card.Header as="h5">Log</Card.Header>
        <Card.Body>
          <Logs logID={logData} />
        </Card.Body>
      </Card>
    </>
  );
}
