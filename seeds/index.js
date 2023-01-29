const mongoose = require('mongoose');
const CampGround = require('../models/campground');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelper')

//connnecting to db
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("Error, MONGO CONNECTION!!!!")
        console.log(err)
    });

const db = mongoose.connection;

// Add error handling for the db connection
db.on("error", function (error) {
    console.log("Database connection error:", error);
});

db.once("open", () => {
    console.log("Database Connected")
});


//Generating random data

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async (req, res) => {
    await CampGround.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new CampGround({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
    await CampGround.db.close();
    console.log('The database has been closed')
}

seedDB();