import { useEffect, useState } from "react";

import {
  Button,
  Card,
  Col,
  Container,
  Nav,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";

import StatusAnimation from "./Common/StatusAnimation";
import parentAnimation from "../Util/animationExport";

import { http } from "../Util/http";
import { Link, Redirect } from "react-router-dom";
import StatusBadge from "./Common/StatusBadge";
import CustomModal from "./Common/CustomModal";
import Notify from "./Common/Notify";
import LogCard from "./LogCard";

import cronstrue from "cronstrue";

const DetailsPage = (props) => {
  const UID = props.match.params.id;

  const [jobDetail, setJobDetail] = useState([]);
  const [loadingIcon, setLoadingIcon] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [show, setShow] = useState(false);
  const [modalTitle, setModalTitle] = useState();
  const [modalBody, setModalBody] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDelete = () => {
    handleShow();
    setModalTitle("Delete Job");
    setModalBody("Do you really want to delete the Job ?");
  };
  const handleYes = () => {
    setShow(false);
    if (modalTitle === "Restart Job") {
      http
        .post(`/job/restart`, { id: UID })
        .then((response) => {
          Notify.success(response.data.message);
          handleUpdate();
        })
        .catch((error) => {
          Notify.error(error);
        });
    } else if (modalTitle === "Delete Job") {
      http
        .delete(`/job/delete/${UID}`)
        .then((response) => {
          Notify.error(response.data.message);
          setRedirect("Dashboard");
        })
        .catch((error) => {
          Notify.error(error);
        });
    } else {
      http
        .post(`/job/stop`, { id: UID })
        .then((response) => {
          Notify.warning(response.data.message);
          handleUpdate();
        })
        .catch((error) => {
          Notify.error(error);
        });
    }
  };
  const handleUpdate = () => {
    http
      .get(`/job/details/${UID}`)
      .then((response) => {
        setJobDetail(response.data);
        setLoadingIcon(false);
      })
      .catch((_) => {
        setLoadingIcon(false);
        setRedirect("404");
      });
  };

  useEffect(() => {
    setLoadingIcon(true);
    http
      .get(`/job/details/${UID}`)
      .then((response) => {
        setJobDetail(response.data);
        setLoadingIcon(false);
      })
      .catch((_) => {
        setLoadingIcon(false);
        setRedirect("404");
      });

    return () => {
      setJobDetail([]);
    };
  }, [UID]);

  if (loadingIcon) {
    return (
      <div>
        <StatusAnimation statusName={parentAnimation.loading} />
      </div>
    );
  }

  if (redirect) {
    return <Redirect to={`/${redirect}`}></Redirect>;
  }

  return (
    jobDetail.length !== 0 && (
      <>
        <Nav className="justify-content-start" activeKey="/home">
          <Nav.Item>
            <Link to="/Dashboard">
              <StatusAnimation statusName={parentAnimation.arrowLeftCircle} />
            </Link>
          </Nav.Item>
        </Nav>

        {/* JOb Details */}
        <Container style={{ fontWeight: "600" }}>
          <Row>
            <Col>
              <Card style={{ cursor: "auto" }}>
                <Card.Header as="h5">ID : {jobDetail._id}</Card.Header>
                <Card.Body>
                  <Card.Title>
                    <h2>{jobDetail.title}</h2>
                    <div style={{ float: "right" }}>
                      <StatusBadge
                        color={
                          jobDetail.currentStatus === "Stopped"
                            ? "danger"
                            : "success"
                        }
                        name={
                          jobDetail.currentStatus === "Stopped"
                            ? "INACTIVE"
                            : "ACTIVE"
                        }
                        customClassName="uppercase"
                      />
                    </div>
                  </Card.Title>
                  <Card.Text>
                    <Link
                      onClick={() => {
                        window.open(`${jobDetail.endpoint}`);
                      }}
                    >
                      {jobDetail.endpoint}
                    </Link>
                  </Card.Text>

                  <Row>
                    <Col>
                      Method: <StatusBadge name={jobDetail.method} />
                    </Col>
                    <Col
                      xs
                      lg="5"
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                      }}
                    >
                      Frequency :<strong>{jobDetail.frequency}</strong>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip id={jobDetail._id}>
                            {cronstrue.toString(jobDetail.frequency)}
                          </Tooltip>
                        }
                      >
                        <span>
                          <StatusAnimation
                            statusName={parentAnimation.info}
                            sizename="25"
                          />
                        </span>
                      </OverlayTrigger>
                    </Col>
                    <Col>Alert : {jobDetail.alertType}</Col>
                  </Row>

                  <hr />
                  <Row style={{ textAlign: "center" }}>
                    <Col>
                      <Button
                        variant={
                          jobDetail.currentStatus === "Stopped"
                            ? "primary"
                            : "warning"
                        }
                        onClick={() => {
                          handleShow();
                          setModalTitle(
                            jobDetail.currentStatus === "Stopped"
                              ? "Restart Job"
                              : "Stop Job"
                          );
                          setModalBody(
                            `Do you want to ${
                              jobDetail.currentStatus === "Stopped"
                                ? "Restart Job"
                                : "Stop Job"
                            } ?`
                          );
                        }}
                      >
                        {jobDetail.currentStatus === "Stopped"
                          ? "Restart"
                          : "Stop"}
                      </Button>
                    </Col>
                    <Col>
                      <Button variant="danger" onClick={handleDelete}>
                        Delete
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <LogCard jobUID={UID} />
            </Col>
          </Row>
        </Container>

        <CustomModal
          show={show}
          funClose={handleClose}
          modalTitle={modalTitle}
          modalBody={modalBody}
          funYes={handleYes}
        />
      </>
    )
  );
};

export default DetailsPage;
