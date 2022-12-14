export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongoDb: process.env.MONGODB,
    port: process.env.DEFAULT_LIMIT || 3002,
    default_limit: +process.env.DEFAULT_LIMIT || 20,
})