export { Planner };
import { Project } from "./core/project.js";

class Planner {
    static #projects = [];

    static addProject(name) {
        const newProject = new Project(name);
        this.#projects.push(newProject);
        return newProject;
    }

    static getProject(searchId) {
        let targetProject = null;
        for (let project of this.#projects) {
            if (project.id === searchId) {
                targetProject = project;
                break;
            }
        }
        return targetProject;
    }

    static removeProject(searchId) {
        for (let i = this.#projects.length - 1; i >= 0; i--) {
            if (this.#projects[i].id === searchId) {
                this.#projects.splice(i, 1);
                break;
            }
        }
    }

    static getProjects() {
        return this.#projects;
    }

    static setProjects(projects) {
        this.#projects = projects;
    }

    static getRelatedToDos(projectId) {
        return this.getProject(projectId).toDos;
    }
}
