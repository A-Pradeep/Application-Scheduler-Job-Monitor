import React from "react";
import { Badge } from "react-bootstrap";

export default function StatusBadge({
  color = "primary",
  name,
  customClassName = "",
}) {
  return (
    <>
      <Badge pill variant={color} className={customClassName}>
        {name}
      </Badge>
    </>
  );
}
