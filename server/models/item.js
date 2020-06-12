import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    _id: Number,

    type: {
        type: String,
        require: true,
        maxlength: 3
    },
    description: {
        type: String,
        require: true,
        minlength: 1
    },
    value: {
        type: Number,
        require: true,
        min: 0.01
    }
});

const Item = mongoose.model("Item", itemSchema);

export default Item;