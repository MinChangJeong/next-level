package com.nextlevel.domain.evaluation;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByUserEmployeeIdOrderByCreatedAtDesc(String employeeId);

    List<Review> findByBoothBoothIdOrderByCreatedAtDesc(String boothId);

    int countByUserEmployeeId(String employeeId);
}
