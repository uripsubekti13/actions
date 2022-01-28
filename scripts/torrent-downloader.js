const { writeFileSync } = require('fs');
const { exec } = require("child_process");
const kill = require('tree-kill');

const exeAsync = async (cmd) => {
    return new Promise((resolve, reject) => {
        const p = exec(cmd, (err, stdout, stderr) => {
            if (err) {
                reject(stderr)
            } else {
                resolve(stdout)
            }
        });
        
        let lastProcess = null;
        p.stdout.on('data', (data) => {
            if (data !== lastProcess) console.log(data);
            lastProcess = data;
            if (data.includes('Progress: 100.0%') || data.includes('Seeding') ) {
                console.log('FINISH', {pid: p.pid});
                kill(p.pid);
            }
        });
    })
}

const main = async () => {
    try {
        const url = process.argv[2];
        const dir = process.argv[3];
        let cmd =`transmission-cli ${url}`;
        if (dir) cmd += ` -w ${dir}`;
        console.log(`execute: `, cmd);
        await exeAsync(cmd);
    } catch (error) {
        console.log(error?.response?.data || error?.message);
    }
}

main()
