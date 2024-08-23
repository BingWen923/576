CREATE DATABASE IF NOT EXISTS DbMusicSchool;
USE DbMusicSchool;

DROP TABLE IF EXISTS `tbcoursestudent`;
DROP TABLE IF EXISTS `tbcourseteacher`;

DROP TABLE IF EXISTS `tbstaff`;
DROP TABLE IF EXISTS `tbcourse`;
DROP TABLE IF EXISTS `tbteacher`;
DROP TABLE IF EXISTS `tbstudent`;
DROP TABLE IF EXISTS `tbguardian`;
DROP TABLE IF EXISTS `tbuser`;

CREATE TABLE `tbuser` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `memo` varchar(255),
  `isstudent` BOOLEAN DEFAULT FALSE,
  `isteacher` BOOLEAN DEFAULT FALSE,
  `isstaff` BOOLEAN DEFAULT FALSE,
  `isguardian` BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `tbstaff` (
  `staff_id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `status` varchar(255) NOT NULL, -- active, on leave, resigned, sick
  `dateofhire` DATE NOT NULL,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`staff_id`),
  FOREIGN KEY (`userid`) REFERENCES tbuser(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `tbguardian` (
  `guardian_id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `status` varchar(255) NOT NULL,
  `guardianrelation` varchar(255) NOT NULL, -- father, mother, grandparents, legal guardian, etc.
  PRIMARY KEY (`guardian_id`),
  FOREIGN KEY (`userid`) REFERENCES tbuser(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `tbteacher` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `status` varchar(255) NOT NULL, -- active, on leave, resigned, sick
  `specialties` varchar(255) NOT NULL, -- teaching specialties, comma-separated string
  PRIMARY KEY (`teacher_id`),
  FOREIGN KEY (`userid`) REFERENCES tbuser(`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `tbstudent` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `status` varchar(255) NOT NULL,
  `studyprograms` varchar(255) NOT NULL, -- comma-separated string
  `parents1` int default NULL,
  `parents2` int default NULL,
  PRIMARY KEY (`student_id`),
  FOREIGN KEY (`userid`) REFERENCES tbuser(`user_id`),
  FOREIGN KEY (`parents1`) REFERENCES tbguardian(`guardian_id`),
  FOREIGN KEY (`parents2`) REFERENCES tbguardian(`guardian_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `tbcourse` (
  `course_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `groupprivate` varchar(50) NOT NULL, -- group or private
  `coursetype` varchar(255) NOT NULL, -- piano, guitar, voice
  `starttime` datetime NOT NULL,
  `endtime` datetime NOT NULL,
  `status` varchar(50) NOT NULL, -- scheduled, completed, cancelled
  `classroom` varchar(50) NOT NULL,
  `memo` varchar(255),
  PRIMARY KEY (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `tbcourseteacher` (
  `courseteacher_id` int NOT NULL AUTO_INCREMENT,
  `courseid` int NOT NULL,
  `teacherid` int NOT NULL,
  PRIMARY KEY (`courseteacher_id`),
  FOREIGN KEY (`courseid`) REFERENCES tbcourse(`course_id`),
  FOREIGN KEY (`teacherid`) REFERENCES tbteacher(`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

CREATE TABLE `tbcoursestudent` (
  `coursestudent_id` int NOT NULL AUTO_INCREMENT,
  `courseid` int NOT NULL,
  `studentid` int NOT NULL,
  PRIMARY KEY (`coursestudent_id`),
  FOREIGN KEY (`courseid`) REFERENCES tbcourse(`course_id`),
  FOREIGN KEY (`studentid`) REFERENCES tbstudent(`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8MB4;

DROP VIEW IF EXISTS `view_course`;
CREATE VIEW `view_course` AS
SELECT *
FROM `tbcourse`
WHERE `status` NOT LIKE '%completed%'
AND `status` NOT LIKE '%deleted%';

INSERT INTO `tbuser` (`name`, `phone`, `email`, `address`, `memo`, `isteacher`)
VALUES ('David Doe', '123-456-7890', 'john.doe@example.com', '123 Main St', 'Experienced music teacher', true);
INSERT INTO `tbteacher` (`userid`, `status`, `specialties`)
VALUES (LAST_INSERT_ID(), 'active', 'Piano, Guitar');

INSERT INTO `tbuser` (`name`, `phone`, `email`, `address`, `memo`, `isteacher`)
VALUES ('Julia Roberts', '223-456-7890', 'julia@example.com', '666 Hillcrest St', 'Experienced voice teacher', true);
INSERT INTO `tbteacher` (`userid`, `status`, `specialties`)
VALUES (LAST_INSERT_ID(), 'active', 'Vocal music, Composition');

INSERT INTO `tbuser` (`name`, `phone`, `email`, `address`, `memo`, `isstudent`)
VALUES ('test student 888', '123-456-7890', '888@example.com', '888 Main St', 'smart kid', true);
INSERT INTO `tbstudent` (`userid`, `status`, `studyprograms`)
VALUES (LAST_INSERT_ID(), 'active', 'Piano, Guitar');

INSERT INTO `tbuser` (`name`, `phone`, `email`, `address`, `memo`, `isstudent`)
VALUES ('test student 999', '223-456-7890', '999@example.com', '999 Hillcrest St', 'good boy', true);
INSERT INTO `tbstudent` (`userid`, `status`, `studyprograms`)
VALUES (LAST_INSERT_ID(), 'active', 'Vocal music, Composition');
