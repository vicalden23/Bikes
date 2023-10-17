import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';

import {
  Bike,
  Reservations,
  User,
  handleCancelReservation,
  handleRateBike,
} from '../requests';

export default function ReservationCard({
  reservations,
  user,
  setReservations,
  setBikes,
}: {
  reservations: Reservations[];
  user?: User;
  setBikes: React.Dispatch<React.SetStateAction<Bike[]>>;
  setReservations: React.Dispatch<React.SetStateAction<Reservations[]>>;
}) {
  const [rate, setRate] = useState<number>();

  const isUpcomingReservation = (date: string) => {
    const today = new Date();
    return today < new Date(date);
  };

  return (
    <Grid container spacing={2} style={{ textAlign: 'left' }}>
      {reservations?.map((r) => (
        <Grid item>
          <Card sx={{ minWidth: 275, height: 177 }}>
            <CardContent>
              <Typography variant="h6" component="div">
                {r.date}
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {r.location}
              </Typography>
              <Typography variant="body2">
                {r.model}, {r.color}
              </Typography>
              {r.rated && (
                <Typography variant="body2">My Rating: {r.rated}</Typography>
              )}
            </CardContent>
            <CardActions>
              {isUpcomingReservation(r.date) ? (
                <Button
                  onClick={() =>
                    handleCancelReservation({
                      user,
                      reservationId: r.id,
                      setReservations,
                      setBikes,
                    })
                  }
                >
                  Cancel
                </Button>
              ) : (
                <>
                  {!r.rated && (
                    <>
                      <FormControl size="small">
                        <Select
                          defaultValue={5}
                          onChange={(ev) => setRate(+ev.target.value)}
                        >
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                          <MenuItem value={4}>4</MenuItem>
                          <MenuItem value={5}>5</MenuItem>
                        </Select>
                      </FormControl>

                      <Button
                        onClick={() =>
                          handleRateBike({
                            user,
                            reservationId: r.id,
                            bikeId: r.bikeId,
                            setReservations,
                            setBikes,
                            rate: rate ?? 5,
                          })
                        }
                      >
                        Submit Rating
                      </Button>
                    </>
                  )}
                </>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
