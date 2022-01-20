require('dotenv').config();
const { getDrive, uploadFile, generatePublicUrl } = require('../utils/drive');
const { exeAsync, sendReport } = require('../utils/other');
const moment = require('moment');

const main = async () => {
    try {
        const drive = getDrive();
        const filepath = process.argv[2];
        const filename = process.argv[3] || `tmp_${moment().format('YYYYMMDD_HHmmss')}`;
     
        const uploadedFile = await uploadFile(drive, filepath, filename, process.env.GA_TMP_DRIVE_PARENT_ID);
        const result = await generatePublicUrl(drive, uploadedFile.id);
        const fileUrl = result?.webContentLink;

        if (fileUrl) {
            await sendReport(encodeURIComponent(`New file downloaded to TMP folder:\n${fileUrl}`));
        }
    } catch (error) {
        console.log(error?.response?.data || error?.message);
    }
}

main()