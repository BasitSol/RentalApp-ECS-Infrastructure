import {
  Delete as DeleteIcon, ModeEdit as ModeEditIcon
} from "@mui/icons-material";
import {
  Paper, Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import React from "react";


export default function TableData({ TableHeads = [], data = [], handleClick, shouldDisplayActions = true }) {
  return (
    <div>
      <TableContainer component={Paper} sx={{ marginBottom: '5rem' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Sr</TableCell>
              {TableHeads.map((el, key) => (
                <TableCell align="center" key={key}>
                  {el.title}
                </TableCell>
              ))}
              {
                shouldDisplayActions ?
                  <TableCell align="center">Actions</TableCell> : null
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{row[TableHeads[0]["key"]]}</TableCell>
                <TableCell align="center">{row[TableHeads[1]["key"]]}</TableCell>
                <TableCell align="center">{row[TableHeads[2]["key"]]}</TableCell>
                <TableCell align="center">{row[TableHeads[3]["key"]]}</TableCell>
                <TableCell align="center">
                  {
                    shouldDisplayActions ?
                      row.rowIcon ? row.rowIcon :
                        <>
                          <ModeEditIcon onClick={() => handleClick("edit", row._id)} />
                          <DeleteIcon onClick={() => handleClick("delete", row._id)} />
                        </>
                      : null
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}




