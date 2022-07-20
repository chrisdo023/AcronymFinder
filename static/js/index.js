// Button functions
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
        if (document.getElementById("dot-container").children.length == 1){
            fetch(`/get-list/${JSON.stringify(fn)}`)
                .then(function (response) {
                    return response.text();
                }).then(function (data) {
                    document.getElementById("container").className = "container blur";
                    document.getElementById("view").className = "view-container fade-in-image shadow";
                    
                    const jsonObj = JSON.parse(data);
                    var count = 1;
                    var dot = 1;
                    var page = 1;
                    var row = 1;

                    for(let key in jsonObj){
                        if(count%10 == 0){
                            page++;
                            var divtag = document.createElement('div');
                            divtag.className = "mySlides";
                            divtag.style = "background-color: #e62636; border-radius: 20px 20px 0 0; text-align: center;"
                            divtag.id = '"page-' + page + '"';
                            document.getElementById('slideshow-container').appendChild(divtag);

                            // divtag.className = "row fade-in-image";
                            // divtag.id = "view-row-" + row.toString(2);
                            // document.getElementById('"page-' + page + '"').appendChild(divtag);

                            var spantag = document.createElement('span');
                            spantag.className = "dot";
                            // spantag.onclick = function() {
                            //     currentSlide(dot.toString(2));
                            // };
                            document.getElementById('dot-container').appendChild(spantag); 
                            dot++;  
                        }

                        count++;
                    }

                    // var atagprev = document.createElement('a');
                    // atagprev.class="prev";
                    // atagprev.onclick = plusSlides(-1);
                    // document.getElementById('"page-' + page + '"').appendChild(atagprev);

                    // var atagnext = document.createElement('a');
                    // atagnext.class="next";
                    // atagnext.onclick = plusSlides(1);
                    // document.getElementById('"page-' + page + '"').appendChild(atagnext);
                });
        } else {
            document.getElementById("container").className = "container blur";
            document.getElementById("view").className = "view-container fade-in-image shadow";
        }
    } else {
        document.getElementById("container").className = "container";
        document.getElementById("view").className = "view-container fade-in-image shadow nonvisible";        
    }
}

function editLongform(e) {
    // Acquire long form of row
    let el = e.parentNode.parentNode.childNodes[3];
    let cls = e.className;

    if(cls == "fa-solid fa-floppy-disk"){
        e.className = "fa-solid fa-pen"
        el.contentEditable = false;
    }

    if(cls == "fa-solid fa-pen"){
        e.className = "fa-solid fa-floppy-disk" 
        el.contentEditable = true;
        el.focus();
    }
}

// Toggle display function
function toggleDisplay() {
    // Checks if body is dark, else set to dark mode
    if(document.body.className == "dark"){
        document.body.className = ""
        document.getElementById("display-mode").innerText = "Light Mode";

        document.getElementById("dropzone").classList.remove("dark");
        document.getElementById("action-one").className = "column column-action";

        fetch(`/set_cookie/${JSON.stringify("DarkMode")}/${JSON.stringify("False")}`)
        .then(function (response) {
            return response.text();
        }).then(function (data) {
            console.log(data)
        });
    } else {
        document.body.className = "dark";
        document.getElementById("display-mode").innerText = "Dark Mode";

        document.getElementById("dropzone").classList.add("dark");
        document.getElementById("action-one").className = "column column-action dark";

        fetch(`/set_cookie/${JSON.stringify("DarkMode")}/${JSON.stringify("True")}`)
        .then(function (response) {
            return response.text();
        }).then(function (data) {
            console.log(data)
        });
    }
}

// Slide show
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
}

// Event listeners
window.addEventListener('click', function(e){   
    if (document.getElementById('view').contains(e.target)){
      // Clicked in box
    } else{
        if (document.getElementById('fa-eye').contains(e.target)){
            // Clicked on View btn
        } else {
            // Clicked outside the box
            document.getElementById("container").className = "container";
            document.getElementById("view").className = "view-container shadow nonvisible"; 
        }  
    }
});

// Check for cookies when page loads
function checkCookies(){
    // Parse through cookie data for DarkMode and Onboard
    // fetch(`/get_cookie/${JSON.stringify("darkmode")}`)
    fetch(`/get_cookie/${JSON.stringify('DarkMode')}`)
    .then(function (response) {
        return response.text();
    }).then(function (data) {
        if(data == 'True'){
            document.body.className = "dark";
            document.getElementById("display-mode").innerText = "Dark Mode";
            document.getElementById("dropzone").classList.add("dark");
            document.getElementById("action-one").className = "column column-action dark";            
        }
    });
}

// Run at start of page
checkCookies();