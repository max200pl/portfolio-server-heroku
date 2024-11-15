const WorkSchema = require("../db/works.mongo");
const technologiesSchema = require("../db/technologies.mongo");

async function createWork(work) {
    try {
        const result = await WorkSchema.create(work);
        console.log("Work created in database");
        return result;
    } catch (err) {
        console.log(`Could not save work ${err}`);
    }
}

async function updateWork(work) {
    try {
        const result = await WorkSchema.updateOne(
            { _id: work._id },
            { $set: work }
        );
        console.log("Work updated in database");
        return result;
    } catch (err) {
        console.log(`Could not updated work ${err}`);
    }
}

async function deleteWork(id) {
    try {
        const result = await WorkSchema.deleteOne({ _id: id });
        console.log("Work deleted from database successfully.");
        return result;
    } catch (err) {
        console.log(`Could not deleted work ${err}`);
    }
}

async function getAllWorks() {
    return await WorkSchema.find(
        {},
        {
            __v: 0,
        }
    );
}

async function getGetFilterWorks(category) {
    return await WorkSchema.find(
        { category: category }, // which fields are included in the response
        {
            __v: 0,
        }
    );
}

async function getAllCategories() {
    return await WorkSchema.find({}, { category: 1, _id: 0 });
}

async function getTechnologies() {
    return await technologiesSchema.find(
        {},
        {
            _id: 0,
            String: 0,
        }
    );
}

module.exports = {
    getAllWorks,
    deleteWork,
    createWork,
    updateWork,
    getAllCategories,
    getGetFilterWorks,
    getTechnologies,
};
