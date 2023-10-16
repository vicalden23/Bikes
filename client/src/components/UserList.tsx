import React, { useState } from 'react';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Dialog,
  styled,
} from '@mui/material';

import { User, handleRemoveUser } from '../requests';
import AccountForm from './AccountForm';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    padding: '20px',
  },
}));

function UserList({
  users,
  setCustomers,
  setManagers,
}: {
  users: User[];
  setCustomers: React.Dispatch<React.SetStateAction<User[]>>;
  setManagers: React.Dispatch<React.SetStateAction<User[]>>;
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [userId, setUserId] = useState<number>();

  const handleEditUser = (id: number) => {
    setUserId(id);
    setOpenDialog(true);
  };

  return (
    <>
      <BootstrapDialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <AccountForm
          setCustomers={setCustomers}
          setManagers={setManagers}
          setUserId={setUserId}
          userId={userId}
          setOpenDialog={setOpenDialog}
        />
      </BootstrapDialog>
      <TableContainer component={Paper} style={{ maxHeight: '400px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Username</TableCell>
              <TableCell align="right">Name</TableCell>
              <TableCell align="center">Edit</TableCell>
              <TableCell align="center">Remove</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.username}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell align="right">{user.username}</TableCell>
                <TableCell align="right">{user.fullName}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => handleEditUser(user.id)}>edit</Button>
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() =>
                      handleRemoveUser({
                        userId: user.id,
                        setCustomers,
                        setManagers,
                        role: user.role,
                      })
                    }
                  >
                    delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default UserList;
