const { Work, parseDeep } = require("../../helpers/helpers");
const {
    getAllCategories,
    getTechnologies,
    createWork,
    updateWork,
    deleteWork,
    getFilteredAndSortedWorks,
} = require("../../models/works.model");
const { getCardImage } = require("../../utils/images");
const path = require("path");

async function httpGetFilteredAndSortedWorks(req, res) {
    const { category } = req.query;

    try {
        const works = await getFilteredAndSortedWorks(category);
        console.log(`Returned ${works.length} works`);
        res.status(200).json(works);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

async function httpGetImagesWork(req, res) {
    const { project, name } = req.query;

    console.log("Project:", project);

    const options = {
        root: path.join(__dirname, "../../images/" + project),
        dotfiles: "deny",
        headers: {
            "x-timestamp": Date.now(),
            "x-sent": true,
        },
    };

    return res.sendFile(name, options, function (err) {
        if (err) {
            console.log(err.message);
        } else {
            console.log(`Sent: ${project}__${name}____`);
        }
    });
}
async function httpGetCategoriesWorks(req, res) {
    const allCategories = await getAllCategories();

    if (!allCategories)
        return res.status(400).json({
            error: `Something went wrong`,
        });

    return res.status(200).json(allCategories);
}
async function httpGetTechnologies(req, res) {
    const technologies = await getTechnologies();

    if (!technologies)
        return res.status(400).json({
            error: `Something went wrong`,
        });

    return res.status(200).json(technologies[0]);
}

async function httpCreatedWork(req, res) {
    const work = req.body;
    const image = req.file;

    if (!work || !image)
        return res.status(400).json({
            error: `Something went wrong`,
        });

    try {
        work.cardImage = await getCardImage(work.name, image);

        const result = await createWork(Work.create({ ...work }));

        console.log("Create work success:", result);

        return res.status(201).json({ id: result._id, ...work });
    } catch (err) {
        console.error(err.message);
    }
}

async function httpUpdatedWork(req, res) {
    const work = parseDeep(req.body);
    const image = req.file;

    try {
        if (image) {
            work.cardImage = await getCardImage(work.name, image);
        }
        console.log("Current work for update:", work);
        const result = await updateWork(work);
        console.log("The work was successfully updated:", result);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({
            error: `Something went wrong`,
        });
    }

    return res.status(200).json(work);
}

async function httpDeleteWork(req, res) {
    const { id } = req.query;

    try {
        console.log("Current ID for delete:", id);
        const result = await deleteWork(id);
        console.log("The work was successfully updated:", result);
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({
            error: `Something went wrong`,
        });
    }

    return res.status(200).json(id);
}

module.exports = {
    httpGetFilteredAndSortedWorks,
    httpGetImagesWork,
    httpGetCategoriesWorks,
    httpCreatedWork,
    httpUpdatedWork,
    httpGetTechnologies,
    httpDeleteWork,
};
