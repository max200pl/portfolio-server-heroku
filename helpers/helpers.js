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
