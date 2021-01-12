
const container = document.querySelector(".containerSim")
const SVGchildrenSpace = document.getElementById("childrenSpace")
const iterationsInModal = document.getElementById("modalIteration") 
const organisms = []
let popOver;
let runIterations;
let id = 0
// Global



fillMemory(100)
Module.onRuntimeInitialized = () => {
    runIterations = Module.cwrap("run", "number", ["number"])
}

class OrganismDOM {
    constructor(startX, startY, width, height) {
        this.id = id++;
        this.startX = startX
        this.startY = startY
        this.width = width
        this.height = height
        this.isSelected = false
        this.children = []
        this.init()
    }

    isTouched(x, y) {
        return this.startX <= x && this.startX + this.height >= x && this.startY <= y && this.startY + this.width >= y 
    }

    toggleDOMCol(color) {
        let currRow = container.childNodes[this.startX]
        let currCol = currRow.childNodes[this.startY]
        for (let i = this.startX; i < this.startX + this.height; i++) {
            for (let j = this.startY; j < this.startY + this.width; j++) {
                currCol.classList.toggle("marked" + color)
                currCol = currCol.nextSibling
            }
            currRow = currRow.nextSibling
            currCol = currRow.childNodes[this.startY]
        }
        console.log(`Marking area of organism start from (${this.startX}, ${this.startY}) 
        with width ${this.width} and height ${this.height}`)
    }

    select() {
        this.toggleDOMCol("Red")
        this.hookPopOver()
        this.selectChildrenDOM()
        this.isSelected = true
    }

    unselect() {
        this.toggleDOMCol("Red")
        this.clearPopOver()
        this.unselectChildrenDOM()
        this.isSelected = false
    }

    init() {
        this.toggleDOMCol("Blue")
    }

    displayInfo() {
        console.log(`.......`)
        return '.....'
    }

    getStartElement() {
        return container.childNodes[this.startX].childNodes[this.startY]
    }

    getCenterCoordinates() {
        return [this.startX + Math.floor(this.height / 2), this.startY + Math.floor(this.width / 2)]   
    }

    getCenterElement() {
        return container.childNodes[this.startX + Math.floor(this.height / 2)].childNodes[this.startY + Math.floor(this.width / 2)]
    }

    hookPopOver() {
        popOver = new bootstrap.Popover(this.getStartElement(), {
            content: this.displayInfo(), trigger: "manual", title: "Organism", placement: "left"
        })
        popOver.show()
    }

    clearPopOver() {
        if (popOver !== undefined){
            popOver.hide()
        } 
    }

    selectChildrenDOM() {
        for (let org of this.children) {
            connectOrganisms(this.getCenterCoordinates(), org.getCenterCoordinates())
        }
    }

    unselectChildrenDOM() {
        SVGchildrenSpace.textContent = ""
    }

    addChildren(org) {
        this.children.push(org)
    }
}

function connectOrganisms(coordinates1, coordinates2) {
    let line = document.createElementNS("http://www.w3.org/2000/svg", 'line');
    line.setAttribute("x1", (coordinates1[1]*20).toString())
    line.setAttribute("x2", (coordinates2[1]*20).toString())
    line.setAttribute("y1", (coordinates1[0]*20).toString())
    line.setAttribute("y2", (coordinates2[0]*20).toString())
    line.setAttribute("stroke", "#149c61")
    line.setAttribute("stroke-width", "2px")
    line.classList.add("line")
    SVGchildrenSpace.appendChild(line)
    console.log(`Connecting coordinates ${coordinates1} and ${coordinates2}`)
}


function fillMemory(numOfRow) {
    let row = document.createElement("div")
    let cell = document.createElement("div")
    cell.classList.add("cell")
    row.classList.add("row")

    for (let j = 0; j < numOfRow; j++) {
        cell.textContent = "."
        row.appendChild(cell)
        cell = cell.cloneNode()
    }

    for (let i = 0; i < numOfRow; i++) {
        row = row.cloneNode(true)
        container.appendChild(row)
    }

    // make svg space the same size
    SVGchildrenSpace.setAttribute("width", container.clientWidth) 
    SVGchildrenSpace.setAttribute("height", container.clientHeight) 

}


container.addEventListener("click", e => {
    let x, y;
    x = Math.floor(e.pageY / 20)
    y = Math.floor(e.pageX / 20)
    console.log(`Fixed click on [${x}, ${y}]`)
    for (organism of organisms) {
        if (organism.isTouched(x, y)) {
            organism.select()
        } else if (organism.isSelected){
            organism.unselect()
        }
    }
    // add warning when none touched
})

org1 = new OrganismDOM(5, 5, 6, 6)
org2 = new OrganismDOM(20, 20, 6, 6)
org1.addChildren(org2)
organisms.push(org1)
organisms.push(org2)

// int parent_id;
// int id;
// int startx;
// int starty;
// int width;
// int height;
// int ptrx;
// int ptry;
// int deltax;
// int deltay;
// int ax;
// int ay;
// int bx;
// int by;
// int cx;
// int cy;
// int dx;
// int dy;
// int stackx[8];
// int stacky[8];
// int stacktop;
// int errors;
// // reproduction
// int reproduction_cycle;
// // child
// int childx;
// int childy;
// int child_width;
// int child_height;
// int children;
function update(startX, startY, width, height) {
    console.log("added new one")
    organisms.push(new OrganismDOM(startX, startY, width, height))
}

function updateDOMOrganisms(id, startX, startY, width, height, ptrx, ptry, deltaX, deltaY,
    ax, ay, bx, by, cx, cy, dx, dy, stackX, stackY, stackTop, errors, reproduction_cycle, childeren) {
        

}


