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

async function getFilteredAndSortedWorks(category) {
    try {
        const query = category ? { category } : {};
        const works = await WorkSchema.find(query).sort({ dateFinished: -1 }); // Фильтрация по категории и сортировка по убыванию даты
        return works;
    } catch (err) {
        console.error(
            `Error fetching filtered and sorted works: ${err.message}`
        );
        throw err;
    }
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
    getFilteredAndSortedWorks,
    deleteWork,
    createWork,
    updateWork,
    getAllCategories,
    getTechnologies,
};
