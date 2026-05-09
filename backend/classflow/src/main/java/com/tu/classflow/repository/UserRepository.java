/*package com.tu.classflow.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tu.classflow.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	 Optional<User> findByEmail(String email);
	 Optional<User> findByCognitoSub(String cognitoSub);

}*/

package com.tu.classflow.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.tu.classflow.model.User;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByCognitoSub(String cognitoSub);

    @Query("""
        SELECT e.student
        FROM Enrollment e
        WHERE e.course.code = :courseCode
    """)
    List<User> findStudentsByCourseCode(
        @Param("courseCode") String courseCode
    );
}