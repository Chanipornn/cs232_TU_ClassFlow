package com.tu.classflow.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tu.classflow.model.Announcement;
import com.tu.classflow.model.Enrollment;
import com.tu.classflow.model.Notification;
import com.tu.classflow.model.User;
import com.tu.classflow.repository.AnnouncementRepository;
import com.tu.classflow.repository.EnrollmentRepository;
import com.tu.classflow.repository.NotificationRepository;
import com.tu.classflow.repository.UserRepository;

@RestController
@RequestMapping("/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    // GET /announcements — ดึงของ instructor คนนั้น
    @GetMapping
    public List<Announcement> getAnnouncements(
        @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        String cognitoSub = com.auth0.jwt.JWT.decode(token).getSubject();

        User user = userRepository.findByCognitoSub(cognitoSub)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return announcementRepository.findByInstructor_IdOrderByIdDesc(user.getId());
    }


    @GetMapping("/student")
    public List<Announcement> getStudentAnnouncements(
    @RequestHeader("Authorization") String authHeader
    ) {

    String token = authHeader.replace("Bearer ", "");
    String cognitoSub = com.auth0.jwt.JWT.decode(token).getSubject();

    User user = userRepository.findByCognitoSub(cognitoSub)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // หา enrollments ของ student
    List<Enrollment> enrollments =
            enrollmentRepository.findByStudent_Id(user.getId());

    // ดึง course code ทั้งหมด
    List<String> courseCodes = enrollments.stream()
            .map(e -> e.getCourse().getCode())
            .toList();

    // ดึง announcements ของทุกวิชาที่ลงทะเบียน
    return announcementRepository
            .findByCourseCodeInOrderByIdDesc(courseCodes);
    }

    // POST /announcements — สร้างใหม่
    @PostMapping
    public Announcement createAnnouncement(
        @RequestHeader("Authorization") String authHeader,
        @RequestBody Map<String, String> body
    ) {
        String token = authHeader.replace("Bearer ", "");
        String cognitoSub = com.auth0.jwt.JWT.decode(token).getSubject();

        User user = userRepository.findByCognitoSub(cognitoSub)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Announcement ann = new Announcement();
        ann.setTitle(body.get("title"));
        ann.setDate(body.get("date"));
        ann.setMessage(body.get("message"));
        ann.setCourseCode(body.get("courseCode"));
        ann.setInstructor(user);

        // บันทึก announcement
        Announcement savedAnn = announcementRepository.save(ann);
 
        // ส่ง notification ไปยังนักเรียนทั้งหมดในวิชา
        sendAnnouncementNotifications(savedAnn);

        return savedAnn;
    }


      // ส่ง notification ประกาศไปยังนักเรียนทั้งหมดของวิชา
    
    private void sendAnnouncementNotifications(Announcement announcement) {
        try {
            // ดึงนักเรียนทั้งหมดที่ลงทะเบียนวิชานี้
            List<User> students = userRepository.findStudentsByCourseCode(announcement.getCourseCode());
 
            // สร้าง notification สำหรับแต่ละนักเรียน
            for (User student : students) {
                try {
                    Notification notification = new Notification();
                    notification.setUser(student);
                    notification.setTitle("📢 ประกาศใหม่: " + announcement.getTitle());
                    notification.setMessage("อาจารย์ " + announcement.getInstructor().getEmail() 
                        + " ได้ส่งประกาศใหม่ (" + announcement.getCourseCode() + ")");
                    notification.setType("ANNOUNCEMENT"); // ประเภท notification
                    notification.setRelatedId(announcement.getId()); // ID ของ announcement
                    notification.setIsRead(false);
                    notification.setCreatedAt(LocalDateTime.now());
 
                    notificationRepository.save(notification);
 
                } catch (Exception e) {
                    System.err.println("Error sending notification to student: " + student.getId());
                    e.printStackTrace();
                }
            }
 
        } catch (Exception e) {
            System.err.println("Error in sendAnnouncementNotifications");
            e.printStackTrace();
        }
    }


    // DELETE /announcements/{id} — ลบ
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAnnouncement(
        @PathVariable Long id,
        @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        String cognitoSub = com.auth0.jwt.JWT.decode(token).getSubject();

        User user = userRepository.findByCognitoSub(cognitoSub)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return announcementRepository.findById(id).map(ann -> {
            if (!ann.getInstructor().getId().equals(user.getId())) {
                return ResponseEntity.status(403).<String>body("Forbidden");
            }
            announcementRepository.delete(ann);
            return ResponseEntity.ok("Deleted");
        }).orElse(ResponseEntity.notFound().<String>build());


        
    }
}


