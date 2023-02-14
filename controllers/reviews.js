const Review = require('../models/reviews');
const CampGround = require('../models/campground');



module.exports.createReviews = async (req, res) => {
    const campground = await CampGround.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Added review!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReviews = async (req, res) => {
    const { id, reviewId } = req.params;
    await CampGround.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Deleted review!')
    res.redirect(`/campgrounds/${id}`);
}