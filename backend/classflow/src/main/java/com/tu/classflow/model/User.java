package com.tu.classflow.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
	
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;
    private String role; // STUDENT / INSTRUCTOR
    
    @Column(unique = true)
    private String cognitoSub;// Link กับ AWS Cognito
    
    // constructor 
    public User() {}

    public User(String email, String role, String cognitoSub) {
        this.email = email;
        this.role = role;
        this.cognitoSub = cognitoSub;
    }

    // getter/setter
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getRole() { return role; }

    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
    
    public String getCognitoSub() { return cognitoSub; }
    public void setCognitoSub(String cognitoSub) { this.cognitoSub = cognitoSub; }
}

