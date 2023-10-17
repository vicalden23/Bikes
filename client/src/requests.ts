export type Bike = {
  id: number;
  model: string;
  color: string;
  location: string;
  ratings?: number[];
  isAvailable?: boolean;
  rating?: string;
  reservations?: string[];
};

export type User = {
  id: number;
  username: string;
  fullName: string;
  token: string;
  role: string;
};

export type BikesUsers = {
  id: number;
  bikeId: number;
  userId: number;
  date: string;
  rated: number;
  reservations?: { [key: string]: any };
  bikeReservations?: { [key: string]: any };
};

export type Reservations = User & Bike & BikesUsers;
export type BikeReservations = Bike & BikesUsers;
export type UserReservations = User & BikesUsers;

type RequestProps = {
  setBikes?: React.Dispatch<React.SetStateAction<Bike[]>>;
  setManagers?: React.Dispatch<React.SetStateAction<User[]>>;
  setCustomers?: React.Dispatch<React.SetStateAction<User[]>>;
  setReservations?: React.Dispatch<React.SetStateAction<Reservations[]>>;
  setUserReservations?: React.Dispatch<
    React.SetStateAction<UserReservations[]>
  >;
  setBikeReservations?: React.Dispatch<
    React.SetStateAction<BikeReservations[]>
  >;
  setEditBikeId?: React.Dispatch<React.SetStateAction<number | undefined>>;
  setUserId?: React.Dispatch<React.SetStateAction<number | undefined>>;
  setPage?: React.Dispatch<React.SetStateAction<string>>;
  setOpenDialog?: React.Dispatch<React.SetStateAction<boolean>>;
  setUser?: React.Dispatch<React.SetStateAction<User | undefined>>;
  user?: User;
  bikeData?: { [key: string]: any };
  bikeId?: number;
  userData?: { [key: string]: any };
  userId?: number;
  role?: string;
  date?: string;
  reservationId?: number;
  rate?: number;
};

export const handleGetManagerPageData = async ({
  setBikes,
  setManagers,
  setCustomers,
  setUserReservations,
  setBikeReservations,
  user,
}: RequestProps) => {
  const res = await fetch('http://localhost:8080/manager-page', {
    headers: { 'x-access-token': user?.token ?? '' },
  });
  const data = await res.json();

  if (setBikes) setBikes(data.bikes);
  if (setManagers) setManagers(data.managers);
  if (setCustomers) setCustomers(data.customers);
  if (setUserReservations) setUserReservations(data.userReservations);
  if (setBikeReservations) setBikeReservations(data.bikeReservations);
};

export const handleGetBikes = async ({ setBikes, user }: RequestProps) => {
  const res = await fetch('http://localhost:8080/bikes', {
    headers: { 'x-access-token': user?.token ?? '' },
  });
  const data = await res.json();
  if (setBikes) setBikes(data.bikes);
};

export const handleCreateBike = async ({
  setBikes,
  bikeData,
  user,
}: RequestProps) => {
  if (!bikeData?.color || !bikeData?.location || !bikeData?.model) {
    alert('Please fill out all bike data');
  } else {
    const res = await fetch('http://localhost:8080/bikes', {
      method: 'POST',
      body: JSON.stringify(bikeData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'x-access-token': user?.token ?? '',
      },
    });

    const data = await res.json();
    if (setBikes) setBikes(data.bikes);
  }
};

export const handleUpdateBike = async ({
  setBikes,
  bikeData,
  setEditBikeId,
  bikeId,
  setOpenDialog,
  user,
}: RequestProps) => {
  const res = await fetch('http://localhost:8080/bikes', {
    method: 'PUT',
    body: JSON.stringify({ ...bikeData, id: bikeId }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'x-access-token': user?.token ?? '',
    },
  });
  const data = await res.json();
  if (setBikes) setBikes(data.bikes);
  if (setEditBikeId) setEditBikeId(undefined);
  if (setOpenDialog) setOpenDialog(false);
};

export const handleRemoveBike = async ({
  setBikes,
  bikeId,
  user,
}: RequestProps) => {
  const res = await fetch('http://localhost:8080/bikes', {
    method: 'PUT',
    body: JSON.stringify({ remove: true, id: bikeId }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'x-access-token': user?.token ?? '',
    },
  });

  const data = await res.json();
  if (setBikes) setBikes(data.bikes);
};

const isValidRole = (role?: string) => {
  if (!role) return false;
  if (role !== 'customer' && role !== 'manager') return false;
  return true;
};

export const handleCreateUser = async ({
  setManagers,
  setCustomers,
  setPage,
  userData,
  setUserId,
  setUser,
}: RequestProps) => {
  if (
    !userData?.fullName ||
    !isValidRole(userData?.role) ||
    !userData?.username ||
    !userData?.password
  ) {
    alert('Please fill out all user data');
  } else {
    const res = await fetch('http://localhost:8080/users', {
      method: 'POST',
      body: JSON.stringify(userData),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });

    const { customers, managers, user, error } = await res.json();

    if (error) {
      alert(error);
    } else {
      if (setManagers) setManagers(managers);
      if (setCustomers) setCustomers(customers);
      if (setUserId) setUserId(user.id);
      if (setUser) setUser(user);
      if (setPage) setPage(`${user.role}`);
    }
  }
};

export const handleUpdateUser = async ({
  setCustomers,
  setManagers,
  setUserId,
  userId,
  user,
  userData,
  setOpenDialog,
}: RequestProps) => {
  const res = await fetch('http://localhost:8080/users', {
    method: 'PUT',
    body: JSON.stringify({ ...userData, id: userId }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'x-access-token': user?.token ?? '',
    },
  });
  const { managers, customers } = await res.json();
  if (setManagers) setManagers(managers);
  if (setCustomers) setCustomers(customers);
  if (setUserId) setUserId(undefined);
  if (setOpenDialog) setOpenDialog(false);
};

export const handleRemoveUser = async ({
  setCustomers,
  setManagers,
  userId,
  role,
  user,
}: RequestProps) => {
  const res = await fetch('http://localhost:8080/users', {
    method: 'PUT',
    body: JSON.stringify({ remove: true, id: userId }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'x-access-token': user?.token ?? '',
    },
  });

  const { managers, customers } = await res.json();
  if (setManagers && role === 'manager') setManagers(managers);
  if (setCustomers && role === 'customer') setCustomers(customers);
};

export const handleGetUserReservations = async ({
  setReservations,
  user,
}: RequestProps) => {
  const res = await fetch(`http://localhost:8080/users/${user?.id}`, {
    headers: {
      'x-access-token': user?.token ?? '',
    },
  });

  const { reservations } = await res.json();
  if (setReservations) setReservations(reservations);
};

export const handleReserveBike = async ({
  bikeId,
  date,
  setBikes,
  setReservations,
  user,
}: RequestProps) => {
  const res = await fetch('http://localhost:8080/bikes/reserve', {
    method: 'POST',
    body: JSON.stringify({ userId: user?.id, bikeId, date }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'x-access-token': user?.token ?? '',
    },
  });

  const { bikes, reservations } = await res.json();

  if (setReservations) setReservations(reservations);
  if (setBikes) setBikes(bikes);
};

export const handleCancelReservation = async ({
  user,
  reservationId,
  setReservations,
  setBikes,
}: RequestProps) => {
  const res = await fetch('http://localhost:8080/users/reservations', {
    method: 'DELETE',
    body: JSON.stringify({ userId: user?.id, reservationId }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'x-access-token': user?.token ?? '',
    },
  });

  const { reservations, bikes } = await res.json();

  if (setReservations) setReservations(reservations);
  if (setBikes) setBikes(bikes);
};

export const handleRateBike = async ({
  user,
  reservationId,
  setReservations,
  setBikes,
  rate,
  bikeId,
}: RequestProps) => {
  const res = await fetch('http://localhost:8080/bikes/rate', {
    method: 'POST',
    body: JSON.stringify({ userId: user?.id, reservationId, rate, bikeId }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
      'x-access-token': user?.token ?? '',
    },
  });

  const { reservations, bikes } = await res.json();

  if (setReservations) setReservations(reservations);
  if (setBikes) setBikes(bikes);
};
