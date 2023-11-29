"use strict";
class Human {
    constructor(firstName, lastName, age) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
    }
    displayInfo() {
        console.log("Name: " + this.firstName + " " + this.lastName + ", Age: " + this.age);
    }
}
const person1 = new Human("Marta", "Kowalska", 25);
person1.displayInfo();
const person2 = {
    firstName: "Krzysztof",
    lastName: "Nowak",
    age: 30,
};
const displayInfo = (person) => {
    console.log("Name: " + person.firstName + " " + person.lastName + ", Age: " + person.age);
};
displayInfo(person2);
