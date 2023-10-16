import React, { useState } from 'react';
import { Container, Button } from '@mui/material';
import Login from './components/Login';
import Manager from './components/Manager';
import Customer from './components/Customer';
import './App.css';

function App() {
  const [page, setPage] = useState('manager');
  const [userId, setUserId] = useState<number>();

  return (
    <Container style={{ textAlign: 'center' }}>
      {page !== 'login' && (
        <div style={{ textAlign: 'right' }}>
          <Button onClick={() => setPage('login')}>logout</Button>
        </div>
      )}
      {page === 'login' && <Login setPage={setPage} setUserId={setUserId} />}
      {page === 'manager' && <Manager />}
      {page === 'customer' && <Customer userId={userId} />}
    </Container>
  );
}

export default App;
