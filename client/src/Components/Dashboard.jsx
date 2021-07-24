import { useEffect, useRef, useState } from "react";

import NewJobFormModal from "./NewJobFormModal";

import JobCard from "./Common/JobCard";
import Notify from "./Common/Notify";
import StatusAnimation from "./Common/StatusAnimation";

import parentAnimation from "../Util/animationExport";
const { http } = require("../Util/http");

const Dashboard = () => {
  const [jobData, setJobData] = useState([]);
  const [show, setShow] = useState(false);
  const [checkWebLoading, setCheckWebLoading] = useState(false);
  const [validated, setValidated] = useState(false);
  const [loadingIcon, setLoadingIcon] = useState(false);

  const formRef = useRef(null);

  const checkURL = (string) => {
    var res = string.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g
    );
    return res !== null;
  };
  const handleClose = () => {
    setShow(false);
    setCheckWebLoading(false);
    formRef.current.reset();
    setValidated(false);
  };
  const handleShow = () => setShow(true);
  const handleSubmit = (event, frequency) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    if (!checkURL(event.target.elements.formWebsite.value)) {
      event.stopPropagation();
      Notify.error("Invalid website URL.", "bottom-center");
      setValidated(true);
      return;
    }

    const title = event.target.elements.formJobName.value;
    const endpoint = event.target.elements.formWebsite.value;
    const method = event.target.elements.formMethod.value;

    http
      .post(`/job/new`, {
        title,
        currentStatus: "Active",
        method,
        alertType: "email",
        frequency,
        endpoint,
      })
      .then(({ data }) => {
        setJobData(data.newData);
        Notify.success(data.message);
        handleClose();
      })
      .catch((error) => {
        Notify.error(error);
      });
  };
  const handleDataUpdate = () => {
    http
      .get(`/job`)
      .then((response) => {
        setJobData(response.data);
      })
      .catch((error) => {
        Notify.error(error);
      });
  };
  const handleCheckWebsite = (websiteURL) => {
    setCheckWebLoading(true);
    // Check empty URL before triggering API
    if (websiteURL === null || websiteURL === "") {
      Notify.error("Website URL empty.", "bottom-center");
      setCheckWebLoading(false);
      return;
    }

    if (!checkURL(websiteURL)) {
      setCheckWebLoading(false);
      Notify.error("Invalid website URL.", "bottom-center");
      return;
    }

    http
      .get(websiteURL)
      .then(({ status, statusText }) => {
        Notify.success(`Success : ${status} : ${statusText}`, "bottom-center");
        setCheckWebLoading(false);
      })
      .catch((error) => {
        Notify.error(`Error : ${error.errno} : ${error.code}`, "bottom-center");
        setCheckWebLoading(false);
      });
  };

  useEffect(() => {
    setLoadingIcon(true);
    http
      .get(`/job`)
      .then((response) => {
        setLoadingIcon(false);
        setJobData(response.data);
      })
      .catch((error) => {
        setLoadingIcon(false);
        Notify.error(error);
      });

    // Clean Up
    return () => {
      setJobData([]);
    };
  }, []);

  if (loadingIcon) {
    return (
      <div>
        <StatusAnimation statusName={parentAnimation.loading} />
      </div>
    );
  }

  if (jobData.count === 0)
    return (
      <>
        <div className="noJobProcess">
          <span>
            Create a new Job.
            <br />
            <button className="newJobButton" onClick={handleShow}>
              New Job <StatusAnimation statusName={parentAnimation.activity} />
            </button>
          </span>
        </div>

        <NewJobFormModal
          modalShow={show}
          funClose={handleClose}
          funSubmit={handleSubmit}
          funCheckWebsite={handleCheckWebsite}
          validated={validated}
          checkWebLoading={checkWebLoading}
          formRef={formRef}
        />
      </>
    );

  return (
    <>
      <div>
        {jobData.jobsList && (
          <JobCard
            data={jobData.jobsList}
            totalCount={jobData.count}
            updateData={handleDataUpdate}
          />
        )}
      </div>
      <div className="jobButtonParent">
        <button className="newJobButtonBottom" onClick={handleShow}>
          New Job{" "}
          <StatusAnimation
            statusName={parentAnimation.activity}
            sizename={25}
          />
        </button>
        <NewJobFormModal
          modalShow={show}
          funClose={handleClose}
          funSubmit={handleSubmit}
          funCheckWebsite={handleCheckWebsite}
          validated={validated}
          checkWebLoading={checkWebLoading}
          formRef={formRef}
        />
      </div>
    </>
  );
};

export default Dashboard;
