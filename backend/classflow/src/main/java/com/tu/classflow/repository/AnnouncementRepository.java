package com.tu.classflow.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.tu.classflow.model.Announcement;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByInstructor_IdOrderByIdDesc(Long instructorId);
}