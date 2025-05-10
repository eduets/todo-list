export { Main };
import { Planner } from "./planner.js";
import { Priority } from "./core/priority.js";
import { DOMHandler } from "./dom-handler.js";
import { StorageHandler } from "./storage-handler.js";

class Main {
    static #STR_DEFAULT_PROJECT = "Default Project";

    static #currentProject = null;

    static {
        this.#initialize();
    }

    static #initialize() {
        this.#loadProjectsFromStorage();
        DOMHandler.initialize(this);
        DOMHandler.displayData(Planner.getProjects());
        DOMHandler.selectFirstProject();
        DOMHandler.displayToDos(this.#currentProject);
    }

    static #loadProjectsFromStorage() {
        Planner.setProjects(StorageHandler.getItems());
        this.#checkProjectsInitialState();
    }

    static #checkProjectsInitialState() {
        if (Planner.getProjects().length === 0) {
            const project01 = Planner.addProject(this.#STR_DEFAULT_PROJECT + " 01");
            StorageHandler.setItem(project01);
            const toDo01 = project01.addToDo(
                "Some task",
                "Super description",
                "2025-05-10",
                Priority.LOW,
                "false");
            StorageHandler.setItem(toDo01);
        }
    }

    static addProject(name) {
        const project = Planner.addProject(name);
        StorageHandler.setItem(project);
        return project;
    }

    static removeProject(searchId) {
        // Remove related ToDos
        const toDos = Planner.getRelatedToDos(searchId);
        for (const toDo of toDos) {
            StorageHandler.removeItem(toDo.id);
        }
        // Remove project
        Planner.removeProject(searchId);
        StorageHandler.removeItem(searchId);
        const currentProjectId = DOMHandler.getCurrentProjectId();
        if (currentProjectId === null) {
            DOMHandler.selectFirstProject();
            DOMHandler.displayToDos(this.#currentProject);
        }
    }

    static removeToDo(searchId) {
        Planner.getProject(this.#currentProject.id).removeToDo(searchId);
        StorageHandler.removeItem(searchId);
    }

    static updateCurrentProject() {
        this.#currentProject = null;
        const currentProjectId = DOMHandler.getCurrentProjectId();
        if (currentProjectId !== null) {
            this.#currentProject = Planner.getProject(currentProjectId);
        }
    }

    static checkEdit(searchId, checkState) {
        const toDo = Planner.getProject(this.#currentProject.id).getToDo(searchId);
        toDo.isChecked = checkState.toString();
        StorageHandler.setItem(toDo);
    }

    static addToDo(title, description, dueDate, priority, isChecked) {
        const toDo = this.#currentProject.addToDo(title, description, dueDate, priority, isChecked);
        StorageHandler.setItem(toDo);
        return toDo;
    }

    static editToDo(searchId, title, description, dueDate, priority, isChecked) {
        const toDo = this.#currentProject.getToDo(searchId);
        toDo.edit(title, description, dueDate, priority, isChecked);
        StorageHandler.setItem(toDo);
        return toDo;
    }
}
