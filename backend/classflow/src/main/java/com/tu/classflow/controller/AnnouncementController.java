package com.tu.classflow.controller;

import com.tu.classflow.model.*;
import com.tu.classflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/announcements")
@CrossOrigin(origins = "*")
public class AnnouncementController {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private UserRepository userRepository;

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

        return announcementRepository.save(ann);
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