const mongoose = require('mongoose');

const PageInfoSchema = new mongoose.Schema({
    pageId:{
        type: mongoose.Schema.Types.ObjectId,
        require: true
    },
    name: String,
    metaTitle: String,
    metaDescription: String,
    bannerImg: String,
});


const PageInfo = mongoose.model('PageInfo', PageInfoSchema);

module.exports = { PageInfo };