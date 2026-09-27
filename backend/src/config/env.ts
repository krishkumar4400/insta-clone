import "dotenv/config";

type envs = {
    port: string,
    mongo_uri: string
}

const env: envs = {
    port: process.env.PORT!,
    mongo_uri: process.env.MONGO_URI!
};
