function getDocx() {
    let filediv = document.getElementById("file-one");
    filediv.className = "row fade-in-image";
    filediv = filediv.querySelectorAll(".column");
    let fn = JSON.stringify(filediv[0].innerText);
    window.location.href = '/get-docx/' + fn;
}

function getXLSX() {
    let filediv = document.getElementById("file-one");
    filediv.className = "row fade-in-image";
    filediv = filediv.querySelectorAll(".column");
    let fn = JSON.stringify(filediv[0].innerText);
    window.location.href = '/get-xlsx/' + fn; 
}

function trash() {
    document.getElementById("file-one").className = "row fade-in-image nonvisible";
    document.getElementById("line-one").className = "line nonvisible";
}

function getAcronyms() {
    // grab filename from dynamically added dz filename class
    let filenames = document.getElementsByClassName("dz-filename");
    let fn = filenames[0].innerText;
    // const request = new XMLHttpRequest();
    // request.onreadystatechange = function() {
    //     if (request.readyState == XMLHttpRequest.DONE) {
    //         alert(request.responseText);
    //     }
    // }
    // request.open('GET', `/get-list/${JSON.stringify(fn)}`, true);
    // request.send();

    fetch(`/get-list/${JSON.stringify(fn)}`)
        .then(function (response) {
            return response.text();
        }).then(function (data) {
            document.getElementById("container").className = "container blur";

            document.getElementById("view").className = "view-container";
            document.getElementById("view-content").innerHTML = data;
        });
}