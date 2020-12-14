const db = require('../database/db-config');

const findById = (id) => {
  return db('users').where({id}).first();
};

const add = async (user) => {
  const [id] = await db('users').insert(user, 'id');
  return findById(id);
};

const findBy = (filter) => {
  return db('users').where(filter).orderBy('id');
};

const getUsers = () => {
  return db('users').select('id', 'username').orderBy('id');
};

module.exports = {
  findById,
  add,
  findBy,
  getUsers
};