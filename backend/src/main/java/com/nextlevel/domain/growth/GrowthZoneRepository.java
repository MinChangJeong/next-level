package com.nextlevel.domain.growth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface GrowthZoneRepository extends JpaRepository<GrowthZoneEntry, Long> {

    Optional<GrowthZoneEntry> findByUserEmployeeId(String employeeId);

    boolean existsByUserEmployeeId(String employeeId);
}
