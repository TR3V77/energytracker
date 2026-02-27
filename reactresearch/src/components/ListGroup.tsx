import { Fragment } from "react";

function ListGroup() {
  const items = [
    "Line Charts",
    "Bar Charts",
    "Filters: ",
    "Neighborhood",
    "Date Range",
    "Energy Type",
  ];

  return (
    <>
      <h1>List</h1>
      <ul className="list-group">
        {items.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </>
  );
}

export default ListGroup;
