/* 
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
@RequestMapping("/api/notifications")
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
*/

package com.tu.classflow.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tu.classflow.model.Notification;
import com.tu.classflow.model.User;
import com.tu.classflow.repository.NotificationRepository;
import com.tu.classflow.repository.UserRepository;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/student")
    public List<Notification> getMyNotifications(
        @RequestHeader("Authorization") String authHeader
    ) {
        String token = authHeader.replace("Bearer ", "");
        String cognitoSub = com.auth0.jwt.JWT.decode(token).getSubject();

        User user = userRepository.findByCognitoSub(cognitoSub)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository
                .findByUser_IdOrderByCreatedAtDesc(user.getId());
    }

    @PatchMapping("/{id}/read")
    public String markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setIsRead(true);
            notificationRepository.save(n);
        });
        return "marked as read";
    }
}