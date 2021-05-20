const navBox = document.querySelector("#nav-box");
const navBtn = document.querySelectorAll(".nav-button");
const scroll = document.querySelector("#scroll");
const scrollAlert = document.querySelector("#scroll-alert");
const download = document.querySelector("#download");
const mouse = {x: 0, y: 0, LDX: 0, LDY: 0, HDX: 0, HDY: 0, Ldown: false, Hdown: false};
let page = 0;
let prevPage = 0;
let maxPage = 6;
let pageHeight = window.innerHeight;
let animate = false;
let wheelDown;

navBox.style.top = `${window.innerHeight + (window.innerHeight / 2)}px`;
navBtn[page].style.opacity = "1";
download.style.top = `${window.innerHeight - 440}px`;
let downloadLeft = ((window.innerWidth - 1120) / 2) - 208;
let navBoxLeft = ((window.innerWidth - 1120) / 2) - 280;
if(downloadLeft < 50) downloadLeft = 50;
if(navBoxLeft < 50) navBoxLeft = 50;
download.style.right = `${downloadLeft}px`;
navBox.style.right = `${navBoxLeft}px`;
setTimeout(e => {
    navBox.style.transition = ".5s";
    download.style.transition = ".5s";
});

const scrollAlertAnimate = e => {
    scrollAlert.style.transition = ".2s";
    scrollAlert.style.transform = "translate(-45%)";
    setTimeout(e => {
        scrollAlert.style.transform = "translate(-55%)";
        setTimeout(e => {
            scrollAlert.style.transform = "translate(-45%)";
            setTimeout(e => {
                scrollAlert.style.transform = "translate(-55%)";
                setTimeout(e => {
                    scrollAlert.style.transform = "translate(-50%)";
                    setTimeout(e => {
                        scrollAlert.style.transition = ".5s";
                    },200)
                },200)
            },200)
        },200)
    },200)
}

const getIndex = e => {
    let result = -1;
    const items = e.parentNode.querySelectorAll(".nav-button");
    items.forEach((c, i) => {
        if(e === c) result = i;
    })
    return result;
}

const pageScroll = e => {
    if(page < 0) page = 0;
    if(page >= maxPage) page = maxPage - 1;

    if(page > 0 && page < 5) {
        navBtn.forEach(e => {
            e.style.opacity = ".55";
        })
        
        navBtn[page - 1].style.opacity = "1";
        navBox.style.top = `${(window.innerHeight / 2)}px`;
    }else if(page === 0) {
        navBox.style.top = `${window.innerHeight + (window.innerHeight / 2)}px`;
    }else{
        navBox.style.top = `${(window.innerHeight / 2) - 400}px`;
    }

    let scrollY = page * pageHeight;

    if(page === maxPage - 1) {
        download.style.top = `${pageHeight - 330}px`;    
        scrollY = ((page - 1) * pageHeight) + 400;
    }else if(page === 0){
        download.style.top = `${window.innerHeight - 440}px`;
        scrollAlertAnimate();
    }else {
        download.style.top = "40px";    
    }

    if(page !== prevPage) {
        scroll.style.transform = `translateY(-${scrollY}px)`;
        animate = true;
        setTimeout(e => {animate = false}, 500);
        prevPage = page;
    }
}

navBtn.forEach(e => e.addEventListener("click", e => {
    if(!animate) {
        page = getIndex(e.target) + 1;

        pageScroll();
    }
}))

document.addEventListener("wheel", e => {
    if(!animate) {
        if(e.wheelDelta > 0) page--;
        else page++;

        pageScroll();
    }
})

document.addEventListener("keydown", e => {
    const keyC = e.key.toLocaleLowerCase();

    if(!animate) {
        if(keyC === "arrowup") {
            page--;
            pageScroll();
        }
        if(keyC === "arrowdown") {
            page++;
            pageScroll();
        }
    }
})

document.addEventListener("mousedown", e => {
    if(e.button === 0) {
        mouse.LDX = e.pageX;
        mouse.LDY = e.pageY;
        mouse.Ldown = true;
    }
    if(e.button === 1) {
        mouse.HDX = e.pageX;
        mouse.HDY = e.pageY;
        mouse.Hdown = true;
        wheelDown = setInterval(e => {
            if(!animate && mouse.Hdown) {
                if(mouse.HDY + 50 > mouse.y) page--;
                if(mouse.HDY - 50 < mouse.y) page++;
                pageScroll();
            }
        },0);
     }
})

document.addEventListener("mouseup", e => {
    if(e.button === 0) {
        mouse.Ldown = false;
        // if(!animate) {
        //     if(mouse.LDY < mouse.y) page--;
        //     if(mouse.LDY > mouse.y) page++;
        //     pageScroll();
        // }
    }
    if(e.button === 1) {
        mouse.Hdown = false;
        clearInterval(wheelDown);
    }
})

document.addEventListener("mousemove", e => {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})

window.addEventListener("resize", e => {
    pageHeight = window.innerHeight;

    let scrollY = page * pageHeight;

    if(page === maxPage - 1) {
        scrollY = ((page - 1) * pageHeight) + 400;
    }

    scroll.style.transition = "0";
    scroll.style.transform = `translateY(-${scrollY}px)`;

    navBox.style.transition = "0";
    download.style.transition = "0";
    let downloadLeft = ((window.innerWidth - 1120) / 2) - 208;
    let navBoxLeft = ((window.innerWidth - 1120) / 2) - 280;
    if(downloadLeft < 50) downloadLeft = 50;
    if(navBoxLeft < 50) navBoxLeft = 50;
    download.style.right = `${downloadLeft}px`;
    navBox.style.right = `${navBoxLeft}px`;
    
    setTimeout(e => {
        scroll.style.transition = ".5s"
        navBox.style.transition = ".5s";
        download.style.transition = ".5s";
    });
})

window.onload = e => {
    scrollAlertAnimate();
}