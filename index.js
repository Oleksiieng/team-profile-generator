const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./src/page-template.js");

const teamMembers = [];
let currentId = 1;

const questions = {
    name: {
        type: 'input',
        name: 'name',
        message: "What is the team manager's name?",
        validate: (input) => input.trim() ? true : 'Name cannot be empty.',
    },
    email: {
        type: 'input',
        name: 'email',
        message: "What is the team manager's email?",
        validate: (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) ? true : 'Please enter a valid email.',
    },
    officeNumber: {
        type: 'input',
        name: 'officeNumber',
        message: "What is the team manager's office number?",
        validate: (input) => /^\d+$/.test(input) ? true : 'Please enter a valid office number (numbers only).',
    },
    github: {
        type: 'input',
        name: 'github',
        message: 'What is the engineer\'s GitHub username?',
        validate: (input) => input.trim() ? true : 'GitHub username cannot be empty.',
    },
    school: {
        type: 'input',
        name: 'school',
        message: 'What school does the intern attend?',
        validate: (input) => input.trim() ? true : 'School name cannot be empty.',
    },

};


function promptManager() {
    console.log("Please build your team");
    return inquirer.prompt([
        questions.name,
        questions.email,
        questions.officeNumber,
    ]).then(answers => {
        const manager = new Manager(currentId++, answers.name, answers.email, answers.officeNumber);
        teamMembers.push(manager);
        promptMenu();
    });
}

function promptEngineer() {
    return inquirer.prompt([
        questions.name,
        questions.email,
        questions.github,
    ]).then(answers => {
        const engineer = new Engineer(currentId++, answers.name, answers.email, answers.github);
        teamMembers.push(engineer);
        promptMenu();
    });
}

function promptIntern() {
    return inquirer.prompt([
        questions.name,
        questions.email,
        questions.school,
    ]).then(answers => {
        const intern = new Intern(currentId++, answers.name, answers.email, answers.school);
        teamMembers.push(intern);
        promptMenu();
    });
}

function promptMenu() {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do next?',
            choices: ['Add an engineer', 'Add an intern', 'Finish building the team']
        }
    ]).then(answers => {
        switch (answers.action) {
            case 'Add an engineer':
                promptEngineer();
                break;
            case 'Add an intern':
                promptIntern();
                break;
            case 'Finish building the team':
                buildTeam();
                break;
        }
    });
}

function buildTeam() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    
    fs.writeFileSync(outputPath, render(teamMembers), 'utf-8');
    console.log('Successfully created team.html in the output folder');
}

promptManager();
