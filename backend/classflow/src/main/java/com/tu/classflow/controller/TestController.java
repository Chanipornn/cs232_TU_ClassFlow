package com.tu.classflow.controller;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/api/test")
    public String test(@AuthenticationPrincipal Jwt jwt) {

    	if (jwt == null) {
            return "JWT is NULL ❌";
        }

        String email = jwt.getClaimAsString("email");

        return "Hello " + email;
        
        
    }}
