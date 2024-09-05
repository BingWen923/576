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

DROP TABLE IF EXISTS `app_settings`;
CREATE TABLE app_settings (
    setting_id INT AUTO_INCREMENT PRIMARY KEY, 
    setting_key VARCHAR(255) NOT NULL, 
    setting_value VARCHAR(255),   
    description VARCHAR(255),                
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  
);

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

/***************************** create stored procedure ***************************/
DROP PROCEDURE IF EXISTS `deleteCourse`;
DELIMITER $$
CREATE PROCEDURE deleteCourse(IN CID INT)
BEGIN
    DECLARE exitHandler INT DEFAULT 0;
    
    -- Handler to catch any SQL exception and roll back the transaction
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION 
    BEGIN
        SET exitHandler = 1;
        ROLLBACK;
    END;

    -- Start the transaction
    START TRANSACTION;

    -- Delete related records from tbcoursestudent and tbcourseteacher
    DELETE FROM tbcoursestudent WHERE courseid = CID;
    DELETE FROM tbcourseteacher WHERE courseid = CID;

    -- Delete the course record from tbcourse table
    DELETE FROM tbcourse WHERE course_id = CID;

    -- Check if an error occurred during the transaction
    IF exitHandler = 0 THEN
        COMMIT;
        -- Return a success message if everything went fine
        SELECT CONCAT('deleteCourse successfully for courseId: ', CID) AS SuccessMessage;
    ELSE
        -- Return an error message if any part of the transaction failed
        SELECT 'deleteCourse error occurred. The transaction has been rolled back.' AS ErrorMessage;
    END IF;
END $$
DELIMITER ;

DROP PROCEDURE IF EXISTS `autoCompleteCourses`;
DELIMITER $$
/* Automatically change scheduled courses to completed status when the course time meets the criteria. */
CREATE PROCEDURE autoCompleteCourses(IN beforeTime DATETIME)
BEGIN
  -- Update scheduled courses to completed status if both starttime and endtime are before the given datetime
  UPDATE tbcourse 
  SET status = 'completed' 
  WHERE status = 'scheduled'
    AND starttime < beforeTime
    AND endtime < beforeTime;
END $$

DELIMITER ;
/***************************** create stored procedure end ***************************/

/***************************** create event for scheduled process **************************/
DROP EVENT IF EXISTS `auto_complete_scheduled_courses`;
-- Create an event to automatically complete courses at 3 AM daily
DELIMITER $$
CREATE EVENT auto_complete_scheduled_courses
ON SCHEDULE EVERY 1 DAY
STARTS '2024-09-05 03:00:00' -- Start running the event from a specific date at 3 AM
DO
BEGIN
    -- Check if the 'auto_course_complete' setting is 'on' in the app_settings table
    IF (SELECT setting_value FROM app_settings WHERE setting_key = 'auto_course_complete') = 'on' THEN
        -- Call the stored procedure to mark all courses before today's midnight as completed
        CALL autoCompleteCourses(NOW() - INTERVAL 3 HOUR);
    END IF;
END $$
DELIMITER ;
/***************************** create event end **************************/

/***************************** initialize setting records **************************/
INSERT INTO `app_settings` (`setting_key`, `setting_value`)
VALUES('auto_course_complete', 'on');
INSERT INTO `app_settings` (`setting_key`, `setting_value`)
VALUES('auto_email_teacher', 'weekly');		
INSERT INTO `app_settings` (`setting_key`, `setting_value`)
VALUES('auto_email_student', 'monthly');

/**************** initialize some test data *****************/
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
