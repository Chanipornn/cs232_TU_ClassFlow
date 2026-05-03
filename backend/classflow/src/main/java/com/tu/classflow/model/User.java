package com.tu.classflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
	
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String role; // STUDENT / INSTRUCTOR
    
    // constructor 
    public User() {}

    public User(String email, String role) {
        this.email = email;
        this.role = role;
    }

    // getter/setter
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getRole() { return role; }

    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
}