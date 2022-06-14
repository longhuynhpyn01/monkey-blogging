import React from "react";
import styled from "styled-components";

const TableStyles = styled.div`
  overflow-x: auto;
  background-color: white;
  border-radius: 10px;
  table {
    width: 100%;
  }
  thead {
    background-color: #f7f7f8;
  }
  th,
  td {
    vertical-align: middle;
    white-space: nowrap;
  }
  th {
    padding: 20px 30px;
    font-weight: 600;
    text-align: left;
  }
  td {
    padding: 15px 30px;
  }
  tbody {
  }

  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  // cái thanh mà ta nhấn vào để kéo
  &::-webkit-scrollbar-thumb {
    /* background-image: linear-gradient(-45deg, #a4d96c, #2ebac1); */
    background-color: #8d949e;
    /* background-color: #bec3c9; */
    border-radius: 100rem;
  }

  // cái thanh nền ở dưới
  &::-webkit-scrollbar-track {
    background-color: #fafafa;
  }
`;

const Table = ({ children }) => {
  return (
    <TableStyles>
      <table>{children}</table>
    </TableStyles>
  );
};

export default Table;
