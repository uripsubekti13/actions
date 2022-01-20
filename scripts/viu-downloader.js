require('dotenv').config();
const { Home, Detail, HLS } = require('viu-api-wrapper')
const { exeAsync, sendReport } = require('../utils/other');
const moment = require('moment');
const { getDrive, uploadFile, generatePublicUrl } = require('../utils/drive');
const { readFileSync, createWriteStream } = require('fs');
const axios = require('axios').default;


const main = async () => {
    try {
        const id = process.argv[2];
        const { playUrl } = await HLS.getPlayUrl(id);
        console.log({ playUrl });

        if (playUrl) {
            console.log('[Viu] Start Manipulation');
            const baseURL = playUrl.split('/').slice(0, -1).join('/');
            console.log(`[VIU] baseUrl:`, baseURL);

            await exeAsync(`curl -X GET \"${playUrl}\" -o \"main.m3u8\"`);
            // await exeAsync(`cat main.m3u8`);
            await exeAsync(`mkdir TS`);
            const mainHLSArr = readFileSync('main.m3u8', 'utf8').split('\n');
            const highResUrl = baseURL + '/' + mainHLSArr.filter((line) => line.includes('.m3u8') && !line.includes('#EXT-X-MEDIA:TYPE=SUBTITLES') && !line.includes('"')).reverse()[0];

            console.log('[Viu] highResUrl:', highResUrl);

            await exeAsync(`hls-downloader -o DL/video_${moment().format('YYYYMMDD_HHmmss')}.mp4 ${highResUrl}`);
           
            console.log('[Viu] Done');

        }
    } catch (error) {
        console.log(error);
        console.log(error?.response?.data || error?.message);

    }
}

main();