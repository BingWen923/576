const db = require("../app/models/db");
require('dotenv').config();
const nodemailer = require('nodemailer');

// get the next monday from today
function getNextMonday() {
  const today = new Date();
  const nextMonday = new Date(today);
  
  // Get the current day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
  const currentDay = today.getDay();
  
  // Calculate how many days to add to get to the next Monday
  const daysToAdd = (currentDay === 0) ? 1 : (8 - currentDay);
  
  // Set the date to next Monday
  nextMonday.setDate(today.getDate() + daysToAdd);
  nextMonday.setHours(0,0,0,0);
  
  return nextMonday;
}

// Helper function to return date to 'YYYY-MM-DD' string for SQL
function getDateString(date) {
  return date.toISOString().split('T')[0];
}

// return datetime to 'YYYY-MM-DD HH:MM:SS' string 
function getTimeString(date) {
  const isoString = date.toISOString(); // Example: '2024-09-10T14:30:45.000Z'
  const [datePart, timePart] = isoString.split('T'); // Split into date and time components
  
  const timeWithoutMs = timePart.split('.')[0]; // Remove the milliseconds part

  return `${datePart} ${timeWithoutMs}`; // Join date and time with a space
}

// use promise to query
function queryDB(sql, params) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}

// Function to send the email using nodemailer
function sendEmail(mailOptions) {
//  console.log("send email", mailOptions);
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Return a promise that resolves or rejects based on the email sending success/failure
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return reject(err);  // Reject the promise on error
      } else {
        console.log("Email sent:", info.response);
        return resolve(info);  // Resolve the promise on success
      }
    });
  });
}

// Function to send email to specified teacher with course information within the specified time range
function sendEmailToTeacher(teacher, fromDate, beforeDate) {
  console.log("teacher: ", teacher);
  return new Promise((resolve, reject) => {
    const sql = `select vc.name,vc.starttime,vc.endtime,vc.classroom,vc.groupprivate,vc.status 
                from view_course vc
                join tbcourseteacher on teacherid = ? and courseid = vc.course_id
                where vc.starttime >= ? and vc.endtime < ?
                order by vc.starttime`;

    db.query(sql, [teacher.teacher_id, getDateString(fromDate), getDateString(beforeDate)], async (err, results) => {
      if (err) {
        console.error("Error fetching teacher's course info:", err);
        return;
      }

      console.log("teacher courses: ", results);

      // Construct the HTML table with course information
      let tableHTML = `
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Classroom</th>
            <th>Group/Private</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>`;

      // Loop through the results and build table rows
      results.forEach(course => {
        tableHTML += `
        <tr>
          <td>${course.name}</td>
          <td>${getTimeString(course.starttime)}</td>
          <td>${getTimeString(course.endtime)}</td>
          <td>${course.classroom}</td>
          <td>${course.groupprivate}</td>
          <td>${course.status}</td>
        </tr>`;
      });

      tableHTML += `
        </tbody>
      </table>`;

      // Construct mailOptions
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: teacher.email, // Teacher's email
        subject: `[noreply]Course Schedule from ${getDateString(fromDate)} to ${getDateString(beforeDate)}`,
        html: `
        <p>Dear ${teacher.name},</p>
        <p>Here is your course schedule from ${getDateString(fromDate)} to ${getDateString(beforeDate)}:</p>
        ${tableHTML}
        <br>
        <p>Best regards,<br>ISOM Management Team</p>
      `
      };

      try {
        await sendEmail(mailOptions);  // Await the email to be sent
        resolve();  // Resolve after email is successfully sent
      } catch (error) {
        reject(error);  // Reject if sending the email fails
      }
    });
  });
}


// Function to send emails to teachers within the specified time range
async function sendEmailsToTeachers(fromDate, toDate) {
  const sql = `select t.teacher_id, u.name, u.email from tbteacher t
                join tbuser u on u.user_id = t.userid
                where exists(
	                select * from view_course vc 
	                join tbcourseteacher ct on ct.teacherid = t.teacher_id and ct.courseid = vc.course_id
	                where vc.starttime >= ? and vc.endtime < ?
                )`;
  const toDatePlusOne = new Date(toDate);
  toDatePlusOne.setDate(toDatePlusOne.getDate() + 1); // Add one day 

  console.log("fromDate: ", getDateString(fromDate));
  console.log("toDate+1: ", getDateString(toDatePlusOne));
  
  return new Promise((resolve, reject) => {
    db.query(sql, [getDateString(fromDate), getDateString(toDatePlusOne)], async (err, results) => {
      if (err) {
        console.error("Error fetching teacher info:", err);
        reject(err);
        return;
      }
      
      console.log("teacher: ", results);
      
      // Use Promise.all to wait for all email promises to complete
      await Promise.all(results.map(result => sendEmailToTeacher(result, fromDate, toDatePlusOne)));
      
      resolve(); // Resolve after all emails are sent
    });
  });
}

// Function to send emails to students (similar to the one for teachers)
function sendEmailsToStudents(fromDate, toDate) {

}

// Main function to trigger sending emails based on app_settings
async function sendEmails() {
  const daysInAdvance = 1;

  try {
    // Fetch auto_email_teacher setting using queryDB
    const result = await queryDB(`SELECT setting_value FROM app_settings WHERE setting_key="auto_email_teacher"`);

    const aet = result[0]?.setting_value;
    console.log("aet setting:", aet);

    let fromDate, toDate, scheduledEmailDay;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (aet) {
      case "weekly":
        fromDate = getNextMonday(); // Next Monday
        toDate = new Date(fromDate);
        toDate.setDate(fromDate.getDate() + 6); // Set to next Sunday (6 days after Monday)

        scheduledEmailDay = new Date(fromDate);
        scheduledEmailDay.setDate(fromDate.getDate() - daysInAdvance);

        console.log("scheduledEmailDay: ", scheduledEmailDay.getTime());
        console.log("today: ", today.getTime());
        if (scheduledEmailDay.getTime() === today.getTime()) {
          await sendEmailsToTeachers(fromDate, toDate);
        }
        break;

      case "monthly":
        // Handle monthly logic if necessary
        break;

      case "off":
      default:
        // Do nothing if setting is off
        break;
    }
  } catch (err) {
    console.error("Error in fetching settings or sending emails:", err);
  }
}


// Call the sendEmails function to start sending emails
sendEmails().then(() => {
  console.log("All emails sent, exiting...");
  process.exit(0); // Exit the process after all emails are sent
}).catch(err => {
  console.error("Error in sending emails:", err);
  process.exit(1); // Exit with error
});
