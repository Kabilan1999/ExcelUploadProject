import React, { useState } from "react";
import {
  Button,
  Paper,
  SvgIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import XLSX from "xlsx";
import MaterialTable from "material-table";
import ArrowUpOnSquareIcon from "@heroicons/react/24/solid/ArrowUpOnSquareIcon";

const ExcelUpload = ({ filteredData, setFilteredData, setColumnHeaders }) => {
  const [rowData, setRowData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        debugger;
        // Extract the first row for column headers
        const firstData = jsonData[0];
        const columnData = firstData.map((name, index) => {
          debugger;
          return { title: `${index === 0 ? "SL.NO" : name}`, field: `${index}` };
        });
        debugger;
        setColumnHeaders(columnData || []);
        console.log("jsonData.slice(1)", jsonData.slice(1));
        // Extract the remaining rows as data
        setRowData(jsonData.slice(1));

        // Set filtered data initially
        setFilteredData(jsonData.slice(1));
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }

    setSortConfig({ key, direction });
  };

  const handleFilter = () => {
    const filteredData = rowData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    setFilteredData(filteredData);
  };

  return (
    <div>
      <input
        style={{ display: "none" }}
        id="excel-upload"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />
      <label htmlFor="excel-upload">
        <Button
          component="span"
          htmlFor="excel-upload"
          color="inherit"
          startIcon={
            <SvgIcon fontSize="small">
              <ArrowUpOnSquareIcon />
            </SvgIcon>
          }
        >
          Import
        </Button>
      </label>
    </div>
  );
};

export default ExcelUpload;
