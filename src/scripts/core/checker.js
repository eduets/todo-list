export { Checker };

class Checker {
    static assertValidString(strng) {
        if ((!(typeof strng === 'string') && !(strng instanceof String)) || strng === "") {
            throw Error("Invalid string");
        }
    }
}