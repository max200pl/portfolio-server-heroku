const WorkSchema = require("../db/works.mongo");
const CategoryWork = require("../db/categoriesWorks.mongo");
const technologiesSchema = require("../db/technologies.mongo");

async function createWork(work) {
    try {
        const result = await WorkSchema.create(work);
        const populatedResult = await WorkSchema.findById(result._id).populate(
            "category"
        );
        console.log("Work created in database");
        return populatedResult;
    } catch (err) {
        console.log(`Could not save work ${err}`);
    }
}

async function updateWork(work) {
    try {
        const result = await WorkSchema.findByIdAndUpdate(
            work._id,
            { $set: work },
            { new: true, useFindAndModify: false }
        ).populate("category");
        if (!result) {
            console.log(`Work not found with ID ${work._id}`);
            return null;
        }
        console.log("Work updated in database");
        return result;
    } catch (err) {
        console.log(`Error updating Work with ID ${work._id}: ${err}`);
    }
}

async function deleteWork(_id) {
    try {
        const result = await WorkSchema.deleteOne({ _id });
        console.log("Work deleted from database successfully.");
        return result;
    } catch (err) {
        console.log(`Could not deleted work ${err}`);
    }
}

async function getFilteredAndSortedWorks(category) {
    try {
        const query = category ? { category } : {};
        const works = await WorkSchema.find(query)
            .sort({ dateFinished: -1 }) // Filtering by category and sorting by date
            .populate("category"); // Populate the category field with the actual category data
        return works;
    } catch (err) {
        console.error(
            `Error fetching filtered and sorted works: ${err.message}`
        );
    }
}

async function getAllWorkCategories() {
    try {
        const categories = await CategoryWork.find();
        if (!categories.length) {
            throw new Error("No categories found");
        }
        return categories;
    } catch (err) {
        console.error(`Error fetching categories: ${err.message}`);
    }
}

async function createWorkCategory(categoryData) {
    try {
        const result = await CategoryWork.create(categoryData);
        console.log("Work category created in database");
        return result;
    } catch (err) {
        console.error(`Could not save work category: ${err.message}`);
    }
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

async function getWorkById(_id) {
    try {
        const work = await WorkSchema.findById(_id).populate("category");
        if (!work) {
            console.log(`Work not found with ID ${_id}`);
            return null;
        }
        return work;
    } catch (err) {
        console.log(`Error finding Work with ID ${_id}: ${err.message}`);
    }
}

module.exports = {
    getFilteredAndSortedWorks,
    deleteWork,
    createWork,
    updateWork,
    getAllWorkCategories,
    getTechnologies,
    getWorkById,
    createWorkCategory,
};
