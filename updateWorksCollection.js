const { MongoClient } = require("mongodb");

async function updateWorksCollection() {
    const client = new MongoClient(process.env.MONGO_URL);

    try {
        await client.connect();
        const database = client.db("Portfolio");
        const collection = database.collection("works");

        const updateResult = await collection.updateMany({}, [
            {
                $set: {
                    frontTech: {
                        $arrayToObject: {
                            $map: {
                                input: {
                                    $objectToArray: {
                                        $cond: {
                                            if: { $isArray: "$frontTech" },
                                            then: {
                                                $map: {
                                                    input: "$frontTech",
                                                    as: "item",
                                                    in: {
                                                        k: "$$item.name",
                                                        v: "$$item.apply",
                                                    },
                                                },
                                            },
                                            else: {
                                                $ifNull: ["$frontTech", {}],
                                            },
                                        },
                                    },
                                },
                                as: "item",
                                in: {
                                    k: "$$item.k",
                                    v: {
                                        $map: {
                                            input: "$$item.v",
                                            as: "tech",
                                            in: {
                                                name: "$$tech.name",
                                                apply: "$$tech.apply",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    backTech: {
                        $arrayToObject: {
                            $map: {
                                input: {
                                    $objectToArray: {
                                        $cond: {
                                            if: { $isArray: "$backTech" },
                                            then: {
                                                $map: {
                                                    input: "$backTech",
                                                    as: "item",
                                                    in: {
                                                        k: "$$item.name",
                                                        v: "$$item.apply",
                                                    },
                                                },
                                            },
                                            else: {
                                                $ifNull: ["$backTech", {}],
                                            },
                                        },
                                    },
                                },
                                as: "item",
                                in: {
                                    k: "$$item.k",
                                    v: {
                                        $map: {
                                            input: "$$item.v",
                                            as: "tech",
                                            in: {
                                                name: "$$tech.name",
                                                apply: "$$tech.apply",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    cardImage: {
                        name: "$cardImage.name",
                        blurHash: "$cardImage.blurHash",
                        url: "$cardImage.url",
                        destination: "$cardImage.destination",
                        size: "$cardImage.size",
                    },
                    images: {
                        $map: {
                            input: "$images",
                            as: "image",
                            in: {
                                name: "$$image.name",
                                blurHash: "$$image.blurHash",
                                url: "$$image.url",
                                destination: "$$image.destination",
                                size: "$$image.size",
                            },
                        },
                    },
                },
            },
        ]);

        console.log(
            `Matched ${updateResult.matchedCount} documents and modified ${updateResult.modifiedCount} documents.`
        );
    } catch (error) {
        console.error("Error updating works collection:", error);
        throw error;
    } finally {
        await client.close();
    }
}

module.exports = { updateWorksCollection };
