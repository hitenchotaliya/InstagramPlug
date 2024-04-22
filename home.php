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