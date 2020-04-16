const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");

const render = require("./lib/htmlRenderer");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

async function init() {
  const employeeArray = await createEmployeeList();
  const employeeClassArray = createEmployeeClass(employeeArray);
  const htmlData = render(employeeClassArray);
  renderHTML(htmlData);
}

async function createEmployeeList() {
  const teamArray = [];
  let addTeamMember = false;
  do {
    const { addMember: addMember } = await inquirer.prompt([
      {
        name: "addMember",
        type: "confirm",
        message: "Do you want to add a new member to your team list?",
      },
    ]);
    addTeamMember = addMember;
    if (addTeamMember) {
      const memberInfo = await inquirer.prompt([
        {
          name: "role",
          type: "list",
          message: "What role is this person in the team?",
          choices: ["Manager", "Engineer", "Intern"],
        },
        {
          name: "name",
          type: "input",
          message: "What is the team member's name?",
        },
        {
          name: "id",
          type: "input",
          message: "What is their staff ID number?",
        },
        {
          name: "email",
          type: "input",
          message: "What is their email address?",
        },
        {
          name: "officeNumber",
          type: "input",
          message: "What is the Manager's office phone number?",
          when: (answer) => answer.role === "Manager",
        },
        {
          name: "github",
          type: "input",
          message: "What is the Engineer's github handle?",
          when: (answer) => answer.role === "Engineer",
        },
        {
          name: "school",
          type: "input",
          message: "What school does the intern attend?",
          when: (answer) => answer.role === "Intern",
        },
      ]);

      teamArray.push(memberInfo);
      console.log("Thank you.");
    }
  } while (addTeamMember);

  console.log("Thank you. Your team board has completed building.");
  return teamArray;
}

function createEmployeeClass(teamArray) {
  return teamArray.map((member) => {
    if (member.role === "Manager") {
      const { name, id, email, officeNumber } = member;
      return new Manager(name, id, email, officeNumber);
    } else if (member.role === "Engineer") {
      const { name, id, email, github } = member;
      return new Engineer(name, id, email, github);
    } else if (member.role === "Intern") {
      const { name, id, email, school } = member;
      return new Intern(name, id, email, school);
    }
    console.log(teamArray);
  });
}

function renderHTML(htmlData) {
  fs.writeFileSync(outputPath, htmlData);
}

init();
