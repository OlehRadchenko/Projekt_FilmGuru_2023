interface Person {
    firstName: string;
    lastName: string;
    age: number;
}

class Human implements Person {
    constructor(public firstName: string, public lastName: string, public age: number) { }

    public displayInfo(): void {
        console.log("Name: " + this.firstName + " " + this.lastName + ", Age: " + this.age);
    }
}

const person1 = new Human("Marta", "Kowalska", 25);
person1.displayInfo();

const person2: Person = {
    firstName: "Krzysztof",
    lastName: "Nowak",
    age: 30,
};
const displayInfo = (person: Person) => {
    console.log("Name: " + person.firstName + " " + person.lastName + ", Age: " + person.age);
};
displayInfo(person2);