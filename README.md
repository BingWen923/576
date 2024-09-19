# MusicSchool

System Deployment Guide
1. get the code from github. The project includes both serverside and clientside code.
2. install mysql with root password 123456, or change the code in db.config.js
3. run serverside/DatabaseInitialize.sql to initialize the database
4. in directory music_school run "npm run build"
5. in directory serverside run "node server.js"
6. open the browser to go "localhost:3000" to start the application
