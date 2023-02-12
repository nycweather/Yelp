const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const CampGround = require('../models/campground');
const { campgroundSchema } = require('../validateSchemas')
const { isLoggedIn } = require('../middleware')


const validateCampground = (req, res, next) => {

    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message, 400);
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await CampGround.find({});
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {

    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    //if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new CampGround(req.body.campground);
    await campground.save();
    req.flash('success', "Successfully added another campground!")
    res.redirect(`campgrounds/${campground._id}`);
}))


router.get('/:id', catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find campground!');
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await CampGround.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Updated Campground')
    res.redirect(`/campgrounds/${campground._id}`)

}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await CampGround.findByIdAndDelete(id);
    req.flash('success', 'Deleted campground!');
    res.redirect('/campgrounds')
}))

module.exports = router;