const html = document.querySelector("html");
const mouse = {x: 0, y: 0, xD: 0, yD: 0, down: false, HDX: 0, HDY: 0, Hdown: false};
const scrollPageMax = 2;
const slideBtns = document.querySelectorAll(".slide-button .btn");
const slideItem = document.querySelector("#event-list");
let scrollPage = 0;
let scrollPageRe = 0;
let checkSlide = 0;
let scrollAnimate = false;
let slidePage = 0;
let slideLeft = 0;
let slidePageItems = 4;
let slideMax = 0;
let slideAnimate = false;
let wheelDown;

const scrollMove = e => {
    scrollAnimate = true;

    if(scrollPage < 0) scrollPage = 0;
    if(scrollPage > scrollPageMax) scrollPage = scrollPageMax;
    if(scrollPage !== scrollPageRe) {
        scrollPageRe = scrollPage;

        let scrollFrom = html.scrollTop;
        let scrollTo = 0;
        let scrollSpeed = 0;

        if(scrollPage === scrollPageMax) {
            if(window.innerWidth > 480 && window.innerHeight > 800) {
                scrollTo = window.innerHeight * (scrollPage) - (window.innerHeight - 800);
            }else if(window.innerWidth <= 480 && window.innerHeight > 355) {
                scrollTo = window.innerHeight * (scrollPage) - (window.innerHeight - 355);
            }else {
                scrollTo = window.innerHeight * scrollPage;
            }
        }else {
            scrollTo = window.innerHeight * scrollPage;
        }

        scrollSpeed = - (scrollFrom - scrollTo) / (1500/8);
        let oldScroll = html.scrollTop;
        let scrollInterval = setInterval(e => {
            let speed = scrollSpeed;
            let to = 0;
            let score = (html.scrollTop - scrollTo) / (scrollFrom - scrollTo);
            speed = Math.round(speed * ((score + 0.1) * 7));
            to = html.scrollTop + speed;
            if(to > scrollTo && scrollTo > scrollFrom) to = scrollTo;
            if(to < scrollTo && scrollTo < scrollFrom) to = scrollTo;
            html.scrollTop = to;
            if(to === scrollTo) {
                scrollAnimate = false;
                clearInterval(scrollInterval);
            }
            if(oldScroll !== html.scrollTop) {
                oldScroll = html.scrollTop;
            }else {
                scrollAnimate = false;
                clearInterval(scrollInterval);
            }
        },8);
    }else {
        scrollAnimate = false;
    }
}

const getIdx = e => {
    let result = -1;
    for(let i = 0; i < e.parentNode.children.length; i++) {
        const el = e.parentNode.children[i];
        if(el === e) result = i;
    }
    return result;
}

const scrollLock = e => {
    const keys = {"arrowup": 1, "pageup": 1, "arrowdown": 1, "pagedown": 1, "arrowleft": 1, "arrowright": 1};
    const preventDefault = e => {
        e.preventDefault();
    }
    
    const preventDefaultForScrollKeys = e => {
        const keyC = e.key.toLocaleLowerCase();
    
        if (keys[keyC]) {
            preventDefault(e);
            return false;
        }
    }
    
    let supportsPassive = false;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () { supportsPassive = true; } 
        }));
    } catch(e) {}
    
    const wheelOpt = supportsPassive ? { passive: false } : false;
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.addEventListener(wheelEvent, preventDefault, wheelOpt);
    window.addEventListener('touchmove', preventDefault, wheelOpt);
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

const init = e => {
    scrollLock();
    setTimeout(e => {
        html.scrollTop = 0;
    }, 0);
    
    if(window.innerWidth <= 720) {
        slideMax = 3;
        slidePageItems = 1;
    }else if(window.innerWidth <= 1100) {
        slideMax = 2;
        slidePageItems = 2;
    }else if(window.innerWidth <= 1550) {
        slideMax = 1;
        slidePageItems = 3;
    }else {
        slideMax = 0;
        slidePageItems = 4;
    }
}

document.addEventListener("wheel", e => {
    if(!scrollAnimate) {
        if(e.wheelDelta < 0) scrollPage++;
        else scrollPage--;
        
        scrollMove();
    }
})

window.addEventListener("resize", e => {
    let scrollTo = 0;

    if(scrollPage === scrollPageMax) {
        if(window.innerWidth > 480 && window.innerHeight > 800) {
            scrollTo = window.innerHeight * (scrollPage) - (window.innerHeight - 800);
        }else if(window.innerWidth <= 480 && window.innerHeight > 355) {
            scrollTo = window.innerHeight * (scrollPage) - (window.innerHeight - 355);
        }else {
            scrollTo = window.innerHeight * scrollPage;
        }
    }else {
        scrollTo = window.innerHeight * scrollPage;
    }

    html.scrollTop = scrollTo;
    
    if(window.innerWidth <= 720) {
        slideMax = 3;
        slidePageItems = 1;
    }else if(window.innerWidth <= 1100) {
        slideMax = 2;
        slidePageItems = 2;
    }else if(window.innerWidth <= 1550) {
        slideMax = 1;
        slidePageItems = 3;
    }else {
        slideMax = 0;
        slidePageItems = 4;
    }

    slideItem.style.transition = "0s";
    slideItem.style.left = `${- (slidePage * (window.innerWidth / slidePageItems))}px`;
})

document.addEventListener("touchstart", e => {
    mouse.xD = e.changedTouches[0].pageX;
    mouse.yD = e.changedTouches[0].pageY;
    mouse.x = e.changedTouches[0].pageX;
    mouse.y = e.changedTouches[0].pageY;
    mouse.down = true;
    slideItem.style.transition = "0s";
})

document.addEventListener("touchmove", e => {
    if(mouse.down) {
        mouse.x = e.changedTouches[0].pageX;
        mouse.y = e.changedTouches[0].pageY;
        if(scrollPage === 1) {
            let left = mouse.x - mouse.xD - (slidePage * (window.innerWidth / slidePageItems));
            if(left > 0) left = 0;
            if(left < - ((window.innerWidth / slidePageItems) * slideMax)) left = - ((window.innerWidth / slidePageItems) * slideMax);
            slideBtns.forEach(e => e.classList.remove("active"));
            slideBtns[- Math.round(left / (window.innerWidth / slidePageItems))].classList.add("active");
            slideItem.style.left = `${left}px`;
        }
    }
})

document.addEventListener("touchend", e => {
    mouse.down = false;
    mouse.x = e.changedTouches[0].pageX;
    mouse.y = e.changedTouches[0].pageY;
    if(Math.abs(mouse.x - mouse.xD) < Math.abs(mouse.y - mouse.yD) || scrollPage !== 1) {
        if(!scrollAnimate) {
            if(mouse.yD < mouse.y) scrollPage--;
            if(mouse.yD > mouse.y) scrollPage++;
            scrollMove();
        }
    }
    slideItem.style.transition = ".2s";
    slidePage = - Math.round(slideItem.style.left.replaceAll("px", "") / (window.innerWidth / slidePageItems));
    slideItem.style.left = `${- (slidePage * (window.innerWidth / slidePageItems))}px`;
})


document.addEventListener("mousedown", e => {
    e.preventDefault();
    if(e.button === 0) {
        mouse.xD = e.clientX;
        mouse.yD = e.clientY;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.down = true;
        slideItem.style.transition = "0s";
    }
    if(e.button === 1) {
        mouse.HDX = e.clientX;
        mouse.HDY = e.clientY;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.Hdown = true;
        wheelDown = setInterval(e => {
            if(!scrollAnimate && mouse.Hdown) {
                if(mouse.HDY + 50 > mouse.y) scrollPage--;
                if(mouse.HDY - 50 < mouse.y) scrollPage++;
                scrollMove();
            }
        },0);
     }
})

document.addEventListener("mousemove", e => {
    if(mouse.down) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if(scrollPage === 1) {
            let left = mouse.x - mouse.xD - (slidePage * (window.innerWidth / slidePageItems));
            if(left > 0) left = 0;
            if(left < - ((window.innerWidth / slidePageItems) * slideMax)) left = - ((window.innerWidth / slidePageItems) * slideMax);
            slideBtns.forEach(e => e.classList.remove("active"));
            slideBtns[- Math.round(left / (window.innerWidth / slidePageItems))].classList.add("active");
            slideItem.style.left = `${left}px`;
        }
    }
    if(mouse.Hdown) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }
})

document.addEventListener("mouseup", e => {
    if(e.button === 0) {
        mouse.down = false;
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        if(Math.abs(mouse.x - mouse.xD) < Math.abs(mouse.y - mouse.yD) || scrollPage !== 1) {
            if(!scrollAnimate) {
                if(mouse.yD < mouse.y) scrollPage--;
                if(mouse.yD > mouse.y) scrollPage++;
                scrollMove();
            }
        }
        slideItem.style.transition = ".2s";
        slidePage = - Math.round(slideItem.style.left.replaceAll("px", "") / (window.innerWidth / slidePageItems));
        slideItem.style.left = `${- (slidePage * (window.innerWidth / slidePageItems))}px`;
    }
    if(e.button === 1) {
        mouse.Hdown = false;
        clearInterval(wheelDown);
    }
})

document.addEventListener("keydown", e => {
    const keyC = e.key.toLocaleLowerCase();

    if(!scrollAnimate) {
        if(keyC === "arrowup" || keyC === "pageup") {
            scrollPage--;
            scrollMove();
        }
        if(keyC === "arrowdown" || keyC === "pagedown") {
            scrollPage++;
            scrollMove();
        }
        if(!slideAnimate && scrollPage === 1) {
            let oSlidePage = slidePage;
            if(keyC === "arrowright") {
                slidePage++;
                if(slidePage > slideMax) slidePage = slideMax;
                if(oSlidePage !== slidePage) {
                    slideBtns.forEach(e => e.classList.remove("active"));
                    slideBtns[slidePage].classList.add("active");
                    slideItem.style.transition = ".45s";
                    slideItem.style.left = `${- (slidePage * (window.innerWidth / slidePageItems))}px`;
                    slideAnimate = true;
                    setTimeout(e => {slideAnimate = false}, 500);
                }
            }
            if(keyC === "arrowleft") {
                slidePage--;
                if(slidePage < 0) slidePage = 0;
                if(oSlidePage !== slidePage) {
                    slideBtns.forEach(e => e.classList.remove("active"));
                    slideBtns[slidePage].classList.add("active");
                    slideItem.style.transition = ".45s";
                    slideItem.style.left = `${- (slidePage * (window.innerWidth / slidePageItems))}px`;
                    slideAnimate = true;
                    setTimeout(e => {slideAnimate = false}, 500);
                }
            }
        }
    }
})

slideBtns.forEach(i => i.addEventListener("click", e => {
    if(!slideAnimate) {
        let oSlidePage = slidePage;
        slidePage = getIdx(e.target);
        if(oSlidePage !== slidePage) {
            slideBtns.forEach(e => e.classList.remove("active"));
            slideBtns[slidePage].classList.add("active");
            slideItem.style.transition = ".45s";
            setTimeout(e => {
                slideItem.style.left = `${- (slidePage * (window.innerWidth / slidePageItems))}px`;
                slideAnimate = true;
            }, 0)
            setTimeout(e => {slideAnimate = false}, 500);
        }
    }
}))

window.onload = e => {
    init();
}