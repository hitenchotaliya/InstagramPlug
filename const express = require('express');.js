const express = require('express');
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const INSTAGRAM_APP_ID = '419232580804647';
const INSTAGRAM_APP_SECRET = '56b7fae5ccfdce70e1d87a9668f43e8e';
const INSTAGRAM_APP_REDIRECT_URI = 'https://instagram-plug-618o.vercel.app/getCode'; // Update to your live app URL

let longLivedToken = null;

const authorizationUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(INSTAGRAM_APP_REDIRECT_URI)}&scope=user_profile,user_media&response_type=code`;

app.get('/', (req, res) => {
    if (!longLivedToken) {
        res.send(`<a href="${authorizationUrl}">Authorize w/Instagram</a>`);
    } else {
        const igUserInfoUrl = `https://graph.instagram.com/me?fields=id,username,media_count&access_token=${longLivedToken}`;
        axios.get(igUserInfoUrl)
            .then(response => {
                const userData = response.data;
                res.send(`
                    <h1>Instagram User Info</h1>
                    <p>ID: ${userData.id}</p>
                    <p>Name: ${userData.username}</p>
                    <p>Media Count: ${userData.media_count}</p>
                    <a href="/">Logout</a>
                `);
            })
            .catch(error => {
                console.error('Error fetching user info:', error);
                res.status(500).send('Error fetching user info');
            });
    }
});

app.get('/getCode', async (req, res) => {
    try {
        const { code } = req.query;
        const tokenParams = new URLSearchParams({
            app_id: INSTAGRAM_APP_ID,
            app_secret: INSTAGRAM_APP_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: INSTAGRAM_APP_REDIRECT_URI,
            code: code
        });

        const accessTokenUrl = 'https://api.instagram.com/oauth/access_token';
        const tokenResponse = await axios.post(accessTokenUrl, tokenParams);

        longLivedToken = tokenResponse.data.access_token;

        // Redirect back to homepage after storing the tokens
       res.redirect('/');
             //   res.redirect('http://localhost/xyz');

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get("/privacy-policy", (request, response) => {
    response.sendFile(path.join(__dirname, 'privacy-policy.html'));
});
app.get("/terms-conditions", (request, response) => {
    response.sendFile(path.join(__dirname, 'terms-conditions.html'));
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});