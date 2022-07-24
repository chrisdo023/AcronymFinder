// Run at start of page
checkCookies();

// Check for cookies when page loads
function checkCookies(){
    // Parse through cookie data for DarkMode and Onboard
    fetch(`/get_cookie/${JSON.stringify('DarkMode')}`)
    .then(function (response) {
        return response.text();
    }).then(function (data) {
        if(data == 'True'){
            document.body.className = "dark";
            document.getElementById("display-mode").innerText = "Dark Mode";
            document.getElementById("dropzone").classList.add("dark");
            document.getElementById("onboarding-container").classList.add("o-dark");
            document.getElementById("action-one").className = "column column-action dark";   
            document.getElementById("help").classList.add("dark");
            document.getElementById("contactus").classList.add("dark");  
        }
    });

    fetch(`/get_cookie/${JSON.stringify('Onboarding')}`)
    .then(function (response) {
        return response.text();
    }).then(function (data) {
        if(data == 'True'){

        } else {
            document.getElementById("onboarding-container").classList.remove("nonvisible");          
        }
    });
}