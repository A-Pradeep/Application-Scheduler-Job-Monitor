import moment from "moment-timezone";
import { Card, Col, Container, Row } from "react-bootstrap";
import StatusBadge from "./Common/StatusBadge";

export default function Logs({ logID }) {
  return (
    <div className="jobLogDetailCard">
      {logID.map((data, index) => {
        return (
          <>
            <Card bg={data.status === "200" ? "success" : "danger"} key={index}>
              <Card.Header as="h5">
                <Container>
                  <Row>
                    <Col>
                      <StatusBadge
                        name={data.method}
                        color="primary"
                        customClassName="uppercase"
                      />
                    </Col>
                    <Col>
                      <StatusBadge
                        name={`${data.status} : ${data.message}`}
                        color={data.status === "200" ? "light" : "danger"}
                        customClassName="uppercase"
                      />
                    </Col>
                  </Row>
                </Container>
              </Card.Header>
              <Card.Body>
                <Card.Title>{data.endpoint}</Card.Title>
                <Card.Text>
                  {moment(data.createdAt, moment.ISO_8601).format(
                    "DD MMMM YYYY - h:mm:ss a"
                  )}
                </Card.Text>
              </Card.Body>
            </Card>
            <hr />
          </>
        );
      })}
    </div>
  );
}
