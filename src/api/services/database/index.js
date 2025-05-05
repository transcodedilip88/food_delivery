const updateData = async (modelName, criteria, dataToSet, options) => {
    if (!options) {
        options = {};
    }
    options.new = true;
    options.lean = true;
    return modelName.findOneAndUpdate(criteria, dataToSet, options);
};

const deleteOne = async (modelName, criteria) => {
    return modelName.deleteOne(criteria);
};

const getData = async (modelName, criteria, projection, options) => {
    if (!options) {
        options = {};
    }
    options.lean = true;
    return modelName.find(criteria, projection, options);
};

const getDataWithSorting = async (modelName, criteria, projection, options) => {
    if (!options) {
        options = {};
    }
    options.lean = true;
    return modelName.find(criteria, projection, options).collation({ locale: 'en' });
};

const getFirstMatch = async (modelName, criteria, projection, options) => {
    if (!options) {
        options = {};
    }
    options.lean = true;
    return await modelName.findOne(criteria, projection, options);
};

const findOneAndPopulate = async (modelName, criteria, projection, options, populateModel) => {
    options.lean = true;
    return modelName.findOne(criteria, projection, options).populate(populateModel).exec();
};

const countData = async (modelName, criteria) => {
    return modelName.countDocuments(criteria);
};

const createData = async (modelName, objToSave) => {
    return new modelName(objToSave).save();
};

const insertMany = async (modelName, objToSave) => {
    const users = objToSave.map(user => new modelName(user));

    return modelName.insertMany(users);
};

async function aggregateData(modelName, criteria) {
    return modelName.aggregate(criteria);
}

async function aggregateDataWithSorting(modelName, criteria) {
    return modelName.aggregate(criteria).collation({ locale: 'en' });
}

const aggregateAndPopulate = async (modelName, criteria, populateModel) => {
    const result = await modelName.aggregate(criteria);
    return modelName.populate(result, populateModel);
};

const updateMany = async (modelName, criteria, dataToSet, options) => {
    return modelName.updateMany(criteria, dataToSet, options);
};
const deleteMany = async (modelName, criteria) => {
    return modelName.deleteMany(criteria);
};

const findAllWithPopulate = async (modelName, criteria, projection, options, populateModel) => {
    options.lean = true;
    return modelName.find(criteria, projection, options).populate(populateModel);
};

const findAllWithPopulateWithSorting = async (modelName, criteria, projection, options, populateModel) => {
    options.lean = true;
    return modelName.find(criteria, projection, options).collation({ locale: 'en' }).populate(populateModel);
};

const updateOne = async (modelName, criteria, dataToSet, options) => {
    options.new = true;
    options.lean = true;

    return modelName.updateOne(criteria, dataToSet, options);
};

module.exports = {
    getData,
    getDataWithSorting,
    findAllWithPopulateWithSorting,
    getFirstMatch,
    insertMany,
    findOneAndPopulate,
    countData,
    createData,
    aggregateData,
    aggregateAndPopulate,
    updateData,
    aggregateDataWithSorting,
    deleteMany,
    deleteOne,
    updateMany,
    findAllWithPopulate,
    updateOne
};
