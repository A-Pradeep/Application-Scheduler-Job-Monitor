import { useState } from "react";
import { Accordion, Button, Card, Col, Container, Row } from "react-bootstrap";
import moment from "moment-timezone";
import { Link } from "react-router-dom";

import StatusAnimation from "./StatusAnimation";
import parentAnimation from "../../Util/animationExport";
import StatusBadge from "./StatusBadge";
import CustomModal from "./CustomModal";
import { http } from "../../Util/http";
import Notify from "./Notify";

const JobCard = ({ data, totalCount, updateData }) => {
  const [show, setShow] = useState(false);
  const [modalBody, setModalBody] = useState();
  const [modalTitle, setModalTitle] = useState();
  const [currentUID, setCurrentUID] = useState(null);

  const deleteIcon = () => {
    handleShow();
    setModalTitle("Delete Job");
    setModalBody("Do you really want to delete the Job ?");
  };
  const handleClose = () => {
    setShow(false);
    setCurrentUID(null);
  };
  const handleShow = () => setShow(true);
  const handleYes = () => {
    setShow(false);
    if (modalTitle === "Restart Job") {
      http
        .post(`${process.env.REACT_APP_URL}/job/restart`, { id: currentUID })
        .then((response) => {
          Notify.success(response.data.message);
          updateData();
        })
        .catch((error) => {
          Notify.error(error);
        });
    } else if (modalTitle === "Delete Job") {
      http
        .delete(`${process.env.REACT_APP_URL}/job/delete/${currentUID}`)
        .then((response) => {
          Notify.error(response.data.message);
          updateData();
        })
        .catch((error) => {
          Notify.error(error);
        });
    } else {
      http
        .post(`${process.env.REACT_APP_URL}/job/stop`, { id: currentUID })
        .then((response) => {
          Notify.warning(response.data.message);
          updateData();
        })
        .catch((error) => {
          Notify.error(error);
        });
    }
  };

  return (
    <>
      <Accordion>
        {data.map((job, index) => (
          <Card key={index}>
            <Accordion.Toggle as={Card.Header} eventKey={`${index + 1}`}>
              <Container>
                <Row>
                  <Col>
                    {job.currentStatus === "Active" && (
                      <StatusAnimation statusName={parentAnimation.activity} />
                    )}
                    {job.currentStatus !== "Active" && (
                      <StatusAnimation
                        statusName={parentAnimation.alertCircle}
                      />
                    )}
                  </Col>
                  <Col>
                    <b>{job.title}</b>
                  </Col>
                  <Col>
                    <StatusBadge name={job.method} />
                  </Col>
                  <Col>
                    {index + 1} of {totalCount}
                  </Col>
                  <Col>{moment(job.createdAt, moment.ISO_8601).fromNow()}</Col>
                  <Col>
                    <Button
                      type="Button"
                      variant={`outline-${
                        job.currentStatus === "Stopped" ? "primary" : "danger"
                      }`}
                      onClick={() => {
                        handleShow();
                        setModalTitle(
                          job.currentStatus === "Stopped"
                            ? "Restart Job"
                            : "Stop Job"
                        );
                        setModalBody(
                          `Do you want to ${
                            job.currentStatus === "Stopped"
                              ? "Restart Job"
                              : "Stop Job"
                          } ?`
                        );
                        setCurrentUID(job._id);
                      }}
                    >
                      {job.currentStatus === "Stopped"
                        ? "Restart Job"
                        : "Stop Job"}
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={`${index + 1}`}>
              <Card.Body>
                <b>
                  <Container>
                    <Row>
                      <Col>
                        Created At :{" "}
                        {moment(job.createdAt, moment.ISO_8601).format(
                          "DD MMMM YYYY - h:mm:ss a"
                        )}
                      </Col>
                      <Col>
                        Status :{" "}
                        <StatusBadge
                          color={
                            job.currentStatus === "Stopped"
                              ? "danger"
                              : "success"
                          }
                          name={
                            job.currentStatus === "Stopped"
                              ? "INACTIVE"
                              : "ACTIVE"
                          }
                          customClassName="uppercase"
                        />
                      </Col>
                      <Col>
                        Request Type : <StatusBadge name={job.method} />
                      </Col>
                      <Col xs={1}>
                        <Link
                          to={`/jobDetails/${job._id}`}
                          style={{ display: "flex" }}
                        >
                          Info
                          <StatusAnimation
                            statusName={parentAnimation.arrowRightCircle}
                            sizename={25}
                          />
                        </Link>
                      </Col>
                      <Col xs={1}>
                        <StatusAnimation
                          statusName={parentAnimation.share}
                          sizename={25}
                        />
                      </Col>
                      <Col xs={1}>
                        <StatusAnimation
                          statusName={parentAnimation.trash2}
                          sizename={25}
                          customFun={() => {
                            setCurrentUID(job._id);
                            deleteIcon();
                          }}
                        />
                      </Col>
                    </Row>
                  </Container>
                </b>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>

      <CustomModal
        show={show}
        funClose={handleClose}
        modalTitle={modalTitle}
        modalBody={modalBody}
        funYes={handleYes}
      />
    </>
  );
};

export default JobCard;
