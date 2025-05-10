export { Serializer };
import { Project } from "./project.js";
import { ToDo } from "./to-do.js";

class Serializer {
    static #STR_ID = 'id';
    static #STR_CLASS = 'class';
    static #STR_CLASS_REF = 'classRef';

    static #CLASS_REGISTRY = {
        ToDo: {
          classRef: ToDo,
          paramOrder: ['title', 'description', 'dueDate', 'priority', 'isChecked', 'projectId']
        },
        Project: {
          classRef: Project,
          paramOrder: ['name']
        }
    };

    static serialize(obj) {
        const gettersResult = this.#getNonArrayGetterValues(obj);
        gettersResult[this.#STR_CLASS] = obj.constructor.name;
        const stringResult = JSON.stringify(gettersResult);
        return stringResult;
    }

    static deserialize(strng, key) {
        const jsonResult = JSON.parse(strng);
        const instance = this.#createInstanceFromJson(jsonResult);
        instance.id = key;
        return instance;
    }

    static #getNonArrayGetterValues(obj) {
        const proto = Object.getPrototypeOf(obj);
        const descriptors = Object.getOwnPropertyDescriptors(proto);
        const result = {};
        for (const [key, descriptor] of Object.entries(descriptors)) {
            if (key === this.#STR_ID) {
                continue;
            }
            if (typeof descriptor.get === 'function') {
                const value = obj[key];
                if (!Array.isArray(value)) {
                    result[key] = value;
                }
            }
        }
        return result;
    }

    static #createInstanceFromJson(data) {
        const className = data[this.#STR_CLASS];
        const registryEntry = this.#CLASS_REGISTRY[className];
        if (!registryEntry) {
          throw new Error(`Unregistered class: ${className}`);
        }
        const args = registryEntry.paramOrder.map(key => data[key]);
        return new registryEntry[this.#STR_CLASS_REF](...args);
    }
}