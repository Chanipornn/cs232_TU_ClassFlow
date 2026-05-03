package com.tu.classflow.controller;

import com.tu.classflow.model.*;
import com.tu.classflow.repository.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;
    

    @Autowired
    private UserRepository userRepository;

 // ✅ ดู notification ของตัวเอง
    @GetMapping
    public List<Notification> getMyNotifications(@AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getClaim("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository
                .findByUser_IdOrderByCreatedAtDesc(user.getId());
    }

    // ✅ unread count
    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal Jwt jwt) {

        String email = jwt.getClaim("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        long count = notificationRepository
                .countByUser_IdAndIsReadFalse(user.getId());

        return Map.of("count", count);
    }

    // ✅ mark as read
    @PatchMapping("/{id}/read")
    public String markAsRead(@PathVariable Long id) {

        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true); // ⚠️ ต้องใช้ isRead
            notificationRepository.save(n);
        });

        return "marked as read";
    }
}