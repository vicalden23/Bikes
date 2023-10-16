import React, { useState } from 'react';
import { TextField, Button, Stack, styled } from '@mui/material';
import AccountForm from './AccountForm';

export const inputStyles = {
  maxWidth: '400px',
  minWidth: '350px',
  marginBottom: '10px',
};

export const Container = styled('div')({
  display: 'inline-grid',
  textAlign: 'center',
});

function Login({
  setPage,
  setUserId,
}: {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  setUserId: React.Dispatch<React.SetStateAction<number | undefined>>;
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const res = await fetch('http://localhost:8080/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    const data = await res.json();

    if (data.user.role === 'manager') {
      setPage('manager');
    } else {
      setPage('customer');
    }
    setUserId(data.user.id);
  };

  return (
    <Container>
      <h5 style={{ textAlign: 'left' }}>Login</h5>
      <Stack>
        <TextField
          label="Username"
          variant="standard"
          onChange={(ev) => setUsername(ev.target.value)}
          style={inputStyles}
        />
        <TextField
          label="Password"
          variant="standard"
          onChange={(ev) => setPassword(ev.target.value)}
          style={inputStyles}
        />
        <Button
          style={{ marginTop: '15px', width: '400px' }}
          variant="contained"
          onClick={handleLogin}
        >
          submit
        </Button>
      </Stack>
      <h4 style={{ textAlign: 'center', marginTop: '50px' }}>OR</h4>
      <h5 style={{ textAlign: 'left' }}>Create Account</h5>
      <AccountForm setUserId={setUserId} setPage={setPage} isCreate />
    </Container>
  );
}

export default Login;
