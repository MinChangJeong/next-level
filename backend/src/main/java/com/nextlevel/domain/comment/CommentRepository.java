package com.nextlevel.domain.comment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByBoothBoothIdOrderByCreatedAtDesc(String boothId);

    boolean existsByBoothBoothIdAndUserEmployeeId(String boothId, String employeeId);
}
