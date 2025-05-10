export { Project };
import { Checker } from "./checker.js";
import { Generator } from "./generator.js";
import { ToDo } from "./to-do.js";

class Project {
    
    #id = null;
    #name = null;
    #toDos = [];

    constructor(name) {
        this.#id = Generator.generateId();
        this.name = name;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get toDos() {
        return this.#toDos;
    }

    set id(newId) {
        this.#id = newId;
    }

    set name(newName) {
        Checker.assertValidString(newName);
        this.#name = newName;
    }

    edit(name) {
        this.name = name
    }

    addToDo(title, description, dueDate, priority, isChecked) {
        const newToDo = new ToDo(title, description, dueDate, priority, isChecked, this.id);
        this.#toDos.push(newToDo);
        return newToDo;
    }

    pushToDo(toDo) {
        this.#toDos.push(toDo);
    }

    getToDo(searchId) {
        let targetToDo = null;
        for (let toDo of this.#toDos) {
            if (toDo.id === searchId) {
                targetToDo = toDo;
                break;
            }
        }
        return targetToDo;
    }

    removeToDo(searchId) {
        for (let i = this.#toDos.length - 1; i >= 0; i--) {
            if (this.#toDos[i].id === searchId) {
                this.#toDos.splice(i, 1);
                break;
            }
        }
    }
}
