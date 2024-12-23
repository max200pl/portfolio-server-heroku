function removeEmptyFields(obj) {
    for (const key in obj) {
        if (
            obj[key] === undefined ||
            obj[key] === null ||
            obj[key] === "" ||
            obj[key] === false ||
            obj[key] === 0 ||
            (Array.isArray(obj[key]) && obj[key].length === 0) ||
            (typeof obj[key] === "object" && Object.keys(obj[key]).length === 0)
        ) {
            delete obj[key];
        }
    }
    return obj;
}

function techUpdates(oldTech, newTech, techType) {
    if (!newTech) {
        console.log(`No new ${techType} data provided.`);
        return oldTech;
    }

    if (!oldTech) {
        oldTech = {};
    }

    console.log(`Updating ${techType} fields:`);
    for (const key in newTech) {
        if (newTech.hasOwnProperty(key)) {
            const oldValue = JSON.stringify(oldTech[key]);
            const newValue = JSON.stringify(newTech[key]);
            if (oldValue !== newValue) {
                console.log(
                    `Field: ${key}, Old Value: ${oldValue}, New Value: ${newValue}`
                );
                oldTech[key] = newTech[key];
            }
        }
    }

    return removeEmptyFields(oldTech);
}

module.exports = {
    techUpdates,
    removeEmptyFields,
};
