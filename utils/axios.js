require('dotenv').config();

const axios = require("axios").default;
const baseURL = {
    dropbox: {
        api: `https://api.dropboxapi.com/2`,
        content: `https://content.dropboxapi.com/2`,
    }
}

module.exports = {
    dropboxApi: axios.create({ baseURL: baseURL.dropbox.api, headers: { 'Authorization': `Bearer ${process.env.GA_DESIGN_CODE_TOKEN}` } }),
    dropboxContent: axios.create({ baseURL: baseURL.dropbox.content, headers: { 'Authorization': `Bearer ${process.env.GA_DESIGN_CODE_TOKEN}` } })
}