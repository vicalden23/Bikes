import React, { useState, useEffect } from 'react';
import { Select, MenuItem, InputLabel, FormControl, Grid } from '@mui/material';

import {
  Bike,
  User,
  Reservations,
  handleGetBikes,
  handleGetUserReservations,
} from '../requests';
import BikeList from './BikeList';
import ReservationCard from './ReservationCard';

function Customer({ user }: { user?: User }) {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [displayBikes, setDisplayBikes] = useState<Bike[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string[]>([]);
  const [reservations, setReservations] = useState<Reservations[]>([]);
  const [bikeFilters, setBikeFilters] = useState<{
    [key: string]: any;
  }>();

  useEffect(() => {
    handleGetBikes({ setBikes, user });
    handleGetUserReservations({
      user,
      setReservations,
    });
  }, [user]);

  useEffect(() => {
    setDisplayBikes(bikes);
  }, [bikes]);

  useEffect(() => {
    const allModels: string[] = [];
    const allColors: string[] = [];
    const allLocations: string[] = [];
    const allRatings: string[] = [];

    bikes.forEach((b) => {
      const { model, color, location, rating } = b;

      if (!allModels.includes(model.toLowerCase())) {
        allModels.push(model.toLowerCase());
      }

      if (!allColors.includes(color.toLowerCase())) {
        allColors.push(color.toLowerCase());
      }

      if (!allLocations.includes(location.toLowerCase())) {
        allLocations.push(location.toLowerCase());
      }

      if (rating && !allRatings.includes(rating.charAt(0))) {
        allRatings.push(rating.charAt(0));
      }

      setModels(allModels);
      setColors(allColors);
      setLocations(allLocations);
      setRatings(allRatings);
    });
  }, [bikes]);

  const handleFilterBikes = (ev: any, field: string) => {
    if (bikeFilters) {
      setBikeFilters({
        ...bikeFilters,
        [field]: ev.target?.value,
      });
    } else {
      setBikeFilters({ [field]: ev.target?.value });
    }
  };

  useEffect(() => {
    const modelFilter = bikeFilters?.model;
    const colorFilter = bikeFilters?.color;
    const locationFilter = bikeFilters?.location;
    const ratingFilter = bikeFilters?.rating;

    const filteredBikes = bikes.filter((b) => {
      if (modelFilter && b.model.toLowerCase() !== modelFilter) {
        return false;
      }

      if (colorFilter && b.color.toLowerCase() !== colorFilter) {
        return false;
      }

      if (locationFilter && b.location.toLowerCase() !== locationFilter) {
        return false;
      }

      if (ratingFilter && b.rating && b.rating.charAt(0) !== ratingFilter) {
        return false;
      }

      return true;
    });

    setDisplayBikes(filteredBikes);
  }, [bikeFilters, bikes]);

  return (
    <div>
      <h3>Bikes</h3>
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Model</InputLabel>
            <Select
              defaultValue=""
              label="Role"
              onChange={(ev) => handleFilterBikes(ev, 'model')}
            >
              <MenuItem value="">Remove Filter</MenuItem>
              {models.length &&
                models.map((m) => (
                  <MenuItem value={m} key={m}>
                    {m}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Color</InputLabel>
            <Select
              defaultValue=""
              // label="Role"
              onChange={(ev) => handleFilterBikes(ev, 'color')}
            >
              <MenuItem value="">Remove Filter</MenuItem>
              {colors.length &&
                colors.map((c) => (
                  <MenuItem value={c} key={c}>
                    {c}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={2}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Location</InputLabel>
            <Select
              defaultValue=""
              onChange={(ev) => handleFilterBikes(ev, 'location')}
            >
              <MenuItem value="">Remove Filter</MenuItem>
              {locations.length &&
                locations.map((l) => (
                  <MenuItem value={l} key={l}>
                    {l}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              defaultValue=""
              onChange={(ev) => handleFilterBikes(ev, 'rating')}
            >
              <MenuItem value="">Remove Filter</MenuItem>
              {ratings.length &&
                ratings.map((r) => (
                  <MenuItem value={r} key={r}>
                    {r}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <BikeList
        bikes={displayBikes}
        setBikes={setBikes}
        setReservations={setReservations}
        user={user}
        hideEdit
      />
      <h3>Reservations</h3>
      <ReservationCard
        reservations={reservations}
        user={user}
        setReservations={setReservations}
        setBikes={setBikes}
      />
    </div>
  );
}

export default Customer;
