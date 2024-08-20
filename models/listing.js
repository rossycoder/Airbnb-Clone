const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    category: {
        type: String,
        enum: ['Trending', 'Top cities', 'Design', 'Swimming pools', 'Tree Houses', 'Cabins', 'New',, 'default-category'],
        required: true,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findAndDelete", async (list) => {
    if (list) {
        await reviews.deleteMany({ _id: { $in: list.reviews } });
    }
});

listingSchema.index({ geometry: '2dsphere' });

const List = mongoose.model("list", listingSchema);
module.exports = List;