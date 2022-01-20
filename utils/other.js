require('dotenv').config();
const { exec } = require("child_process");

const exeAsync = async (cmd) => {
    return new Promise((resolve, reject) => {
        const p = exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(stderr)
            } else {
                resolve(stdout)
            }
        });

        p.stdout.on('data', function (data) {
            console.log(data);
        });
    })
}

const sendReport = async (msg) => {
    const url = `https://api.telegram.org/bot${process.env.GA_TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${process.env.GA_TELEGRAM_CHAT_ID}&text=${msg}`
    const cmd = `curl \"${url}\"`;
    await exeAsync(cmd);
}

module.exports = { exeAsync, sendReport }