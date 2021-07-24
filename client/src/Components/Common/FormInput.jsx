import { Form } from "react-bootstrap";

export default function FormInput({
  formID,
  label,
  type = "text",
  placeholder,
  required = false,
  message,
  ...other
}) {
  return (
    <>
      <Form.Group className="mb-3" controlId={formID}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          type={type}
          placeholder={placeholder}
          required={required}
          {...other}
        />
        <Form.Control.Feedback type="invalid">{message}</Form.Control.Feedback>
      </Form.Group>
    </>
  );
}
