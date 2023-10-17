import React, { useState } from 'react';
import { Container, Button } from '@mui/material';
import Login from './components/Login';
import Manager from './components/Manager';
import Customer from './components/Customer';
import { User } from './requests';

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState<User>();

  return (
    <Container style={{ textAlign: 'center' }}>
      {page !== 'login' && (
        <div style={{ textAlign: 'right' }}>
          <Button onClick={() => setPage('login')}>logout</Button>
        </div>
      )}
      {page === 'login' && <Login setPage={setPage} setUser={setUser} />}
      {page === 'manager' && <Manager user={user} />}
      {page === 'customer' && <Customer user={user} />}
    </Container>
  );
}

export default App;
