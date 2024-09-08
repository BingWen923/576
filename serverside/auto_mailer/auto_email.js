const db = require("../app/models/db");
require('dotenv').config();
const nodemailer = require('nodemailer');

process.env.TZ = 'UTC'; // important setting

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
  nextMonday.setHours(0, 0, 0, 0);
  
  return nextMonday;
}

// get the 1st day of next month
function getNextMonthFirstDay() {
  const today = new Date();
  const nextMonthDay1 = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  nextMonthDay1.setHours(0, 0, 0, 0);
  return nextMonthDay1;
}

// get the last day of next month
function getNextMonthLastDay() {
  const today = new Date();
  const nextMonthDay2 = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  nextMonthDay2.setDate(nextMonthDay2.getDate() - 1);
  nextMonthDay2.setHours(0, 0, 0, 0);
  return nextMonthDay2;
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
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

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

// generate the course table html
function geneCourseTable(courses) {
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

  courses.forEach(course => {
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
  return tableHTML
}

/************************** teacher part ******************************/
// Function to send email to specified teacher with course information within the specified time range
function sendEmailToTeacher(teacher, fromDate, beforeDate) {
  const sql = `
    SELECT vc.name, vc.starttime, vc.endtime, vc.classroom, vc.groupprivate, vc.status 
    FROM view_course vc
    JOIN tbcourseteacher ON teacherid = ? AND courseid = vc.course_id
    WHERE vc.starttime >= ? AND vc.endtime < ?
    ORDER BY vc.starttime`;

  return queryDB(sql, [teacher.teacher_id, getDateString(fromDate), getDateString(beforeDate)])
    .then(results => {
      // Construct the HTML table with course information
      let tableHTML = geneCourseTable(results);
  
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: teacher.email, // Teacher's email
        subject: `[noreply] Course Schedule from ${getDateString(fromDate)} to ${getDateString(beforeDate)}`,
        html: `
          <p>Dear ${teacher.name},</p>
          <p>Here is your course schedule from ${getDateString(fromDate)} to ${getDateString(beforeDate)}:</p>
          ${tableHTML}
          <br>
          <p>Best regards,<br>ISOM Management Team</p>
        `
      };

      // Send the email and return the promise
      return sendEmail(mailOptions);
    })
    .catch(error => {
      console.error("Error fetching or sending teacher's course info:", error);
      throw error; // Propagate the error
    });
}

// Function to send emails to all teachers within the specified time range
function sendEmailsToTeachers(fromDate, toDate) {
  const sql = `
    SELECT t.teacher_id, u.name, u.email 
    FROM tbteacher t
    JOIN tbuser u ON u.user_id = t.userid
    WHERE EXISTS (
      SELECT * 
      FROM view_course vc
      JOIN tbcourseteacher ct ON ct.teacherid = t.teacher_id AND ct.courseid = vc.course_id
      WHERE vc.starttime >= ? AND vc.endtime < ?
    )`;

  const toDatePlusOne = new Date(toDate);
  toDatePlusOne.setDate(toDatePlusOne.getDate() + 1);

  return queryDB(sql, [getDateString(fromDate), getDateString(toDatePlusOne)])
    .then(teachers => {
      const emailPromises = teachers.map(teacher => sendEmailToTeacher(teacher, fromDate, toDatePlusOne));
      return Promise.all(emailPromises); // Wait for all emails to be sent
    });
}

/************************** student part ******************************/
// Function to send email to specified student with course information within the specified time range
function sendEmailToStudent(student, fromDate, beforeDate) {
  const sql = `
    SELECT vc.name, vc.starttime, vc.endtime, vc.classroom, vc.groupprivate, vc.status 
    FROM view_course vc
    JOIN tbcoursestudent ON studentid = ? AND courseid = vc.course_id
    WHERE vc.starttime >= ? AND vc.endtime < ?
    ORDER BY vc.starttime`;

  return queryDB(sql, [student.student_id, getDateString(fromDate), getDateString(beforeDate)])
    .then(results => {
      // Construct the HTML table with course information
      let tableHTML = geneCourseTable(results);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: student.email, // Student's email
        subject: `[noreply] Course Schedule from ${getDateString(fromDate)} to ${getDateString(beforeDate)}`,
        html: `
          <p>Dear ${student.name},</p>
          <p>Here is your course schedule from ${getDateString(fromDate)} to ${getDateString(beforeDate)}:</p>
          ${tableHTML}
          <br>
          <p>Best regards,<br>ISOM Management Team</p>
        `
      };

      // Send the email and return the promise
      return sendEmail(mailOptions);
    })
    .catch(error => {
      console.error("Error fetching or sending student's course info:", error);
      throw error; // Propagate the error
    });
}

// Function to send emails to all students within the specified time range
function sendEmailsToStudents(fromDate, toDate) {
  const sql = `
    SELECT s.student_id, u.name, u.email 
    FROM tbstudent s
    JOIN tbuser u ON u.user_id = s.userid
    WHERE EXISTS (
      SELECT * 
      FROM view_course vc
      JOIN tbcoursestudent cs ON cs.studentid = s.student_id AND cs.courseid = vc.course_id
      WHERE vc.starttime >= ? AND vc.endtime < ?
    )`;

  const toDatePlusOne = new Date(toDate);
  toDatePlusOne.setDate(toDatePlusOne.getDate() + 1);

  return queryDB(sql, [getDateString(fromDate), getDateString(toDatePlusOne)])
    .then(students => {
      const emailPromises = students.map(student => sendEmailToStudent(student, fromDate, toDatePlusOne));
      return Promise.all(emailPromises); // Wait for all emails to be sent
    });
}

// Main function to trigger sending emails based on app_settings
function main_sendEmails() {
  const daysInAdvance = process.env.DAYS_IN_ADVANCE_TO_SEND_MAIL;

  // send emails to teachers
  queryDB(`SELECT setting_value FROM app_settings WHERE setting_key="auto_email_teacher"`)
    .then(result => {
      const aet = result[0]?.setting_value;
      console.log("aet setting:", aet);

      let fromDate, toDate, scheduledEmailDay;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      switch (aet) {
        case "weekly":
          fromDate = getNextMonday(); // Next Monday
          toDate = new Date(fromDate);
          toDate.setDate(fromDate.getDate() + 6); // Set to next Sunday (6 days after Monday)

          scheduledEmailDay = new Date(fromDate);
          scheduledEmailDay.setDate(fromDate.getDate() - daysInAdvance);

          if (scheduledEmailDay.getTime() === today.getTime()) {
            return sendEmailsToTeachers(fromDate, toDate);
          }
          break;

        case "monthly":
          fromDate = getNextMonthFirstDay();
          toDate = getNextMonthLastDay();

          scheduledEmailDay = new Date(fromDate);
          scheduledEmailDay.setDate(fromDate.getDate() - daysInAdvance);

          if (scheduledEmailDay.getTime() === today.getTime()) {
            return sendEmailsToTeachers(fromDate, toDate);
          }
          break;

        case "off":
        default:
          // Do nothing if setting is off
          return Promise.resolve(); // Return a resolved promise if no action needed
      }
    })
    .then(() => {
      // If teacher emails were sent, now send emails to students
      console.log("Teacher emails sent, now sending emails to students...");

      queryDB(`SELECT setting_value FROM app_settings WHERE setting_key="auto_email_student"`)
        .then(result => {
          const aes = result[0]?.setting_value;
          console.log("aes setting:", aes);

          let fromDate, toDate, scheduledEmailDay;
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          switch (aes) {
            case "weekly":
              fromDate = getNextMonday(); // Next Monday
              toDate = new Date(fromDate);
              toDate.setDate(fromDate.getDate() + 6); // Set to next Sunday (6 days after Monday)

              scheduledEmailDay = new Date(fromDate);
              scheduledEmailDay.setDate(fromDate.getDate() - daysInAdvance);

              if (scheduledEmailDay.getTime() === today.getTime()) {
                return sendEmailsToStudents(fromDate, toDate);
              }
              break;

            case "monthly":
              fromDate = getNextMonthFirstDay();
              toDate = getNextMonthLastDay();

              scheduledEmailDay = new Date(fromDate);
              scheduledEmailDay.setDate(fromDate.getDate() - daysInAdvance);

              if (scheduledEmailDay.getTime() === today.getTime()) {
                return sendEmailsToStudents(fromDate, toDate);
              }
              break;

            case "off":
            default:
              // Do nothing if setting is off
              return Promise.resolve(); // Return a resolved promise if no action needed
          }
        })
        .then(() => {
          console.log("All emails sent to teachers & students, exiting...");
          process.exit(0); // Exit after all emails are sent
        })
        .catch(err => {
          console.error("Error in sending emails to students:", err);
          process.exit(1); // Exit with error
        });
    })
    .catch(err => {
      console.error("Error in sending emails to teachers:", err);
      process.exit(1); // Exit with error
    });
}

// Call the main function to start sending emails
main_sendEmails();


