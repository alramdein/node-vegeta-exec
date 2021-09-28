require("dotenv").config();
const { exec } = require("child_process");
const fs = require("fs");

const endpoints = fs.readFileSync(process.env.FILE_NAME).toString().split("\n");
let i = 0;

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const execVegetaCommand = (enpoints, index = 0) => {
  exec(
    `echo "GET ${process.env.HOST}${enpoints[index]}" | vegeta attack -header "authorization: Bearer ${process.env.TOKEN}" -duration=${process.env.DURATION} -rate=${process.env.RATE} | vegeta report --type=text`,
    async (error, stdout, stderr) => {
      console.log(`Endpoint-${i}`);
      console.log(`URL: ${process.env.HOST}${endpoints[index]}`);
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);

      i += 1;
      if (i > endpoints.length) return;
      await sleep(5000);
      execVegetaCommand(endpoints, i);
    }
  );
};

/* to make sure you're on the host that you intended */
console.log(process.env.HOST);
console.log("enpoints: ");
console.log(endpoints);
execVegetaCommand(endpoints);
