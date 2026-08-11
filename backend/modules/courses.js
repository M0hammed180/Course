const momgoose = require("mongoose");
const Schema = mongooes.Schema;

const courseSchema = new Schema({
    name: String,
    desc: String,
    cover: String, 
    price: Number
});

const Cource = mongooes.model("Cource",courseSchema);

module.exports = Cource;