import EventModel from '../models/Event.model.js';
import UserModel from '../models/User.model.js';

export const getAll = async (req, res) => {
  const { userId } = req.params;
  const { 
    page, 
    sortBy,
    sortOrder
  } = req.query;

  const events = await EventModel
    .find({ userId })
    .sort({[sortBy]: sortOrder})
    .skip((page - 1) * 5)
    .limit(5);

  const allUserEvents = await EventModel
  .find({ userId });

  const count = await EventModel
    .countDocuments({ userId });

  res.send({ 
    events, 
    allUserEvents, 
    count
  });
};

export const getOne = async (req, res) => {
  const { eventId } = req.params;
  const foundEvent = await EventModel.findOne({_id: eventId});

  if (!foundEvent) {
    res.sendStatus(404);

    return;
  }

  res.send(foundEvent);
};

export const add = async(req, res) => {
  const { 
    title,
    description,
    startDate,
    endDate
  } = req.body;

  const { 
    userId
  } = req.params;

  if (!title 
    || !description
    || !startDate
    || !endDate
  ) {
    res.sendStatus(422);

    return;
  }

  const newEvent = await EventModel.create({...req.body, userId});
  const foundUser = await UserModel.findOne({_id: userId});

  if (!foundUser) {
    res.sendStatus(404);

    return;
  }

  const newEventsCount = foundUser.eventsCount + 1;
  const events = await EventModel.find({ userId });
  const filteredEvents = events.filter(event => event.startDate > Date.now());
  let nextEventDate;

  if (!filteredEvents.length) {
    nextEventDate = new Date('1000-01-01T00:00:00.000+00:00');
  } else {
    nextEventDate = filteredEvents
      .sort((eventA, eventB) => eventA.startDate - eventB.startDate)[0].startDate;
  }

  await UserModel.findOneAndUpdate(
    {_id: userId}, 
    { eventsCount: newEventsCount, nextEventDate }, 
    { new: true }
  );
  
  res.statusCode = 201;
  res.send(newEvent);
};

export const update = async (req, res) => {
  const { eventId } = req.params;
  const updatedEvent = await EventModel.findOneAndUpdate(
    {_id: eventId},
    req.body,
    { new: true }
  );

  if (!updatedEvent) {
    res.sendStatus(404);

    return;
  }

  res.send(updatedEvent);
};

export const remove = async (req, res) => {
  const { userId, eventId } = req.params;
  const foundEvent = await EventModel.findOne({_id: eventId});

  if (!foundEvent) {
    res.sendStatus(404);

    return;
  }

  await EventModel.deleteOne({_id: eventId});

  const foundUser = await UserModel.findOne({_id: userId});

  if (!foundUser) {
    res.sendStatus(404);

    return;
  }

  const newEventsCount = foundUser.eventsCount - 1;
  const events = await EventModel.find({ userId });
  const filteredEvents = events.filter(event => event.startDate > Date.now());
  let nextEventDate;

  if (!filteredEvents.length) {
    nextEventDate = new Date('1000-01-01T00:00:00.000+00:00');
  } else {
    nextEventDate = events
      .sort((eventA, eventB) => eventA.startDate - eventB.startDate)[0].startDate;
  }

  await UserModel.findOneAndUpdate(
    {_id: userId},
    { eventsCount: newEventsCount, nextEventDate },
    { new: true }
  );
  
  res.sendStatus(204);
};
