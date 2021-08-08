import './styles/style.scss';

interface Employee {
    uniqueId: number;
    name: string;
    suboridnates: Employee[]
}

interface IEmployeeOrgApp {
    ceo: Employee;

    undo(): void;

    redo(): void
}

interface Move {
    previousOldSupervisorList: Employee[]
    previousNewSupervisorList: Employee[]
}

class EmployeeOrgApp implements IEmployeeOrgApp {

    ceo: Employee
    lastMove: Move | undefined
    lastUndo: Move | undefined
    lastNewSupervisor: Employee | undefined
    lastOldSupervisor: Employee | undefined

    constructor(ceo: Employee){
        this.ceo = ceo
    }

    undo(): void {

        this.lastUndo = {
            previousNewSupervisorList: [...this.lastNewSupervisor.suboridnates],
            previousOldSupervisorList: [...this.lastOldSupervisor.suboridnates]
        }

        this.lastNewSupervisor.suboridnates = this.lastMove.previousNewSupervisorList
        this.lastOldSupervisor.suboridnates = this.lastMove.previousOldSupervisorList
    }

    redo(): void {

        this.lastNewSupervisor.suboridnates = this.lastUndo.previousNewSupervisorList
        this.lastOldSupervisor.suboridnates = this.lastUndo.previousOldSupervisorList
    }

    move(employee: Employee, newSupervisor: Employee, oldSupervisor: Employee): void {

        //remember last lists
        this.lastMove = {
            previousOldSupervisorList: [...oldSupervisor.suboridnates],
            previousNewSupervisorList: [...newSupervisor.suboridnates]
        }
        this.lastNewSupervisor = newSupervisor
        this.lastOldSupervisor = oldSupervisor

        for(let i = 0; i < oldSupervisor.suboridnates.length; i++){
            //remove from previous list
            if(employee.uniqueId == oldSupervisor.suboridnates[i].uniqueId){
                oldSupervisor.suboridnates.splice(i, 1)
            }
        }

        //add to new list
        newSupervisor.suboridnates.push(employee)
    }
}

//example of moving Bob to Cassandra as a suboridnate

let will: Employee = {
    uniqueId: 9,
    name: 'Will Turner',
    suboridnates: []
}

let tina: Employee = {
    uniqueId: 8,
    name: 'Tina Teff',
    suboridnates: [will]
}

let mary: Employee = {
    uniqueId: 7,
    name: 'Mary Blue',
    suboridnates: []
}

let bob: Employee = {
    uniqueId: 6,
    name: 'Bob Saget',
    suboridnates: [tina]
}

let cassandra: Employee = {
    uniqueId: 5,
    name: 'Cassandra Reynolds',
    suboridnates: [mary, bob]
}

let sarah: Employee = {
    uniqueId: 4,
    name: 'Sarah Donald',
    suboridnates: [cassandra]
}

let sophie: Employee = {
    uniqueId: 3,
    name: 'Sophie Turner',
    suboridnates: []
}

let georgina: Employee = {
    uniqueId: 2,
    name: 'Georgina Flangy',
    suboridnates: [sophie]
}

const ceo: Employee = {
    uniqueId: 1,
    name: 'Mark Zuckerberg',
    suboridnates: [sarah, georgina]
}

const app = new EmployeeOrgApp(ceo)

app.move(bob, georgina, cassandra)
app.undo()
app.redo()
app.undo()
app.redo()
console.log(georgina, cassandra)
