package com.tu.classflow.controller;

import com.tu.classflow.model.Notification;
import com.tu.classflow.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    // ดู notification ทั้งหมดของตัวเอง
    @GetMapping
    public List<Notification> getMyNotifications(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // ดูจำนวน unread (สำหรับ badge)
    @GetMapping("/unread-count")
    public Map<String, Long> getUnreadCount(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        long count = notificationRepository.countByUserIdAndIsReadFalse(userId);
        return Map.of("count", count);
    }

    // mark as read
    @PatchMapping("/{id}/read")
    public String markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        return "marked as read";
    }
}