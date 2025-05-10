export { ToDo };
import { Checker } from "./checker.js";
import { Generator } from "./generator.js";

class ToDo {

    #id = null;
    #title = null;
    #description = null;
    #dueDate = null;
    #priority = null;
    #isChecked = null;
    #projectId = null;

    constructor(title, description, dueDate, priority, isChecked, projectId) {
        this.#id = Generator.generateId();
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isChecked = isChecked;
        this.#projectId = projectId;
    }

    get id() {
        return this.#id;
    }

    get title() {
        return this.#title;
    }

    get description() {
        return this.#description;
    }

    get dueDate() {
        return this.#dueDate;
    }

    get priority() {
        return this.#priority;
    }

    get isChecked() {
        return this.#isChecked;
    }

    get projectId() {
        return this.#projectId;
    }

    set id(newId) {
        this.#id = newId;
    }

    set title(newTitle) {
        Checker.assertValidString(newTitle);
        this.#title = newTitle;
    }

    set description(newDescription) {
        this.#description = newDescription;
    }

    set dueDate(newDueDate) {
        this.#dueDate = newDueDate;
    }

    set priority(newPriority) {
        this.#priority = newPriority;
    }

    set isChecked(newIsChecked) {
        this.#isChecked = newIsChecked.toString();
    }

    edit(title, description, dueDate, priority, isChecked) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.isChecked = isChecked;
    }
}
