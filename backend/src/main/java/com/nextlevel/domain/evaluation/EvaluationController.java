package com.nextlevel.domain.evaluation;

import com.nextlevel.common.ApiResponse;
import com.nextlevel.domain.evaluation.dto.EvaluationRequest;
import com.nextlevel.domain.evaluation.dto.ReviewRequest;
import com.nextlevel.domain.evaluation.dto.ReviewResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class EvaluationController {

    private final EvaluationService evaluationService;

    @PostMapping("/evaluations/{boothId}")
    public ResponseEntity<ApiResponse<Void>> submitEvaluation(
            @PathVariable String boothId,
            @AuthenticationPrincipal String employeeId,
            @Valid @RequestBody EvaluationRequest request) {
        evaluationService.submitEvaluation(boothId, employeeId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success());
    }

    @PostMapping("/reviews/{boothId}")
    public ResponseEntity<ApiResponse<ReviewResponse>> submitReview(
            @PathVariable String boothId,
            @AuthenticationPrincipal String employeeId,
            @Valid @RequestBody ReviewRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(evaluationService.submitReview(boothId, employeeId, request)));
    }

    @GetMapping("/reviews/my")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews(
            @AuthenticationPrincipal String employeeId) {
        return ResponseEntity.ok(ApiResponse.success(evaluationService.getMyReviews(employeeId)));
    }
}
