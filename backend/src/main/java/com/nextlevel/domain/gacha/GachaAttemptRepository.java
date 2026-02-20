package com.nextlevel.domain.gacha;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GachaAttemptRepository extends JpaRepository<GachaAttempt, Long> {

    List<GachaAttempt> findByUserEmployeeIdOrderByCreatedAtDesc(String employeeId);

    int countByUserEmployeeId(String employeeId);
}
