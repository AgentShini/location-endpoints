
module.exports.add = async (dbModel, data) => {
    return await dbModel.create(data);
}


module.exports.find = async (dbModel) => {
    return await dbModel.find().lean();
}

module.exports.findOne = async (dbModel, field, value) => {
    return await dbModel.findOne({[field]: value}, null, {lean: true})
}

module.exports.findById = async (dbModel, id) => {
    return await dbModel
        .findOne({_id: id}, null, {lean: true})
        .catch(e => ({error: e}));
}

module.exports.findByIdAndUpdate = async (dbModel, id,data) => {
    
    return await dbModel.findByIdAndUpdate(id,
    { $set: data },
    { new: true, lean: true });
}
