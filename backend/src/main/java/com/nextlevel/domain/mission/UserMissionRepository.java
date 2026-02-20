package com.nextlevel.domain.mission;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserMissionRepository extends JpaRepository<UserMission, Long> {

    List<UserMission> findByUserEmployeeIdOrderByMissionId(String employeeId);

    Optional<UserMission> findByUserEmployeeIdAndMissionId(String employeeId, String missionId);
}
