require('dotenv').config();
const { getDrive, createDir, uploadFile, generatePublicUrl } = require('../utils/drive');
const { exeAsync, sendReport } = require('../utils/other');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const walk = async (dir, driveDirId) => {
    const drive = getDrive();
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const filepath = dir + '/' + file;
        const stat = fs.statSync(filepath);
        if (stat && stat.isDirectory()) {
            console.log('Create Dir: ', filepath);
            const newDir = await createDir(drive, file, driveDirId);
            walk(filepath, newDir.id);
        } else {
            console.log('Upload File: ', filepath);
            const uploadedFile = await uploadFile(drive, filepath, file, driveDirId);
        }
    }
}

const main = async () => {
    try {
        const dir = process.argv[2];
        const filepath = path.join(__dirname, '../', dir);
        console.log({ filepath });
        const driveParentId = process.env.GA_TMP_DRIVE_PARENT_ID;
        await walk(filepath, driveParentId);
    } catch (error) {
        console.log(error?.response?.data || error?.message);
    }
}

main()