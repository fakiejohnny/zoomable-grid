let tabClass = selectAll(".tab");
let contentClass = select(".content");
let controlsClass = select(".controls");

let row = 4;

let innerWidth = 0;
let innerHeight = 0;
let activeRow = row;
let mouseX = 0;
let mouseY = 0;
let scale = 0;
let translateX = 0;
let translateY = 0;
let activeTab = 0;

let zoomOutClass = select(".zoom-out");
let arrowLeftClass = select(".arrow-left");
let arrowUpClass = select(".arrow-up");
let arrowRightClass = select(".arrow-right");
let arrowDownClass = select(".arrow-down");

class Tab {
    constructor(nx, ny, tx, ty) {
        this.numberX = nx;
        this.numberY = ny;
        this.translateX = tx;
        this.translateY = ty;
    }
}

function setMousePosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

let tab = [];

zoomOutClass.addEventListener("mousedown", directZoomOut);
arrowLeftClass.addEventListener("mousedown", moveLeft);
arrowUpClass.addEventListener("mousedown", moveUp);
arrowRightClass.addEventListener("mousedown", moveRight);
arrowDownClass.addEventListener("mousedown", moveDown);

function resize() {
    innerWidth = window.innerWidth;
    innerHeight = window.innerHeight;

    activeRow = row;
    translateX = 0;
    translateY = 0;
    activeTab = 0;

    let nx = 0;
    let ny = 0;

    for (let i = 0; i < tabClass.length; i++) {
        tabClass[i].addEventListener("mousedown", () => {
            directZoom(i)
        });

        let tx = -nx * innerWidth;
        let ty = -ny * innerHeight;

        tab[i] = new Tab(nx, ny, tx, ty);

        if (nx < row - 1) {
            nx += 1;
        } else {
            nx = 0;
            ny += 1;
        }
    }

    contentClass.style.width = row * innerWidth + "px";
    contentClass.style.height = row * innerHeight + "px";
    transform();
}

function selectAll(elem) {
    return document.querySelectorAll(elem);
}

function select(elem) {
    return document.querySelector(elem);
}

function wheelScroll(e) {
    let richtung = (e.deltaY > 0) ? "down" : "up"; //(e.wheelDelta < 0) ? "down" : "up";
    zoom(richtung);
}

function transform() {
    if (activeRow === 1) {
        controlsClass.classList.add("controls-visible");
        contentClass.style.cursor = "auto";
    } else {
        controlsClass.classList.remove("controls-visible");
        contentClass.style.cursor = "default";
    }
    scale = 1 / activeRow;
    console.log(translateX + " " + translateY);
    contentClass.style.transform = "translate3d(" + translateX + "px, " + translateY + "px, 0px) scale(" + scale + ")";
}

function proofActiveTab() {
    for (let i = 0; i < tab.length; i++) {
        if (tab[i].translateX === translateX && tab[i].translateY === translateY) {
            activeTab = i;
        }
    }
}

function zoom(richtung) {

    if (richtung === "up" && activeRow > 1) {

        activeRow -= 1;

        /* x-Position */

        if (mouseX > innerWidth / 2) {
            translateX -= (innerWidth - translateX) / activeRow;
        } else {
            translateX += translateX / activeRow;
        }

        /* y-Position */

        if (mouseY > innerHeight / 2) {
            translateY -= (innerHeight - translateY) / activeRow;
        } else {
            translateY += translateY / activeRow;
        }

        /* active Tab */

        if (activeRow === 1) {
            proofActiveTab();
        }

    } else if (richtung === "down" && activeRow < row) {

        activeRow += 1;

        /* x-Position */

        if (mouseX < innerWidth / 2) {
            translateX += (innerWidth - translateX) / activeRow;
        } else {
            translateX -= translateX / activeRow;
        }

        if (translateX > 0) {
            translateX = 0;
        }
        if (translateX < (activeRow - row) * innerWidth / activeRow) { //better formula?
            translateX += innerWidth / activeRow;
        }

        /* y-Position */

        if (mouseY < innerHeight / 2) {
            translateY += (innerHeight - translateY) / activeRow;
        } else {
            translateY -= translateY / activeRow;
        }

        if (translateY > 0) {
            translateY = 0;
        }
        if (translateY < (activeRow - row) * innerHeight / activeRow) { //better formula?
            translateY += innerHeight / activeRow;
        }

    }

    transform();

}

function directZoom(i) {

    if (activeRow > 1) {

        activeRow = 1;

        translateX = -(tab[i].numberX * innerWidth);
        translateY = -(tab[i].numberY * innerHeight);

        proofActiveTab();

        transform();


    }

}

function directZoomOut() {

    if (activeRow < row) {

        activeRow = row;

        translateX = 0;
        translateY = 0;

        transform();

    }

}

function move() {
    translateX = tab[activeTab].translateX;
    translateY = tab[activeTab].translateY;
    activeRow = 1;
    transform();
}

function moveRight() {
    activeTab += 1;
    if (activeTab >= tab.length) {
        activeTab = 0;
    }
    move();
}

function moveLeft() {
    activeTab -= 1;
    if (activeTab < 0) {
        activeTab = tab.length - 1;
    }
    move();
}

function moveUp() {
    activeTab -= row;
    if (activeTab < 0) {
        activeTab += tab.length - 1;
    }
    move();
}

function moveDown() {
    activeTab += row;
    if (activeTab >= tab.length) {
        activeTab -= tab.length - 1;
    }
    move();
}

function keyDownHandler(e) {
    if (e.keyCode == 39) {
        moveRight();
    }
    if (e.keyCode == 37) {
        moveLeft();
    }
    if (e.keyCode == 38) {
        moveUp();
    }
    if (e.keyCode == 40) {
        moveDown();
    }
    if (e.keyCode == 27) {
        directZoomOut();
    }
    if (e.keyCode == 107) {
        zoom("up");
    }
    if (e.keyCode == 109) {
        zoom("down");
    }
    if (e.keyCode == 96) {
        directZoomOut();
    }
    if (e.keyCode == 13) {
        directZoom(0);
    }
}

resize();

document.addEventListener("mousemove", setMousePosition);
document.addEventListener("keydown", keyDownHandler);

window.addEventListener("wheel", wheelScroll);
window.addEventListener("resize", resize);