package com.nextlevel.domain.booth;

import com.nextlevel.domain.booth.dto.BoothDetailResponse;
import com.nextlevel.domain.booth.dto.BoothResponse;
import com.nextlevel.domain.evaluation.EvaluationRepository;
import com.nextlevel.domain.visit.BoothVisitRepository;
import com.nextlevel.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BoothService {

    private final BoothRepository boothRepository;
    private final BoothVisitRepository boothVisitRepository;
    private final EvaluationRepository evaluationRepository;

    public List<BoothResponse> getAllBooths(String employeeId) {
        return boothRepository.findAll().stream()
                .map(booth -> BoothResponse.of(booth,
                        boothVisitRepository.existsByBoothBoothIdAndUserEmployeeId(booth.getBoothId(), employeeId)))
                .sorted((a, b) -> Boolean.compare(a.isVisited(), b.isVisited()))
                .toList();
    }

    public List<BoothResponse> getBoothsByZone(String zoneId, String employeeId) {
        return boothRepository.findByZone(zoneId).stream()
                .map(booth -> BoothResponse.of(booth,
                        boothVisitRepository.existsByBoothBoothIdAndUserEmployeeId(booth.getBoothId(), employeeId)))
                .sorted((a, b) -> Boolean.compare(a.isVisited(), b.isVisited()))
                .toList();
    }

    public BoothDetailResponse getBoothDetail(String boothId, String employeeId) {
        Booth booth = boothRepository.findById(boothId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 부스입니다."));

        boolean visited = boothVisitRepository.existsByBoothBoothIdAndUserEmployeeId(boothId, employeeId);
        boolean evaluated = evaluationRepository.existsByBoothBoothIdAndUserEmployeeId(boothId, employeeId);

        return BoothDetailResponse.of(booth, visited, evaluated);
    }
}
