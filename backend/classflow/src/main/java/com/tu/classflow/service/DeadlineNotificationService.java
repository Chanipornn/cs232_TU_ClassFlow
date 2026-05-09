package com.tu.classflow.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.tu.classflow.model.Assignment;
import com.tu.classflow.model.Enrollment;
import com.tu.classflow.model.Notification;
import com.tu.classflow.repository.AssignmentRepository;
import com.tu.classflow.repository.EnrollmentRepository;
import com.tu.classflow.repository.NotificationRepository;

@Service
public class DeadlineNotificationService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EventBridgeService eventBridgeService;

    // รันทุกวันตอน 08:00 น.
    @Scheduled(cron = "0 * * * * *")
public void checkDeadlines() {
    System.out.println("=== Checking deadlines...");

    LocalDateTime now = LocalDateTime.now();
    LocalDateTime tomorrow = now.plusDays(1);

    System.out.println("=== Now: " + now);
    System.out.println("=== Tomorrow: " + tomorrow);

    List<Assignment> assignments = assignmentRepository
            .findByDeadlineBetween(now, tomorrow);

    System.out.println("=== Found: " + assignments.size() + " assignments");

    for (Assignment assignment : assignments) {
        List<Enrollment> enrollments = enrollmentRepository
                .findByCourse_Id(assignment.getCourse().getId());

        for (Enrollment e : enrollments) {
            Notification notif = new Notification();
            notif.setUser(e.getStudent());
            notif.setTitle("⏰ ใกล้ถึง Deadline: " + assignment.getTitle());
            notif.setMessage("งาน " + assignment.getTitle()
                + " ในวิชา " + assignment.getCourse().getCode()
                + " จะหมดเขตพรุ่งนี้!");
            notif.setType("DEADLINE");
            notif.setRelatedId(assignment.getId());
            notif.setIsRead(false);
            notif.setCreatedAt(LocalDateTime.now());
            notificationRepository.save(notif);
        }

        eventBridgeService.sendDeadlineReminderEvent(
            assignment.getTitle(),
            assignment.getCourse().getCode(),
            assignment.getDeadline().toString()
        );

        System.out.println("=== Deadline reminder sent for: " + assignment.getTitle());
    }
}
}