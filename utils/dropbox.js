const { dropboxApi } = require('./axios');

const getFileList = async (path) => {
    const resp = await dropboxApi.post('/files/list_folder', { path });
    return resp?.data?.entries || [];
};

module.exports = { getFileList }