// const DbConnection =require("../config/database")


// const findOne = async (collection) => {
//     const Database = DbConnection.getDb()
//     const coll = Database.collection(collection)
//     const data = await coll.findOne({}).toArray()
//     return data
//  }

//  const insertOne = async (collection,data) =>{
//     const Database = DbConnection.getDb()
//     const coll = Database.collection(collection)
//     const insert_details = await coll.insertOne(data)
//     return insert_details
// }

// module.exports = {findOne, insertOne}

const { Users } = require("../models/user");

const findOne = async (query = {}) => {
  try {
    // Find one document in the Users collection
    const data = await Users.findOne(query);
    return data;
  } catch (error) {
    console.error("Error finding document:", error);
    throw error;
  }
};

const insertOne = async (data) => {
  try {
    // Insert one document in the Users collection
    const newUser = new Users(data);
    const insertDetails = await newUser.save();
    return insertDetails;
  } catch (error) {
    console.error("Error inserting document:", error);
    throw error;
  }
};

module.exports = { findOne, insertOne };
