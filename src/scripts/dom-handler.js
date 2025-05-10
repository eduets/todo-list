export { DOMHandler };
import { Priority } from "./core/priority.js";
import projectItem from "../html/project-item.html";
import mainPanelHeader from "../html/main-panel-header.html";
import toDoItem from "../html/to-do-item.html";
import sidePanelContent from "../html/side-panel-content.html";

class DOMHandler {
    
    static #mainController;
    static #sidebarContent;
    static #projectForm;
    static #projectTemplate;
    static #projectAddButton;
    static #projectAddName;
    static #mainPanel;
    static #mainPanelHeaderTemplate;
    static #toDoTemplate;
    static #sidePanelContentTemplate;
    static #sidePanel;

    static initialize(mainController) {
        this.#mainController = mainController;
        this.#sidebarContent = document.querySelector('.sidebar-content');
        this.#projectForm = document.querySelector('.project-form');
        this.#projectAddButton = document.querySelector('#add-project-button');
        this.#projectAddName = document.querySelector('#project-form-name');
        this.#projectTemplate = this.#createFromTemplate(projectItem);
        this.#mainPanel = document.querySelector('.main-panel');
        this.#mainPanelHeaderTemplate = this.#createFromTemplate(mainPanelHeader);
        this.#toDoTemplate = this.#createFromTemplate(toDoItem);
        this.#sidePanelContentTemplate = this.#createFromTemplate(sidePanelContent);
        this.#sidePanel = document.querySelector('.side-panel');
        this.#initializeProjectForm();
    }

    static displayData(projects) {
        this.#loadSidebar(projects);
    }

    static selectFirstProject() {
        this.#deselectProjects();
        if (this.#sidebarContent.children.length > 0) {
            this.#sidebarContent.children[0].classList.add('project-selected');
            this.#mainController.updateCurrentProject();
        }
    }

    static getCurrentProjectId() {
        let currentProjectId = null;
        for (const projectElement of this.#sidebarContent.children) {
            if (projectElement.classList.contains('project-selected')) {
                currentProjectId = projectElement.getAttribute('data-id');
            }
        }
        return currentProjectId;
    }

    static clearTodos() {
        this.#mainPanel.innerHTML = "";
    }

    static clearSidePanel() {
        this.#sidePanel.innerHTML = "";
    }

    static #fillPrioritySelect(select) {
        Object.entries(Priority).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = key.charAt(0) + key.slice(1).toLowerCase();
            select.appendChild(option);
            select.value = Priority.MEDIUM;
        });
    }

    static displayToDos(project) {
        this.clearTodos();
        this.clearSidePanel();
        if (project === null) {
            return;
        }

        const mainPanelElement = this.#mainPanelHeaderTemplate.cloneNode(true).firstElementChild;
        mainPanelElement.querySelector('.main-panel-project-name').textContent = project.name + " to-dos";
        this.#mainPanel.appendChild(mainPanelElement);

        const mainPanelContentElement = document.createElement('div');
        mainPanelContentElement.classList.add('main-panel-content');
        this.#mainPanel.appendChild(mainPanelContentElement);

        mainPanelElement.querySelector('#add-todo-button').addEventListener('click', (event) => {
            this.clearSidePanel();
            const sidePanelContentElement = this.#sidePanelContentTemplate.cloneNode(true).firstElementChild;
            this.#fillPrioritySelect(sidePanelContentElement.querySelector('#to-do-priority'));

            const today = new Date().toISOString().split('T')[0];
            sidePanelContentElement.querySelector('#to-do-due-date').value = today;
            
            sidePanelContentElement.querySelector('.cancel-button').addEventListener('click', (event) => {
                this.clearSidePanel();
            });
            sidePanelContentElement.querySelector('.confirm-button').addEventListener('click', (event) => {
                if (!sidePanelContentElement.checkValidity()) {
                    return;
                }
                event.preventDefault();
                
                const toDo = this.#mainController.addToDo(
                    sidePanelContentElement.querySelector('#to-do-title').value,
                    sidePanelContentElement.querySelector('#to-do-description').value,
                    sidePanelContentElement.querySelector('#to-do-due-date').value,
                    sidePanelContentElement.querySelector('#to-do-priority').value,
                    sidePanelContentElement.querySelector('#to-do-is-checked').checked.toString()
                );
                this.clearSidePanel();
                this.#displayToDo(toDo, document.querySelector('.main-panel-content'));
            });

            this.#sidePanel.appendChild(sidePanelContentElement);
            sidePanelContentElement.querySelector('#to-do-title').focus();
        });

        project.toDos.sort((a, b) => {
            const timeA = parseInt(a.id.split('-')[0], 10);
            const timeB = parseInt(b.id.split('-')[0], 10);
            return timeA - timeB;
        });
        for (const toDo of project.toDos) {
            this.#displayToDo(toDo, mainPanelContentElement);
        }
    }

    static #displayToDo(toDo, mainPanelContentElement) {
        const toDoElement = this.#toDoTemplate.cloneNode(true).firstElementChild;
        toDoElement.setAttribute('data-id', toDo.id);
        toDoElement.classList.add('priority-' + toDo.priority);
        toDoElement.querySelector('.preview-title').textContent = toDo.title;
        toDoElement.querySelector('.preview-due-date').textContent = toDo.dueDate;
        const previewCheckbox = toDoElement.querySelector('.preview-checkbox');
        if (toDo.isChecked === 'true') {
            previewCheckbox.checked = true;
        } else {
            previewCheckbox.checked = false;
        }
        mainPanelContentElement.insertBefore(toDoElement, mainPanelContentElement.firstChild);
        toDoElement.querySelector('.preview-checkbox').addEventListener('change', (event) => {
            this.#mainController.checkEdit(toDoElement.getAttribute('data-id'), previewCheckbox.checked);
        });
        toDoElement.querySelector('.inspect-button').addEventListener('click', (event) => {
            this.clearSidePanel();
            const sidePanelContentElement = this.#sidePanelContentTemplate.cloneNode(true).firstElementChild;
            this.#fillPrioritySelect(sidePanelContentElement.querySelector('#to-do-priority'));

            sidePanelContentElement.setAttribute('data-id', toDo.id)
            sidePanelContentElement.querySelector('#to-do-title').value = toDo.title;
            sidePanelContentElement.querySelector('#to-do-description').value = toDo.description;
            sidePanelContentElement.querySelector('#to-do-due-date').value = toDo.dueDate;
            sidePanelContentElement.querySelector('#to-do-priority').value = toDo.priority;
            sidePanelContentElement.querySelector('#to-do-is-checked').checked = toDo.isChecked === "true" ? true : false;
            
            sidePanelContentElement.querySelector('.cancel-button').addEventListener('click', (event) => {
                this.clearSidePanel();
            });
            sidePanelContentElement.querySelector('.confirm-button').addEventListener('click', (event) => {
                if (!sidePanelContentElement.checkValidity()) {
                    return;
                }
                event.preventDefault();
                
                this.#mainController.editToDo(
                    toDo.id,
                    sidePanelContentElement.querySelector('#to-do-title').value,
                    sidePanelContentElement.querySelector('#to-do-description').value,
                    sidePanelContentElement.querySelector('#to-do-due-date').value,
                    sidePanelContentElement.querySelector('#to-do-priority').value,
                    sidePanelContentElement.querySelector('#to-do-is-checked').checked.toString()
                );
                this.clearSidePanel();
                this.#updateToDo(toDo, toDoElement);
            });

            this.#sidePanel.appendChild(sidePanelContentElement);
        });
        toDoElement.querySelector('.remove-button').addEventListener('click', (event) => {
            toDoElement.parentElement.removeChild(toDoElement);
            this.#mainController.removeToDo(toDoElement.getAttribute('data-id'));
            const sidePanelContent = this.#getSidePanelContent();
            if (sidePanelContent !== null) {
                if (sidePanelContent.getAttribute('data-id') === toDo.id) {
                    this.clearSidePanel();
                }
            }
        });
    }

    static #getSidePanelContent() {
        return document.querySelector('.side-panel-content');
    }

    static #updateToDo(toDo, toDoElement) {
        toDoElement.querySelector('.preview-title').textContent = toDo.title;
        toDoElement.querySelector('.preview-due-date').textContent = toDo.dueDate;
        toDoElement.querySelector('.preview-checkbox').checked = toDo.isChecked === 'true' ? true : false;
        toDoElement.classList.remove('priority-low');
        toDoElement.classList.remove('priority-medium');
        toDoElement.classList.remove('priority-high');
        toDoElement.classList.add('priority-' + toDo.priority);
    }

    static #enableProjectForm(enable) {
        if (enable) {
            this.#projectForm.style.display = 'grid';
            this.#projectAddButton.style.visibility = 'hidden';
            this.#projectAddName.focus();
        } else {
            this.#projectForm.reset();
            this.#projectForm.style.display = 'none';
            this.#projectAddButton.style.visibility = 'visible';
        }
    }

    static #initializeProjectForm() {
        const projectFormCancelButton = this.#projectForm.querySelector('button[type="button"]');
        const projectFormConfirmButton = this.#projectForm.querySelector('button[type="submit"]');

        this.#projectAddButton.addEventListener('click', (event) => {
            this.#enableProjectForm(true);
        });

        projectFormCancelButton.addEventListener('click', (event) => {
            this.#enableProjectForm(false);
        });

        projectFormConfirmButton.addEventListener('click', (event) => {
            if (!this.#projectForm.checkValidity()) {
                return;
            }
            event.preventDefault();
            const projectFormNameInput = this.#projectForm.querySelector('input[name="projectName"]');
            const project = this.#mainController.addProject(projectFormNameInput.value);
            this.#enableProjectForm(false);
            this.#addToSidebar(project);
        });
    }

    static #createFromTemplate(importedTemplate) {
        const template = document.createElement('template');
        template.innerHTML = importedTemplate.trim();
        return template.content;
    }

    static #deselectProjects() {
        for (const projectElement of this.#sidebarContent.children) {
            projectElement.classList.remove('project-selected');
        }
    }

    static #addToSidebar(project) {
        const projectElement = this.#projectTemplate.cloneNode(true).firstElementChild;
        projectElement.querySelector('.project-name').textContent = project.name;
        projectElement.setAttribute('data-id', project.id);
        this.#sidebarContent.insertBefore(projectElement, this.#sidebarContent.firstChild);
        const removeProjectButton = projectElement.querySelector('button.project-remove');
        removeProjectButton.addEventListener('click', (event) => {
            event.stopPropagation();
            projectElement.parentElement.removeChild(projectElement);
            this.#mainController.removeProject(projectElement.getAttribute('data-id'));
        });
        projectElement.addEventListener('click', (event) => {
            this.#deselectProjects();
            projectElement.classList.add('project-selected');
            this.#mainController.updateCurrentProject();
            this.displayToDos(project);
        });
    }

    static #loadSidebar(projects) {
        projects.sort((a, b) => {
            const timeA = parseInt(a.id.split('-')[0], 10);
            const timeB = parseInt(b.id.split('-')[0], 10);
            return timeA - timeB;
        });
        for (const project of projects) {
            this.#addToSidebar(project);
        }
    }
}