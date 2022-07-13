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
                    // var divstr = '<div class="row fade-in-image" id="view-row-' + count + '" style="background-color: white;"><div class="column column-shortform"><div>' + key + '</div></div><div class="column column-longform"><div>' + jsonObj[key] + '</div></div><div class="column column-action"><i title="Edit" class="fa-solid fa-pen" onclick="editLongform(this)"></i></div></div><div class="line" id="line-"' + count + '></div>';
                    // document.getElementById("view-row-" + `${row}`).insertAdjacentHTML('afterend', divstr);

                    if(count%10 == 0){
                        page++;
                        row++;
                        // Add new slide after previous slide
                        var slidediv = '<div class="mySlides" style="background-color: #e62636; border-radius: 20px 20px 0 0; text-align: center;" id="page-"' + page + '></div>';
                        var oldpage = "page-" + `${page-1}`;
                        document.getElementById(oldpage).insertAdjacentHTML('afterend', slidediv);

                        // Add header to the new slide
                        var newpage = "page-" + page
                        var headerdiv = `<div class="row fade-in-image" id="view-row-"` + `${row}` + `><div class="column column-shortform" style="color: white; font-weight: bold;"><div>Short Form</div></div><div class="column column-longform" style="color: white; font-weight: bold;"><div>Long Form</div></div><div class="column column-action" style="color: white; font-weight: bold;"><div>Action</div></div></div>`
                        document.getElementById(newpage).appendChild(headerdiv)

                        // var spanstr = '<span class="dot" onclick="currentSlide(' + `${dot}` + ')"></span>'; 
                        // document.getElementById('dot-container').appendChild(spanstr);
                        // dot++;
                    }

                    count++;
                }
            });
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
      // Clicked outside the box
      document.getElementById("container").className = "container";
      document.getElementById("view").className = "view-container shadow nonvisible";   
    }
});