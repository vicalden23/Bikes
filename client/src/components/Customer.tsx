import React, { useState, useEffect } from 'react';

import {
  Bike,
  Reservations,
  handleGetBikes,
  handleGetUserReservations,
  handleCancelReservation,
  handleRateBike,
} from '../requests';
import BikeList from './BikeList';
import '../App.css';

function Customer({ userId }: { userId?: number }) {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [displayBikes, setDisplayBikes] = useState<Bike[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [ratings, setRatings] = useState<string[]>([]);
  const [rate, setRate] = useState<number>();
  const [reservations, setReservations] = useState<Reservations[]>([]);
  const [bikeFilters, setBikeFilters] = useState<{
    [key: string]: any;
  }>();

  useEffect(() => {
    handleGetBikes({ setBikes });
    handleGetUserReservations({
      userId,
      setReservations,
    });
  }, [userId]);

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

  const isUpcomingReservation = (date: string) => {
    const today = new Date();
    return today < new Date(date);
  };

  return (
    <div>
      <h3>Bikes</h3>
      Filters: Model:
      <select onChange={(ev) => handleFilterBikes(ev, 'model')}>
        <option value={''} label=" ">
          -- select an option --
        </option>
        {models.length && models.map((m) => <option key={m}>{m}</option>)}
      </select>
      Color:
      <select onChange={(ev) => handleFilterBikes(ev, 'color')}>
        <option value={''} label=" ">
          -- select an option --
        </option>
        {colors.length && colors.map((c) => <option key={c}>{c}</option>)}
      </select>
      Location:
      <select onChange={(ev) => handleFilterBikes(ev, 'location')}>
        <option value={''} label=" ">
          -- select an option --
        </option>
        {locations.length && locations.map((l) => <option key={l}>{l}</option>)}
      </select>
      Rating:
      <select onChange={(ev) => handleFilterBikes(ev, 'rating')}>
        <option value={''} label=" ">
          -- select an option --
        </option>
        {ratings.length && ratings.map((r) => <option key={r}>{r}</option>)}
      </select>
      <BikeList
        bikes={displayBikes}
        setBikes={setBikes}
        setReservations={setReservations}
        userId={userId}
        hideEdit
      />
      <h3>Reservations</h3>
      {reservations.map((r, i) => (
        <div key={`${r.date}-${i}`} style={{ marginBottom: '15px' }}>
          <div>{r.date}</div>
          <div>
            {r.color} {r.model}
          </div>
          <div>{r.location}</div>
          {isUpcomingReservation(r.date) ? (
            <button
              onClick={() =>
                handleCancelReservation({
                  userId,
                  reservationId: r.id,
                  setReservations,
                  setBikes,
                })
              }
            >
              Cancel
            </button>
          ) : (
            <>
              {!r.rated && (
                <>
                  <select
                    defaultValue="5"
                    onChange={(ev) => setRate(+ev.target.value)}
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                  <button
                    onClick={() =>
                      handleRateBike({
                        userId,
                        reservationId: r.id,
                        bikeId: r.bikeId,
                        setReservations,
                        setBikes,
                        rate: rate ?? 5,
                      })
                    }
                  >
                    Submit Rating
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Customer;
