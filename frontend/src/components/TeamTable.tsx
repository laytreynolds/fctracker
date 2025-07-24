import React from 'react';
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
  } from '@mui/material';
  import type{ TTeam } from '@/types/types';

interface TeamTableProps {
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    refresh: number;
  }

  export default function TeamTable({
    page,
    rowsPerPage,
    onPageChange,
    onRowsPerPageChange,
    refresh
  }: TeamTableProps) {

const [teams, setTeams] = React.useState<TTeam[]>([]);

  // Fetch Players
  React.useEffect(() => {
    fetch('http://localhost:8080/api/team/getall').then(res => res.json()).then(data => setTeams(data.teams || []));
  }, [refresh]);

return (
<Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 4 }}>
<TableContainer>
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Team</TableCell>
        <TableCell>Coach</TableCell>
        <TableCell>Founded</TableCell>       
      </TableRow>
    </TableHead>
    <TableBody>
      {teams.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((team) => (
        <TableRow key={team.ID}>
          <TableCell>{team.Name}</TableCell>
          <TableCell>{team.Coach}</TableCell>
          <TableCell>{team.Founded}</TableCell>         
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>
<TablePagination
  component="div"
  count={teams.length}
  page={page}
  onPageChange={onPageChange}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={onRowsPerPageChange}
  rowsPerPageOptions={[5, 10, 25]}
    />
  </Paper>
);
}