package com.nextlevel.domain.visit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoothVisitRepository extends JpaRepository<BoothVisit, Long> {

    boolean existsByBoothBoothIdAndUserEmployeeId(String boothId, String employeeId);

    List<BoothVisit> findByUserEmployeeIdOrderByVisitedAtDesc(String employeeId);

    Optional<BoothVisit> findTopByUserEmployeeIdOrderByVisitedAtDesc(String employeeId);

    int countByBoothBoothId(String boothId);
}
