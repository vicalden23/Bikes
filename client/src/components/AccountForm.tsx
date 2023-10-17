import React, { useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { User, handleCreateUser, handleUpdateUser } from '../requests';
import { inputStyles, Container } from './Login';

function AccountForm({
  setCustomers,
  setManagers,
  isCreate,
  setUserId,
  setUser,
  setPage,
  user,
  userId,
  setOpenDialog,
}: {
  setManagers?: React.Dispatch<React.SetStateAction<User[]>>;
  setCustomers?: React.Dispatch<React.SetStateAction<User[]>>;
  setUserId?: React.Dispatch<React.SetStateAction<number | undefined>>;
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>;
  setPage?: React.Dispatch<React.SetStateAction<string>>;
  isCreate?: boolean;
  user?: User;
  userId?: number;
  setOpenDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [userData, setUserData] = useState<{
    [key: string]: any;
  }>();

  const handleUserData = (ev: any, field: string) => {
    if (userData) {
      setUserData({
        ...userData,
        [field]: ev.target?.value,
      });
    } else {
      setUserData({ [field]: ev.target?.value });
    }
  };

  return (
    <Container>
      <Stack>
        <FormControl size="small">
          <InputLabel>Role</InputLabel>
          <Select
            value={userData?.role}
            label="Role"
            onChange={(ev) => handleUserData(ev, 'role')}
          >
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="customer">Customer</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Full Name"
          variant="standard"
          onChange={(ev) => handleUserData(ev, 'fullName')}
          style={inputStyles}
        />
        <TextField
          label="Username"
          variant="standard"
          onChange={(ev) => handleUserData(ev, 'username')}
          style={inputStyles}
        />
        <TextField
          label="Password"
          variant="standard"
          onChange={(ev) => handleUserData(ev, 'password')}
          style={inputStyles}
        />
        <Button
          variant="contained"
          style={{ marginTop: '15px' }}
          onClick={
            isCreate
              ? () =>
                  handleCreateUser({
                    setCustomers,
                    setManagers,
                    setPage,
                    userData,
                    setUser,
                  })
              : () =>
                  handleUpdateUser({
                    setCustomers,
                    setManagers,
                    setUserId,
                    user,
                    userId,
                    userData,
                    setOpenDialog,
                  })
          }
        >
          {isCreate ? 'Create Account' : 'Update'}
        </Button>
      </Stack>
    </Container>
  );
}

export default AccountForm;
