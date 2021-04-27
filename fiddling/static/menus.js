class Menus {
    constructor(){
	this.stack = []
    }

    draw(){
	this.stack[this.stack.length-1].draw()
    }

    update(){
	this.stack[this.stack.length-1].update()
    }
}


class Menu {
    constructor(menus){
	this.menus = menus
    }
    exit(){
	this.menus.stack.pop()
    }
    enter(sub_menu){
	this.menus.stack.push(sub_menu)
    }
}
