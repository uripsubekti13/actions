require('dotenv').config();
const dropbox = require('../utils/dropbox');
const { getDrive, getDirList, createDir, uploadFile, generatePublicUrl } = require('../utils/drive');
const { exeAsync, sendReport } = require('../utils/other');

const main = async () => {
    try {
        const drive = getDrive();
        const downloaded = (await getDirList(drive, process.env.GA_DESIGN_CODE_DRIVE_PARENT_ID)).map(x => x.name);
        const data = await dropbox.getFileList(process.env.GA_DESIGN_CODE_COURSE_PATH);
        const unDownloadedData = data.filter(d => !downloaded.includes(d.name));
        if (unDownloadedData && unDownloadedData.length > 0) {
            const dir = unDownloadedData[0];

            const dirName = dir?.name;
            const nextPath = dir?.path_lower + '/videos';
            const nextData = await dropbox.getFileList(nextPath);
            const files = nextData.filter(d => d['.tag'] === 'file');
            const updir = await createDir(drive, dirName, process.env.GA_DESIGN_CODE_DRIVE_PARENT_ID);
            const uploadedFiles = [];

            for (const x of files) {
                const downloadUrl = 'https://content.dropboxapi.com/2/files/download';
                const cmd = `curl -X POST \"${downloadUrl}\" -o \"videos/${x.name}\" -H 'Dropbox-API-Arg: {\"path\":\"${x.id}\"}' -H 'Content-Type: application/octet-stream; charset=utf-8' -H 'Authorization: Bearer ${process.env.GA_DESIGN_CODE_TOKEN}'`;

                await exeAsync(cmd);
                const uploadedFile = await uploadFile(drive, `videos/${x.name}`, x.name, updir.id);
                const result = await generatePublicUrl(drive, uploadedFile.id);
                console.log(result.webContentLink);
                uploadedFiles.push({url: result.webContentLink, name: x.name});
            }
            let reportMsg = [dirName, '===================\n\n', ...uploadedFiles.map(x => x.name + '\n' + x.url + '\n\n')].join('\n');
            reportMsg = encodeURIComponent(reportMsg);
            console.log({reportMsg});
            await sendReport(reportMsg);
        } else {
            console.log('All data has been download');
            await sendReport('All data has been download');
        }
    } catch (error) {
        console.log(error?.response?.data || error?.message);
    }
}

main()