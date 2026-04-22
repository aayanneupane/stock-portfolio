import { useMemo, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table';
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import type { PortfolioEntry } from '../../types/stock';
import { getCurrentPrice } from '../../utils/stockHelpers';

interface PortfolioRow extends PortfolioEntry {
  currentPrice: number | null;
}

interface PortfolioTableProps {
  entries: PortfolioEntry[];
  onEdit: (entry: PortfolioEntry) => void;
  onDelete: (entry: PortfolioEntry) => void;
}

const columnHelper = createColumnHelper<PortfolioRow>();

export function PortfolioTable({ entries, onEdit, onDelete }: PortfolioTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const data = useMemo<PortfolioRow[]>(
    () =>
      entries.map((entry) => ({
        ...entry,
        currentPrice: getCurrentPrice(entry.ticker),
      })),
    [entries]
  );

  const columns = useMemo(
    () => [
      columnHelper.accessor('ticker', {
        header: 'Ticker',
        cell: (info) => (
          <Typography sx={{ fontWeight: 700 }} color="primary">
            {info.getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor('companyName', {
        header: 'Company Name',
      }),
      columnHelper.accessor('quantity', {
        header: 'Quantity',
        cell: (info) => info.getValue().toLocaleString(),
      }),
      columnHelper.accessor('purchasePrice', {
        header: 'Purchase Price',
        cell: (info) => `Rs. ${info.getValue().toFixed(2)}`,
      }),
      columnHelper.accessor('currentPrice', {
        header: 'Current Price',
        cell: (info) => {
          const price = info.getValue();
          return price === null ? 'N/A' : `Rs. ${price.toFixed(2)}`;
        },
      }),
      columnHelper.accessor('purchaseDate', {
        header: 'Date of Purchase',
        cell: (info) => new Date(info.getValue()).toLocaleDateString(),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: (info) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Edit">
              <IconButton size="small" color="primary" onClick={() => onEdit(info.row.original)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton size="small" color="error" onClick={() => onDelete(info.row.original)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      }),
    ],
    [onDelete, onEdit]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <Box>
      <Box sx={{ mb: 2, maxWidth: 360 }}>
        <TextField
          value={globalFilter ?? ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search stocks"
          size="small"
          fullWidth
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>
      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: 'grey.50' }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    sx={{
                      fontWeight: 700,
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} hover>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
