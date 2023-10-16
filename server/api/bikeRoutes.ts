var express = require('express');
var router = express.Router();
import { AppDataSource } from '../src/data-source';
import { Bike } from '../src/entity/Bike';
import { BikesUsers } from '../src/entity/BikesUsers';
import { getUserReservations, getAllBikes } from './helpers';

const bikeRepo = AppDataSource.getRepository(Bike);
const bikesUsersRepo = AppDataSource.getRepository(BikesUsers);

router.get('/bikes', async (req, res) => {
  const bikes = await getAllBikes();
  res.send({ bikes });
});

router.put('/bikes', async (req, res) => {
  const { id, remove, model, color, location } = req.body;
  if (remove) {
    await bikeRepo.update({ id }, { isAvailable: false });
  } else {
    await bikeRepo.update({ id }, { model, color, location });
  }

  const bikes = await getAllBikes();
  res.send({ bikes });
});

router.post('/bikes', async (req, res) => {
  const { model, color, location } = req.body;

  const bike = new Bike();
  bike.model = model;
  bike.color = color;
  bike.location = location;
  bike.ratings = [];
  await AppDataSource.manager.save(bike);

  const bikes = await getAllBikes();
  res.send({ bikes });
});

router.post('/bikes/reserve', async (req, res) => {
  const { userId, bikeId, date } = req.body;

  const reservation = new BikesUsers();
  reservation.userId = userId;
  reservation.bikeId = bikeId;
  reservation.date = date;
  await AppDataSource.manager.save(reservation);

  const bikes = await getAllBikes();
  const reservations = await getUserReservations(userId);

  res.send({ bikes, reservations });
});

router.post('/bikes/rate', async (req, res) => {
  const { reservationId, bikeId, rate, userId } = req.body;

  await bikesUsersRepo.update({ id: reservationId }, { rated: rate });
  const bike = await bikeRepo.findOne({ where: { id: bikeId } });

  await bikeRepo.update({ id: bikeId }, { ratings: [...bike.ratings, rate] });

  const bikes = await getAllBikes();
  const reservations = await getUserReservations(userId);

  res.send({ bikes, reservations });
});

export default router;
