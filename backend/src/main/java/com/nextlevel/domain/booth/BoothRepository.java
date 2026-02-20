package com.nextlevel.domain.booth;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BoothRepository extends JpaRepository<Booth, String> {

    List<Booth> findByZone(String zone);

    List<Booth> findByFloor(String floor);

    Optional<Booth> findByOwnerEmployeeId(String ownerEmployeeId);
}
