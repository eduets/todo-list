export { Generator };

class Generator {
    static generateId() {
        return Date.now().toString() + "-" + crypto.randomUUID();
    }
}