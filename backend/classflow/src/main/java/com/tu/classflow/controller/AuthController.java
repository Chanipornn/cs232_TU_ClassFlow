package com.tu.classflow.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tu.classflow.model.User;
import com.tu.classflow.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/sync-user")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            // 1. เช็กว่าอีเมลซ้ำไหม
            if (userRepository.findByCognitoSub(user.getCognitoSub()).isPresent()) {
                return ResponseEntity.badRequest().body("Error: User is already registered!");
            }

            // 2. เช็กว่าข้อมูลสำคัญอย่าง email หรือ cognitoSub เป็นค่าว่างไหม
            if (user.getEmail() == null || user.getCognitoSub() == null) {
                return ResponseEntity.badRequest().body("Error: Email and CognitoSub are required!");
            }

            // 3. บันทึกข้อมูลลง MySQL
            User savedUser = userRepository.save(user);
            
            // 4. ส่งข้อความสำเร็จกลับไป (อาจจะส่งข้อมูล User ที่บันทึกแล้วกลับไปด้วยก็ได้)
            return ResponseEntity.ok("User data synced to local database successfully!");
            
        } catch (Exception e) {
            // ดักจับกรณีเกิด Error อื่นๆ เช่น Database connection มีปัญหา
            return ResponseEntity.internalServerError().body("Error: Could not sync user. " + e.getMessage());
        }
    }
}