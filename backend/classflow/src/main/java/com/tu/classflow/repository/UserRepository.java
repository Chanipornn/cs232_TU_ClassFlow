package com.tu.classflow.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tu.classflow.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	 Optional<User> findByEmail(String email);
	 Optional<User> findByCognitoSub(String cognitoSub);

}
