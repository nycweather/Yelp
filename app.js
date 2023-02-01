const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const CampGround = require('./models/campground');
const methodOverride = require('method-override')
const app = express();
const ejsMate = require('ejs-mate')

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

//app.engine('html', require('ejs').renderFile);
app.engine('ejs', ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
});

// app.get('/makecampground', async (req, res) => {
//     const camp = new CampGround(
//         {
//             title: 'Test-campground-one',
//             price: '21 pesos',
//             description: 'Giant fields',
//             location: 'Yo mamas house'
//         });
//     await camp.save();
//     res.send(camp);
// });

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds })
})

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', async (req, res) => {
    const campground = new CampGround(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`)
})


app.get('/campgrounds/:id', async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/show', { campground })
})
app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
})

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)

})

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    res.redirect('/campgrounds')
})

app.listen(3000, () => {
    console.log('Listening on port 3000')
});
