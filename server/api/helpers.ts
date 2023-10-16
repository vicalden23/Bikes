import { AppDataSource } from '../src/data-source';
import { BikesUsers } from '../src/entity/BikesUsers';
import { Bike } from '../src/entity/Bike';

const bikesUsersRepo = AppDataSource.getRepository(BikesUsers);
const bikesUsers = AppDataSource.getRepository(BikesUsers);

export async function getUserReservations(id: number) {
  return bikesUsers.query(`
      SELECT
          bu.*, bu.id as id, b.color, b.model, b."location"
      FROM
          bikes_users bu
      LEFT JOIN
          bike b
      ON
          bu."bikeId"= b.id
      WHERE
          bu."userId"=${id}
    `);
}

export async function getUsersReservations() {
  return bikesUsers.query(`
    SELECT
      "user".*,
      jsonb_agg(jsonb_build_object('date', bu.date, 'bikeId', bu."bikeId", 'color', b.color, 'model', b.model, 'location', b."location")) reservations
    FROM
      "user"
    INNER JOIN
      bikes_users bu ON bu."userId"="user".id
    INNER JOIN
      bike b ON bu."bikeId"=b.id
    GROUP BY
        "user".id
    `);
}

export async function getBikesReservations() {
  return bikesUsers.query(`
      SELECT
          b.*,
          jsonb_agg(jsonb_build_object('date', bu.date, 'userId', bu."userId", 'id', bu.id, 'username', "user".username, 'fullName', "user"."fullName")) "bikeReservations"
      FROM
          bike b
      INNER JOIN
          bikes_users bu ON bu."bikeId"=b.id
      INNER JOIN
        "user" ON "user".id=bu."userId"
      GROUP BY
          b.id
      `);
}

function calculateRatings(bikes: Bike[]) {
  return bikes.map((bike: Bike) => {
    const combinedRatings =
      bike?.ratings?.reduce((acc, num) => {
        return acc + num;
      }, 0) ?? 0;

    if (combinedRatings === 0) {
      return {
        ...bike,
        rating: '0',
      };
    }

    const rating = (combinedRatings / (bike?.ratings?.length ?? 0)).toFixed(1);

    return {
      ...bike,
      rating,
    };
  });
}

export async function getAllBikes() {
  const bikes = await bikesUsersRepo.query(`
    SELECT
        b.*,
        jsonb_agg(bu.date) reservations
    FROM
        bike b
    LEFT OUTER JOIN
        bikes_users bu ON bu."bikeId"=b.id
    WHERE
        b."isAvailable"=true
    GROUP BY
        b.id
  `);
  return calculateRatings(bikes);
}
