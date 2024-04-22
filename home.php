<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Connect to Instagram</title>
</head>

<body>
    <h1>Connect to Instagram</h1>
    <button id="connectBtn">Connect</button>
    <script>
        // Function to fetch Instagram data and display it
        function fetchAndDisplayInstagramData() {
            // Get current page URL
            var currentPageURL = window.location.href;
            console.log("Current Page URL:", currentPageURL); // Log the URL

            var token = new URL(currentPageURL).searchParams.get('token');
            if (token) {
                // Remove the token from the URL
                var newURL = currentPageURL.split('?')[0];
                history.replaceState(null, '', newURL);

                // If a token is found, use it to fetch data from Instagram
                fetch('https://graph.instagram.com/me?fields=id,username,media_count&access_token=' + token)
                    .then(response => response.json())
                    .then(data => {
                        // Log the fetched data
                        console.log('Instagram User Info:', data);

                        // Display the fetched data on the page
                        var userInfo = document.createElement('div');
                        userInfo.innerHTML = `
                    <h2>Instagram User Info</h2>
                    <p>ID: ${data.id}</p>
                    <p>Name: ${data.username}</p>
                    <p>Media Count: ${data.media_count}</p>
                `;
                        document.body.appendChild(userInfo);
                    })
                    .catch(error => {
                        console.error('Error fetching Instagram data:', error);
                    });
            } else {
                console.log('No token found in the URL.');
            }
        }

        // Call the function to fetch and display Instagram data when the page loads
        window.onload = fetchAndDisplayInstagramData;


        document.getElementById("connectBtn").addEventListener("click", function() {
            // Get current page URL
            var currentPageURL = window.location.href;
            console.log("Current Page URL:", currentPageURL); // Log the URL

            // Send current page URL to Node.js server using fetch API
            fetch('https://instagram-plug-618o.vercel.app/getUrl', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        currentPageURL: currentPageURL
                    })
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = "https://instagram-plug-618o.vercel.app/";
                    } else {
                        throw new Error('Network response was not ok.');
                    }
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                });
        });
    </script>


</body>

</html>