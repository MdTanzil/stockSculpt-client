/* eslint-disable react/prop-types */
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import {
  downloadProductCsvTemplate,
  parseCsv,
} from "@/utils/productCsv";
import { Download, Upload } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const PREVIEW_ROWS = 5;

// Bulk product import: the user downloads a template, fills it in a
// spreadsheet app, and uploads the CSV. The file is parsed in the
// browser (no upload of raw files), then sent as JSON rows to
// POST /api/products/import — the server validates every row and
// reports per-row errors, so one bad row never blocks the good ones.
const ProductImportDialog = ({ open, onClose, onImported, remaining }) => {
  const axiosSecure = useAxiosSecure();
  const [fileName, setFileName] = useState("");
  const [parsed, setParsed] = useState(null);
  const [parseError, setParseError] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const resetState = () => {
    setFileName("");
    setParsed(null);
    setParseError("");
    setResult(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    // Clear the input so choosing the same file again re-fires onChange.
    event.target.value = "";
    if (!file) return;
    setResult(null);
    const text = await file.text();
    const { headers, rows, error } = parseCsv(text);
    if (error) {
      setParseError(error);
      setParsed(null);
      setFileName(file.name);
      return;
    }
    // The file must at least have the three required columns — without
    // them every row would fail server-side with "Name is required."
    const missing = ["name", "price", "stock"].filter(
      (column) => !headers.includes(column)
    );
    if (missing.length > 0) {
      setParseError(
        `The file is missing ${missing.map((c) => `'${c}'`).join(", ")} column${missing.length === 1 ? "" : "s"}. Download the template to see the expected columns.`
      );
      setParsed(null);
      setFileName(file.name);
      return;
    }
    setParseError("");
    setParsed({ headers, rows });
    setFileName(file.name);
  };

  const handleImport = async () => {
    if (!parsed || parsed.rows.length === 0) return;
    setImporting(true);
    try {
      const { data } = await axiosSecure.post("/products/import", {
        rows: parsed.rows,
      });
      const createdCount = data.created?.length ?? 0;
      const errorCount = data.errors?.length ?? 0;
      setResult({ created: createdCount, errors: data.errors || [] });
      toast.success(
        `Imported ${createdCount} product${createdCount === 1 ? "" : "s"}` +
          (errorCount > 0
            ? ` — ${errorCount} row${errorCount === 1 ? "" : "s"} skipped`
            : "")
      );
      onImported();
    } catch (error) {
      const message =
        error.response?.data?.error || "Import failed. Please try again.";
      // A whole-batch refusal (e.g. the plan limit) still lands here;
      // show it in the dialog so the user can act on it.
      setResult({ created: 0, errors: [], batchError: message });
      toast.error(message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Import products from CSV</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Download the template, fill in one product per row (name, price
          and stock are required; discount price, category, barcode and
          description are optional), then upload the file. Rows with a
          problem are skipped and listed below — the rest are imported.
          {remaining !== undefined && (
            <>
              {" "}
              Your plan has room for {remaining} more product
              {remaining === 1 ? "" : "s"}.
            </>
          )}
        </Typography>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", my: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Download className="h-4 w-4" />}
            onClick={downloadProductCsvTemplate}
          >
            Download template
          </Button>
          <Button variant="outlined" component="label" startIcon={<Upload className="h-4 w-4" />}>
            Choose CSV file
            <input
              type="file"
              accept=".csv,text/csv"
              hidden
              onChange={handleFile}
            />
          </Button>
          {fileName && (
            <Typography variant="body2" sx={{ alignSelf: "center" }}>
              {fileName}
            </Typography>
          )}
        </Box>

        {parseError && <Alert severity="error">{parseError}</Alert>}

        {parsed && parsed.rows.length === 0 && (
          <Alert severity="warning">
            The file has no product rows — only the header line.
          </Alert>
        )}

        {parsed && parsed.rows.length > 0 && (
          <>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {parsed.rows.length} row{parsed.rows.length === 1 ? "" : "s"}{" "}
              ready to import
              {parsed.rows.length > PREVIEW_ROWS &&
                ` (showing the first ${PREVIEW_ROWS})`}
              :
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Row</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Category</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {parsed.rows.slice(0, PREVIEW_ROWS).map((row) => (
                    <TableRow key={row.row}>
                      <TableCell>{row.row}</TableCell>
                      <TableCell>{row.name || "—"}</TableCell>
                      <TableCell>{row.price || "—"}</TableCell>
                      <TableCell>{row.stock || "—"}</TableCell>
                      <TableCell>{row.category || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {result && result.batchError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {result.batchError}
          </Alert>
        )}

        {result && result.errors.length > 0 && (
          <>
            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
              {result.errors.length} row{result.errors.length === 1 ? "" : "s"}{" "}
              skipped — fix these rows and import the file again:
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Row</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Problem</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.errors.map((item, index) => (
                    <TableRow key={`${item.row}-${index}`}>
                      <TableCell>{item.row}</TableCell>
                      <TableCell>{item.name || "—"}</TableCell>
                      <TableCell>{item.error}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        {result && !result.batchError && result.errors.length === 0 && (
          <Alert severity="success" sx={{ mt: 2 }}>
            All {result.created} product{result.created === 1 ? "" : "s"}{" "}
            imported.
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={handleClose}>
          {result ? "Done" : "Cancel"}
        </Button>
        <Button
          variant="contained"
          onClick={handleImport}
          disabled={
            importing || !parsed || parsed.rows.length === 0 || !!result
          }
        >
          {importing ? "Importing..." : "Import products"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductImportDialog;
