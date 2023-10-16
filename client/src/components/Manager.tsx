import React, { useState, useEffect } from 'react';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  Bike,
  User,
  UserReservations,
  BikeReservations,
  handleGetManagerPageData,
} from '../requests';
import BikeList from './BikeList';
import AccountForm from './AccountForm';
import BikeForm from './BikeForm';
import UserList from './UserList';

function Manager() {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [customers, setCustomers] = useState<User[]>([]);
  const [bikeReservations, setBikeReservations] = useState<BikeReservations[]>(
    []
  );
  const [userReservations, setUserReservations] = useState<UserReservations[]>(
    []
  );

  console.log({ bikeReservations });

  useEffect(() => {
    handleGetManagerPageData({
      setBikes,
      setManagers,
      setCustomers,
      setUserReservations,
      setBikeReservations,
    });
  }, []);

  return (
    <div>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          <h3 style={{ textAlign: 'left' }}>Bikes</h3>
          <BikeList bikes={bikes} setBikes={setBikes} />
        </Grid>

        <Grid item xs={4}>
          <h3 style={{ textAlign: 'left' }}>Create Bike</h3>
          <BikeForm setBikes={setBikes} />
        </Grid>
      </Grid>

      <h3 style={{ textAlign: 'left' }}>Users</h3>
      <UserList
        users={customers}
        setCustomers={setCustomers}
        setManagers={setManagers}
      />

      <h3 style={{ textAlign: 'left' }}>Managers</h3>
      <UserList
        users={managers}
        setCustomers={setCustomers}
        setManagers={setManagers}
      />

      <h3>Create Account</h3>
      <AccountForm
        setCustomers={setCustomers}
        setManagers={setManagers}
        isCreate
      />

      <h3 style={{ textAlign: 'left' }}>User Reservations</h3>
      {userReservations.map((res) => (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              {res.fullName}, {res.username}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TableContainer style={{ maxHeight: '350px' }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Bike ID</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Model</TableCell>
                    <TableCell align="right">Color</TableCell>
                    <TableCell align="right">Location</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {res.reservations?.map(
                    (r: {
                      bikeId: number;
                      date: string;
                      color: string;
                      model: string;
                      location: string;
                    }) => (
                      <TableRow
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {r.bikeId}
                        </TableCell>
                        <TableCell align="right">{r.date}</TableCell>
                        <TableCell align="right">{r.model}</TableCell>
                        <TableCell align="right">{r.color}</TableCell>
                        <TableCell align="right">{r.location}</TableCell>
                      </TableRow>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </AccordionDetails>
        </Accordion>
      ))}

      <h3 style={{ textAlign: 'left' }}>Bike Reservations</h3>
      <>
        {bikeReservations.map((res) => (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                {res.color}, {res.model}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer style={{ maxHeight: '350px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>User ID</TableCell>
                      <TableCell align="right">Date</TableCell>
                      <TableCell align="right">Username</TableCell>
                      <TableCell align="right">Full Name</TableCell>
                      <TableCell align="right">Bike ID</TableCell>
                      <TableCell align="right">Reservation ID</TableCell>
                      <TableCell align="right">Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {res.bikeReservations?.map(
                      (r: {
                        userId: number;
                        username: string;
                        fullName: string;
                        bikeId: number;
                        date: string;
                        id: number;
                        location: string;
                      }) => (
                        <TableRow
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                          }}
                        >
                          <TableCell component="th" scope="row">
                            {r.userId}
                          </TableCell>
                          <TableCell align="right">{r.date}</TableCell>
                          <TableCell align="right">{r.username}</TableCell>
                          <TableCell align="right">{r.fullName}</TableCell>
                          <TableCell align="right">{res.id}</TableCell>
                          <TableCell align="right">{r.id}</TableCell>
                          <TableCell align="right">{res.location}</TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        ))}
      </>
    </div>
  );
}

export default Manager;
