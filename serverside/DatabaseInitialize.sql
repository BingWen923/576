CREATE DATABASE IF NOT EXISTS DbMusicSchool;
USE DbMusicSchool;

DROP TABLE IF EXISTS `TbCourseStudent`;
DROP TABLE IF EXISTS `TbCourseTeacher`;

DROP TABLE IF EXISTS `TbStaff`;
DROP TABLE IF EXISTS `TbCourse`;
DROP TABLE IF EXISTS `TbTeacher`;
DROP TABLE IF EXISTS `TbStudent`;
DROP TABLE IF EXISTS `TbGuardian`;
DROP TABLE IF EXISTS `TbUser`;


CREATE TABLE `TbUser` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `Phone` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `Memo` varchar(255) ,
  `isStudent` BOOLEAN DEFAULT FALSE,
  `isTeacher` BOOLEAN DEFAULT FALSE,
  `isStaff` BOOLEAN DEFAULT FALSE,
  `isGuardian` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `TbStaff` (
  `staff_id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `Status` varchar(255) NOT NULL, # active, on leave, resigned, sick
  `DateOfHire` DATE NOT NULL,
  `Title` varchar(255) NOT NULL, 
  PRIMARY KEY (`Staff_id`),
  FOREIGN KEY (UserId) REFERENCES TbUser(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `TbGuardian` (
  `guardian_id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `Status` varchar(255) NOT NULL, 
  `GuardianRelation` varchar(255) NOT NULL, # father,mother,grandparents,legal guardian etc
  PRIMARY KEY (`guardian_id`),
  FOREIGN KEY (UserId) REFERENCES TbUser(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;


CREATE TABLE `TbTeacher` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `Status` varchar(255) NOT NULL, # active, on leave, resigned, sick
  `Specialties` varchar(255) NOT NULL, # teaching specialties, comma-separated string
  PRIMARY KEY (`teacher_id`),
  FOREIGN KEY (UserId) REFERENCES TbUser(user_id)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `TbStudent` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `Status` varchar(255) NOT NULL,
  `StudyPrograms` varchar(255) NOT NULL, # comma-separated string
  `Parents1` int default NULL, 
  `Parents2` int default NULL,
  PRIMARY KEY (`student_id`),
  FOREIGN KEY (UserId) REFERENCES TbUser(user_id),
  FOREIGN KEY (Parents1) REFERENCES TbGuardian(guardian_id),
  FOREIGN KEY (Parents2) REFERENCES TbGuardian(guardian_id)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `TbCourse` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `GroupPrivate` varchar(50) NOT NULL, # group or private
  `CourseType` varchar(255) NOT NULL, # piano,gitar,voice
  `StartTime` datetime NOT NULL,
  `endTime` datetime NOT NULL,
  `Status` varchar(50) NOT NULL, # scheduled,completed,cancelled
  `ClassRoom` varchar(50) NOT NULL,
  `Memo` varchar(255) ,
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `TbCourseTeacher` (
  `courseteacher_id` int NOT NULL AUTO_INCREMENT,
  `CourseID` int NOT NULL,
  `TeacherID` int NOT NULL,
  PRIMARY KEY (`courseteacher_id`),
  FOREIGN KEY (CourseID) REFERENCES TbCourse(course_id),
  FOREIGN KEY (TeacherID) REFERENCES TbTeacher(teacher_id)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `TbCourseStudent` (
  `coursestudent_id` int NOT NULL AUTO_INCREMENT,
  `CourseID` int NOT NULL,
  `StudentID` int NOT NULL,
  PRIMARY KEY (`coursestudent_id`),
  FOREIGN KEY (CourseID) REFERENCES TbCourse(course_id),
  FOREIGN KEY (StudentID) REFERENCES TbStudent(student_id)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

/*
DROP TABLE IF EXISTS `TbCompletedCourses`;
CREATE TABLE `TbCompletedCourses` (
  `completedcourses_id` INT NOT NULL AUTO_INCREMENT,
  `CourseId` INT NOT NULL,
  `StudentId` INT NOT NULL,
  `completionDate` DATETIME NOT NULL,
  `grade` VARCHAR(10),
  `feedback` VARCHAR(4000),
  PRIMARY KEY (`completedcourses_id`),
  FOREIGN KEY (CourseId) REFERENCES TbCourse(course_id),
  FOREIGN KEY (StudentId) REFERENCES TbStudent(student_id)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;
*/

DROP VIEW IF EXISTS `view_course`;
CREATE VIEW view_course AS
SELECT * 
FROM TbCourse 
WHERE status NOT LIKE '%completed%' 
AND status NOT LIKE '%deleted%';

INSERT INTO `TbUser` (Name, Phone, Email, Address, Memo, isTeacher)
VALUES ('David Doe', '123-456-7890', 'john.doe@example.com', '123 Main St', 'Experienced music teacher',true);
INSERT INTO `TbTeacher` (`UserId`, `Status`, `Specialties`)
VALUES (LAST_INSERT_ID(), 'active', 'Piano, Guitar');

INSERT INTO `TbUser` (Name, Phone, Email, Address, Memo, isTeacher)
VALUES ('Julia Roberts', '223-456-7890', 'Julia@example.com', '666 Hillcrest St', 'Experienced voice teacher',true);
INSERT INTO `TbTeacher` (`UserId`, `Status`, `Specialties`)
VALUES (LAST_INSERT_ID(), 'active', 'Vocal music, Composition');

INSERT INTO `TbUser` (Name, Phone, Email, Address, Memo, isStudent)
VALUES ('test student 888', '123-456-7890', '888@example.com', '888 Main St', 'smart kid',true);
INSERT INTO `TbStudent` (`UserId`, `Status`, `StudyPrograms`)
VALUES (LAST_INSERT_ID(), 'active', 'Piano, Guitar');

INSERT INTO `TbUser` (Name, Phone, Email, Address, Memo, isStudent)
VALUES ('test student 999', '223-456-7890', '999@example.com', '999 Hillcrest St', 'good boy',true);
INSERT INTO `TbStudent` (`UserId`, `Status`, `StudyPrograms`)
VALUES (LAST_INSERT_ID(), 'active', 'Vocal music, Composition');
