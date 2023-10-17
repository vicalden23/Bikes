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

import {
  Bike,
  Reservations,
  User,
  handleRemoveBike,
  handleReserveBike,
} from '../requests';
import BikeForm from './BikeForm';

const BootstrapDialog = styled(Dialog)(() => ({
  '& .MuiPaper-root': {
    padding: '20px',
  },
}));

function BikeList({
  bikes,
  setBikes,
  setReservations,
  hideEdit,
  user,
}: {
  bikes: Bike[];
  setBikes: React.Dispatch<React.SetStateAction<Bike[]>>;
  setReservations?: React.Dispatch<React.SetStateAction<Reservations[]>>;
  hideEdit?: boolean;
  user?: User;
}) {
  const [editBikeId, setEditBikeId] = useState<number>();
  const [openDialog, setOpenDialog] = useState(false);

  const handleEditBike = (id: number) => {
    setEditBikeId(id);
    setOpenDialog(true);
  };

  const getReserveBikeButton = (date: string, bikeId: number) => {
    return (
      <Button
        style={{ marginTop: 7 }}
        onClick={() =>
          handleReserveBike({ user, date, bikeId, setBikes, setReservations })
        }
      >
        {date}
      </Button>
    );
  };

  const getAvailableDates = (bikeId: number, time?: string[]) => {
    const today = new Date();
    const oneDayLater = new Date();
    const twoDaysLater = new Date();
    const add1Day = oneDayLater.getDate() + 1;
    oneDayLater.setDate(add1Day);
    const add2Days = twoDaysLater.getDate() + 2;
    twoDaysLater.setDate(add2Days);

    const todayString = today.toDateString();
    const oneDayLaterString = oneDayLater.toDateString();
    const twoDaysLaterString = twoDaysLater.toDateString();

    return (
      <>
        {(!time || !time.includes(todayString)) && (
          <>{getReserveBikeButton(todayString, bikeId)}</>
        )}
        {(!time || !time.includes(oneDayLaterString)) && (
          <>{getReserveBikeButton(oneDayLaterString, bikeId)}</>
        )}
        {(!time || !time.includes(twoDaysLaterString)) && (
          <>{getReserveBikeButton(twoDaysLaterString, bikeId)}</>
        )}
      </>
    );
  };

  return (
    <>
      <BootstrapDialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <BikeForm
          setBikes={setBikes}
          buttonText="Update Bike"
          setEditBikeId={setEditBikeId}
          isUpdate
          editBikeId={editBikeId}
          setOpenDialog={setOpenDialog}
          user={user}
        />
      </BootstrapDialog>
      <TableContainer component={Paper} style={{ maxHeight: '400px' }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="right">Model</TableCell>
              <TableCell align="right">Color</TableCell>
              <TableCell align="right">Location</TableCell>
              <TableCell align="right">Rating</TableCell>
              {!hideEdit ? (
                <>
                  <TableCell align="center">Edit</TableCell>
                  <TableCell align="center">Remove</TableCell>
                </>
              ) : (
                <TableCell align="center">Availability</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {bikes.map((bike, i) => (
              <TableRow
                key={`${i + 1}-${bike.model}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {bike.id}
                </TableCell>
                <TableCell align="right">{bike.model}</TableCell>
                <TableCell align="right">{bike.color}</TableCell>
                <TableCell align="right">{bike.location}</TableCell>
                <TableCell align="right">{bike.rating}</TableCell>
                {hideEdit && (
                  <div>{getAvailableDates(bike.id, bike.reservations)}</div>
                )}
                {!hideEdit && (
                  <>
                    <TableCell align="center">
                      <Button onClick={() => handleEditBike(bike.id)}>
                        edit
                      </Button>
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() =>
                          handleRemoveBike({ bikeId: bike.id, setBikes, user })
                        }
                      >
                        delete
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default BikeList;
