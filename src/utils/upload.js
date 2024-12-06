/**
 * @param {*} binaryData
 * @param {*} destination
 * @param {*} bucket
 * @param {*} contentType
 * @returns
 */
async function uploadBinaryData(binaryData, destination, bucket, contentType) {
    return new Promise((resolve, reject) => {
        const file = bucket.file(destination);
        const stream = file.createWriteStream({
            metadata: {
                contentType,
            },
        });

        stream.on("error", (err) => {
            reject(err);
        });

        stream.on("finish", () => {
            console.log(`Файл успешно загружен в ${destination}`);
            resolve();
        });

        stream.end(binaryData);
    });
}

export { uploadBinaryData };
