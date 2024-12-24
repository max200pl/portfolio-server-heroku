const { v4: uuidv4 } = require("uuid");
const path = require("path");

function toCamelCase(str) {
    if (typeof str !== "string") {
        console.error(
            `Error converting to camelCase: input is not a string ${str}`
        );
        return str;
    }
    try {
        return str
            .trim()
            .replace(/\s+/g, " ")
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase());
    } catch (error) {
        console.error("Error converting to camelCase:", error.message);
        return str;
    }
}

function isDateValid(dateStr) {
    return !isNaN(new Date(dateStr));
}

function parseDeep(data) {
    if (typeof data !== "object" || data === null) {
        return data;
    }

    if (Array.isArray(data)) {
        return data.map(parseDeep);
    }

    const parsedObject = {};
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            try {
                parsedObject[key] = isDateValid(value)
                    ? new Date(value)
                    : JSON.parse(value);
            } catch (e) {
                parsedObject[key] = value;
            }
        }
    }

    return parsedObject;
}

/**
 * Generate a unique image destination path
 * @param {{
 *  type: "works" | "certificates",
 *  name: string,
 *  file: {
 *    originalname: string
 *  }
 * }} destination - The type of image
 * @returns {string} - The image destination path
 */
function generateImageDestination({ type, name, file }) {
    const uniqueId = uuidv4({
        rng: uuidv4.nodeRNG, // Use node.js crypto module for random values
    });
    const camelCaseName = toCamelCase(name);
    const fileType = path.extname(file.originalname);
    return `images/${type}/${camelCaseName}_${uniqueId}${fileType}`;
}

module.exports = {
    parseDeep,
    toCamelCase,
    generateImageDestination,
};
