interface Config {
    DATABASE_HOST: string,
    DATABASE_USER: string,
    DATABASE_NAME: string,
    DATABASE_PASS: string,
    PORT: number,
    LOG_QUERY: boolean
}

const config: Config = {
    DATABASE_HOST: Bun.env.DATABASE_HOST || 'mysql.csh.rit.edu',
    DATABASE_USER: Bun.env.DATABASE_USER || 'schedulemaker',
    DATABASE_NAME: Bun.env.DATABASE_NAME || 'schedulemaker',
    DATABASE_PASS: Bun.env.DATABASE_PASS,
    PORT: parseInt(Bun.env.PORT) || 8080,
    LOG_QUERY: Bun.env.LOG_QUERY || false
};

export default config;