import { useState } from "react";
import { Button, Col, Form, Modal } from "react-bootstrap";
import FormInput from "./Common/FormInput";
import StatusAnimation from "./Common/StatusAnimation";
import parentAnimation from "../Util/animationExport";
import CronGenerator from "./Common/CronGenerator";

export default function NewJobFormModal({
  modalShow,
  funClose,
  funSubmit,
  validated,
  checkWebLoading,
  funCheckWebsite,
  formRef,
  disableBtn,
}) {
  const [CRON, setCRON] = useState("* * * * *");
  const [postOptions, setPostOptions] = useState(false);
  const [websiteURL, setWebsiteURL] = useState(null);

  return (
    <Modal
      show={modalShow}
      onHide={funClose}
      backdrop="static"
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>New Job Schedule</Modal.Title>
      </Modal.Header>
      <Form
        noValidate
        validated={validated}
        onSubmit={(subValue) => {
          funSubmit(subValue, CRON);
        }}
        ref={formRef}
      >
        <Modal.Body>
          <Form.Text className="text-muted" style={{ float: "right" }}>
            Max length : 20
          </Form.Text>
          <FormInput
            formID="formJobName"
            label="Job Name"
            placeholder="Example : Check Website"
            required={true}
            message={"Kindly enter a Job name."}
            // Custom code below
            maxlength="20"
          />
          <FormInput
            formID="formWebsite"
            label="Website URL"
            type="url"
            placeholder="https://example.com"
            required={true}
            message={"Kindly enter Website URL."}
            // Custom code below
            onChange={(e) => {
              setWebsiteURL(e.target.value);
            }}
          />

          <Form.Row>
            <Col>
              <Form.Group
                className="mb-3"
                controlId="formMethod"
                onChange={(e) =>
                  setPostOptions(e.target.value === "POST" ? true : false)
                }
              >
                <Form.Label>Method</Form.Label>
                <Form.Control as="select">
                  <option value="GET">GET</option>
                  <option value="POST" disabled={true}>
                    POST (Coming soon...)
                  </option>
                  <option value="DELETE">DELETE</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col>
              <Form.Group className="mb-3" controlId="formAlert">
                <Form.Label>Alert Type (Coming soon...)</Form.Label>
                <Form.Control as="select" disabled={true}>
                  <option value="Email">Email (Beta)</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Form.Row>

          {postOptions && (
            <Form.Group className="mb-3">
              <Form.Label>POST Body</Form.Label>

              <Form.Control
                as="textarea"
                placeholder={` Paste JSON object.\n{\n...\n}`}
                rows={5}
                required={true}
              />
              <FormInput message={"Body value is required for POST Method."} />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="formCRON">
            <Form.Label>Frequency</Form.Label>
            <CronGenerator
              updateCRON={(value) => {
                setCRON(value);
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="warning"
            style={{ position: "absolute", left: "20px", display: "flex" }}
            onClick={() => {
              funCheckWebsite(websiteURL);
            }}
          >
            {checkWebLoading ? "Checking Website..." : "Check Website (GET)"}
            {checkWebLoading && (
              <StatusAnimation
                statusName={parentAnimation.loading}
                sizename={25}
              />
            )}
          </Button>
          <Button variant="secondary" onClick={funClose} disabled={disableBtn}>
            Close
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={disableBtn}
            style={{ display: "flex" }}
          >
            {disableBtn ? "Creating New Job" : "New Job"}
            {disableBtn && (
              <StatusAnimation
                statusName={parentAnimation.loading}
                sizename={25}
              />
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
