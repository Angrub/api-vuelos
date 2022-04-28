
const config = {
    app: {
        port: process.env.API_PORT,
        adminPassword: process.env.ADMIN_PASSWORD,
        adminEmail: process.env.ADMIN_EMAIL,
        jwtSecret: process.env.JWT_SECRET || 'this not work',
        seeder: process.env.SEEDER || 0
    },
    db: {
        uri: process.env.MONGO_URL || 'this not work'
    }
}

export { config };