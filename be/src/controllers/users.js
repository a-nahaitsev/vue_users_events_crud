import UserModel from '../models/User.model.js';

export const getAll = async (req, res) => {
  const { 
    page, 
    sortBy,
    sortOrder
  } = req.query;

  const users = await UserModel
    .find({})
    .sort({[sortBy]: sortOrder})
    .skip((page - 1) * 5)
    .limit(5);
  
  const count = await UserModel
    .countDocuments();

  const data = { users, count }
  res.send(data);
};

export const getOne = async (req, res) => {
  const { userId } = req.params;
  const foundUser = await UserModel.findOne({_id: userId});

  if (!foundUser) {
    res.sendStatus(404);

    return;
  }

  res.send(foundUser);
};

export const add = async(req, res) => {
  const { 
    firstName,
    lastName,
    email,
    phoneNumber
  } = req.body;

  if (!firstName 
    || !lastName
    || !email
    || !phoneNumber
  ) {
    res.sendStatus(422);

    return;
  }

  const newUser = await UserModel.create({ 
    ...req.body, 
    eventsCount: 0,
    nextEventDate: new Date('1000-01-01T00:00:00.000+00:00')
  });
  
  res.statusCode = 201;
  res.send(newUser);
};

export const update = async (req, res) => {
  const { userId } = req.params;
  const updatedUser = await UserModel.findOneAndUpdate({_id: userId}, req.body, { new: true });

  if (!updatedUser) {
    res.sendStatus(404);

    return;
  }

  res.send(updatedUser);
};

export const remove = async (req, res) => {
  const { userId } = req.params;
  const foundUser = await UserModel.findOne({_id: userId});

  if (!foundUser) {
    res.sendStatus(404);

    return;
  }

  await UserModel.deleteOne({_id: userId});
  res.sendStatus(204);
};
