﻿# MusicSchool
This is a course management system for the Irvine School of Music.

System Deployment Guide
1. get the code from github. The project includes both serverside and clientside code.
2. install mysql with root password 123456, or change the code in db.config.js
3. run serverside/DatabaseInitialize.sql to initialize the database
4. in directory music_school run "npm run build"
5. in directory serverside run "node server.js"
6. open the browser to go "localhost:3000" to start the application
7. If you need the system to automatically send weekly/monthly schedules via email to teachers and students,
    you can run the following command daily: 
        node serverside/auto_mailer/auto_email.js
    or schedule this command as a cron job or task scheduler process to run automatically on a daily basis.

It is necessary to notify in advance to initiate the deployment！！
AWS access:
    http://UOW.freeddns.org:3000

