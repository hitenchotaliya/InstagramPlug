const express = require('express');
const axios = require('axios');
const https = require('https');
const mysql = require('mysql');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3030;
app.use(cors());
app.use(express.json()); // Parse JSON bodies


// // MySQL connection configuration
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'instagramplugdb'
// });

// // Connect to MySQL
// connection.connect((err) => {
//     if (err) {
//         console.error('Error connecting to MySQL:', err);
//         return;
//     }
//     console.log('Connected to MySQL');
// });

const INSTAGRAM_APP_ID = '419232580804647';
const INSTAGRAM_APP_SECRET = '56b7fae5ccfdce70e1d87a9668f43e8e';
const INSTAGRAM_APP_REDIRECT_URI = 'https://instagram-plug-618o.vercel.app/getCode'; // Update to your live app URL

let longLivedToken = null;
let currentPageURL = null;


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
        console.log('Received Current Page URL:', currentPageURL);

        //Store in
        // if (longLivedToken) {
        //     const sql = `INSERT INTO tokens (token) VALUES (?)`;
        //     connection.query(sql, [longLivedToken], (err, result) => {
        //         if (err) {
        //             console.error('Error saving token to database:', err);
        //             return res.status(500).send('Error saving token to database');
        //         }
        //         console.log('Token saved to database:', longLivedToken);
        //     });
        // }
        // Redirect back to homepage after storing the tokens
        // if (currentPageURL) {
        //     res.redirect(currentPageURL);
        // } else {
        //     res.redirect('/');
        // }
        if (currentPageURL) {
            // Append longLivedToken as a query parameter to the currentPageURL
            const redirectURL = new URL(currentPageURL);
            redirectURL.searchParams.append('token', longLivedToken);
            res.redirect(redirectURL.href);
        } else {
            res.redirect('/');
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post("/getUrl", async (request, response) => {
    try {
        currentPageURL = request.body.currentPageURL;
        if (!currentPageURL) {
            return response.status(400).send('currentPageURL is missing in the request body');
        }
        console.log('Current Page URL:', currentPageURL);

        // Redirect to '/test' after sending the response
        response.redirect('/');
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send('Internal Server Error');
    }
});


app.get("/home", async (req, res) => {
    res.redirect('home.php');
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
