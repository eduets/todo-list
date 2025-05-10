export { StorageHandler };
import { Serializer } from "./core/serializer.js";
import { Project } from "./core/project.js";
import { ToDo } from "./core/to-do.js";

class StorageHandler {

    static #isStorageAvailable = false;
    static #storage = null;

    static {
        this.#initialize();
    }

    static #initialize() {
        try {
            const storageTest = '__storage_test__';
            localStorage.setItem(storageTest, storageTest);
            localStorage.removeItem(storageTest);
            this.#isStorageAvailable = true;
            this.#storage = localStorage;
        } catch (e) {
            this.#isStorageAvailable = false;
        }
    }

    static setItem(obj) {
        if (!this.#isStorageAvailable) {
            return;
        }
        const serializedObj = Serializer.serialize(obj);
        this.#storage.setItem(obj.id, serializedObj);
    }

    static getItem(key) {
        if (!this.#isStorageAvailable) {
            return;
        }
        const serializedObj = this.#storage.getItem(key);
        return Serializer.deserialize(serializedObj, key);
    }

    static getItems() {
        if (!this.#isStorageAvailable) {
            return;
        }
        const projects = [];
        const toDos = [];
        for (let i = 0; i < this.#storage.length; i++) {
            const key = this.#storage.key(i);
            const item = this.getItem(key);
            if (item instanceof Project) {
                projects.push(item);
            } else if (item instanceof ToDo) {
                toDos.push(item);
            }
        }
        toDos.forEach(toDo => {
            const project = projects.find(project => project.id === toDo.projectId);
            if (project) {
                project.pushToDo(toDo);
            }
        });
        return projects;
    }

    static clear() {
        if (!this.#isStorageAvailable) {
            return;
        }
        this.#storage.clear();
    }

    static removeItem(key) {
        if (!this.#isStorageAvailable) {
            return;
        }
        this.#storage.removeItem(key);
    }
}