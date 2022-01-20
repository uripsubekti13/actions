require('dotenv').config();
const { getDrive, uploadFile, generatePublicUrl } = require('../utils/drive');
const { exeAsync, sendReport } = require('../utils/other');
const moment = require('moment');

const main = async () => {
    try {
        const drive = getDrive();

        const url = process.argv[2];
        const filename = process.argv[3] || `tmp_${moment().format('YYYYMMDD_HHmmss')}`;
        // console.log({url, filename});

        console.log('Downloading file ...');
        const cmd = `curl -X GET \"${url}\" -o \"${filename}\"`;
        await exeAsync(cmd);

        console.log('Uploading to drive ...');
        const uploadedFile = await uploadFile(drive, filename, filename, process.env.GA_TMP_DRIVE_PARENT_ID);
        const result = await generatePublicUrl(drive, uploadedFile.id);
        const fileUrl = result?.webContentLink;

        if (fileUrl) {
            // console.log('Upload successfully:', fileUrl);
            await sendReport(encodeURIComponent(`New file downloaded to TMP folder:\n${fileUrl}`));
        }
    } catch (error) {
        console.log(error?.response?.data || error?.message);
    }
}

main()