import React, { useState } from 'react';
import { TextField, Button, Stack, styled } from '@mui/material';

import { Bike, handleCreateBike, handleUpdateBike } from '../requests';

const inputStyles = {
  maxWidth: '300px',
  minWidth: '150px',
  marginBottom: '10px',
};

const FormButton = styled(Button)({
  marginTop: '15px',
  maxWidth: '300px',
  minWidth: '150px',
});

function BikeForm({
  setBikes,
  setEditBikeId,
  isUpdate,
  editBikeId,
  buttonText,
  setOpenDialog,
}: {
  setBikes: React.Dispatch<React.SetStateAction<Bike[]>>;
  setEditBikeId?: React.Dispatch<React.SetStateAction<number | undefined>>;
  isUpdate?: boolean;
  editBikeId?: number;
  buttonText?: string;
  setOpenDialog?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [bikeData, setBikeData] = useState<{
    [key: string]: any;
  }>();

  const handleBikeData = (ev: any, field: string) => {
    if (bikeData) {
      setBikeData({
        ...bikeData,
        [field]: ev.target?.value,
      });
    } else {
      setBikeData({ [field]: ev.target?.value });
    }
  };

  return (
    <Stack>
      <TextField
        label="Model"
        variant="standard"
        onChange={(ev) => handleBikeData(ev, 'model')}
        style={inputStyles}
      />
      <TextField
        label="Color"
        variant="standard"
        onChange={(ev) => handleBikeData(ev, 'color')}
        style={inputStyles}
      />
      <TextField
        label="Location"
        variant="standard"
        onChange={(ev) => handleBikeData(ev, 'location')}
        style={inputStyles}
      />
      <FormButton
        variant="contained"
        onClick={() =>
          isUpdate
            ? handleUpdateBike({
                setBikes,
                bikeData,
                setEditBikeId,
                bikeId: editBikeId,
                setOpenDialog,
              })
            : handleCreateBike({ setBikes, bikeData })
        }
      >
        {buttonText ?? 'submit'}
      </FormButton>
    </Stack>
  );
}

export default BikeForm;
