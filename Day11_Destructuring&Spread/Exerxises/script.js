import { countries } from "./countries.js"
const constants = [2.72, 3.14, 9.81, 37, 100]
const countries1 = ['Finland', 'Estonia', 'Sweden', 'Denmark', 'Norway']
const rectangle = {
    width: 20,
    height: 10,
    area: 200,
    perimeter: 60
}
const users = [
    {
        name: 'Brook',
        scores: 75,
        skills: ['HTM', 'CSS', 'JS'],
        age: 16
    },
    {
        name: 'Alex',
        scores: 80,
        skills: ['HTM', 'CSS', 'JS'],
        age: 18
    },
    {
        name: 'David',
        scores: 75,
        skills: ['HTM', 'CSS'],
        age: 22
    },
    {
        name: 'John',
        scores: 85,
        skills: ['HTML'],
        age: 25
    },
    {
        name: 'Sara',
        scores: 95,
        skills: ['HTM', 'CSS', 'JS'],
        age: 26
    },
    {
        name: 'Martha',
        scores: 80,
        skills: ['HTM', 'CSS', 'JS'],
        age: 18
    },
    {
        name: 'Thomas',
        scores: 90,
        skills: ['HTM', 'CSS', 'JS'],
        age: 20
    }
]

const [e, pi, gravity, humanBodyTemp, waterBoilingTemp] = constants;
console.log(e, pi, gravity, humanBodyTemp, waterBoilingTemp);

const [fin, est, sw, den, nor] = countries1;
console.log(fin, est, sw, den, nor);

const { width, height, area, perimeter } = rectangle;
console.log(width, height, area, perimeter);

// level2

users.forEach(({ name, scores, skills, age }) => {
    console.log(name, scores, skills, age);
})

let lessThanTwoSkills = users.filter(user => user.skills.length < 2);
console.log(lessThanTwoSkills);

// level 3

countries.forEach(({ name, capital, population, languages }) => {
    console.log(name, population, capital, languages);
});

const student = ['David', ['HTM', 'CSS', 'JS', 'React'], [98, 85, 90, 95]]

const [name, skills, [, , jsScore, reactScore]] = student;
console.log(name, skills, jsScore, reactScore);

const students = [
    ['David', ['HTM', 'CSS', 'JS', 'React'], [98, 85, 90, 95]],
    ['John', ['HTM', 'CSS', 'JS', 'React'], [85, 80, 85, 80]]
]

function convertArrayToObject(arr) {
    return arr.map(([name, skills, scores]) => ({
        name, skills, scores
    }))
}
console.log(convertArrayToObject(students));

const studentObj = {
    name: 'David',
    age: 25,
    skills: {
        frontEnd: [
            { skill: 'HTML', level: 10 },
            { skill: 'CSS', level: 8 },
            { skill: 'JS', level: 8 },
            { skill: 'React', level: 9 }
        ],
        backEnd: [
            { skill: 'Node', level: 7 },
            { skill: 'GraphQL', level: 8 },
        ],
        dataBase: [
            { skill: 'MongoDB', level: 7.5 },
        ],
        dataScience: ['Python', 'R', 'D3.js']
    }
}

const newStudent = {...studentObj,
    skills:{
        ...studentObj.skills,
        frontEnd:[
            ...studentObj.skills.frontEnd,
            {
                skills:'BootStrap',level:8
            }
        ],
        backEnd:[
            ...studentObj.skills.backEnd,
            {
                skills:'Express',level:9
            }
        ],
        dataBase:[
            ...studentObj.skills.dataBase,
            {
                skills:'SQL',level:8
            }
        ],
        dataScience:[
            ...studentObj.skills.dataScience,
            'SQL'
        ],
    }
}

console.log(newStudent);
