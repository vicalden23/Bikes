import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
var express = require('express');
var router = express.Router();

export const TOKEN_KEY = 'shhhhh';

import { AppDataSource } from '../src/data-source';
import { User } from '../src/entity/User';

const userRepo = AppDataSource.getRepository(User);

router.post('/users', async (req, res) => {
  const { fullName, role, username, password } = req.body;

  const usernameExists = await userRepo.findOne({ where: { username } });
  if (usernameExists && usernameExists.id) {
    res
      .status(500)
      .send({ error: 'The username you have provided is already in use.' });
  } else {
    const encryptedPassword = await bcrypt.hash(password, 10);

    const createdUser = await userRepo.create({
      fullName,
      role,
      username,
      password: encryptedPassword,
    });
    await userRepo.save(createdUser);

    const user = await userRepo.findOne({ where: { role, username } });

    const token = jwt.sign({ userId: user.id, username }, TOKEN_KEY);

    // save user token
    user.token = token;

    const managers = await userRepo.find({ where: { role: 'manager' } });
    const customers = await userRepo.find({ where: { role: 'customer' } });
    res.send({ managers, customers, user });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await userRepo.findOne({
    where: {
      username,
    },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ userId: user.id, username }, TOKEN_KEY);
    user.token = token;

    res.status(200).json({ user });
  } else {
    res.status(400).send({ error: 'invalid credentials' });
  }
});

export default router;
