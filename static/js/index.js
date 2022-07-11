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
    let flag = document.getElementById("view").className;

    if (flag == "view-container shadow nonvisible"){
        // grab filename from dynamically added dz filename class
        let filenames = document.getElementsByClassName("dz-filename");
        let fn = filenames[0].innerText;

        fetch(`/get-list/${JSON.stringify(fn)}`)
            .then(function (response) {
                return response.text();
            }).then(function (data) {
                document.getElementById("container").className = "container blur";

                document.getElementById("view").className = "view-container fade-in-image shadow";
                // document.getElementById("view-content").innerHTML = data;
            });
    } else {
        document.getElementById("container").className = "container";
        document.getElementById("view").className = "view-container fade-in-image shadow nonvisible";        
    }
}

// Event listeners
window.addEventListener('click', function(e){   
    if (document.getElementById('view').contains(e.target)){
      // Clicked in box
    } else{
      // Clicked outside the box
      document.getElementById("container").className = "container";
      document.getElementById("view").className = "view-container shadow nonvisible";   
    }
  });