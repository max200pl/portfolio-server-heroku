const admin = require("firebase-admin");

async function uploadImageToFirebase(file) {
    try {
        console.log(`Uploading image to Firebase: ${file.originalname}`);

        // Инициализация хранилища
        const bucket = admin.storage().bucket();
        const destination = `images/${file.originalname}`;
        const contentType = file.mimetype;
        const fileBuffer = file.buffer;

        // Получаем ссылку на файл в хранилище
        const firebaseFile = bucket.file(destination);

        // Создаём поток для записи данных
        const stream = firebaseFile.createWriteStream({
            metadata: {
                contentType: contentType, // Устанавливаем тип содержимого
            },
        });

        return new Promise((resolve, reject) => {
            stream.on("error", (err) => {
                console.error(
                    `Error uploading image to Firebase: ${err.message}`
                );
                reject(err);
            });

            stream.on("finish", () => {
                console.log(`Image uploaded to Firebase: ${destination}`);
                resolve(destination);
            });

            // Пишем данные в поток
            stream.end(fileBuffer);
        });
    } catch (err) {
        console.error(`Error uploading image to Firebase: ${err.message}`);
        throw err;
    }
}

module.exports = {
    uploadImageToFirebase,
};
