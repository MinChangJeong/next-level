package com.nextlevel.domain.admin;

import com.nextlevel.common.ApiResponse;
import com.nextlevel.domain.booth.Booth;
import com.nextlevel.domain.booth.BoothRepository;
import com.nextlevel.domain.evaluation.EvaluationRepository;
import com.nextlevel.domain.gacha.GoodsRepository;
import com.nextlevel.domain.user.UserRepository;
import com.nextlevel.domain.visit.BoothVisitRepository;
import lombok.Builder;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final BoothRepository boothRepository;
    private final BoothVisitRepository boothVisitRepository;
    private final EvaluationRepository evaluationRepository;
    private final GoodsRepository goodsRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        DashboardResponse dashboard = DashboardResponse.builder()
                .totalUsers(userRepository.count())
                .totalBooths(boothRepository.count())
                .totalVisits(boothVisitRepository.count())
                .totalEvaluations(evaluationRepository.count())
                .build();
        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    @GetMapping("/booths/ranking")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getBoothRanking() {
        List<Object[]> raw = evaluationRepository.findBoothRanking();
        List<Map<String, Object>> ranking = raw.stream()
                .limit(10)
                .map(row -> Map.of(
                        "boothId", row[0],
                        "voteCount", row[1]
                ))
                .toList();
        return ResponseEntity.ok(ApiResponse.success(ranking));
    }

    @GetMapping("/goods/stock")
    public ResponseEntity<ApiResponse<?>> getGoodsStock() {
        return ResponseEntity.ok(ApiResponse.success(goodsRepository.findAll()));
    }

    @GetMapping("/booths")
    public ResponseEntity<ApiResponse<List<Booth>>> getAllBooths() {
        return ResponseEntity.ok(ApiResponse.success(boothRepository.findAll()));
    }

    @Getter
    @Builder
    public static class DashboardResponse {
        private long totalUsers;
        private long totalBooths;
        private long totalVisits;
        private long totalEvaluations;
    }
}
