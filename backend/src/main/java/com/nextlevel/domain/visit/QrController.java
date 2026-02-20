package com.nextlevel.domain.visit;

import com.nextlevel.common.ApiResponse;
import com.nextlevel.domain.visit.dto.QrResponse;
import com.nextlevel.domain.visit.dto.ScanRequest;
import com.nextlevel.domain.visit.dto.VisitResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class QrController {

    private final BoothVisitService boothVisitService;

    @GetMapping("/qr/my")
    public ResponseEntity<ApiResponse<QrResponse>> getMyQr(
            @AuthenticationPrincipal String employeeId) {
        return ResponseEntity.ok(ApiResponse.success(boothVisitService.generateQr(employeeId)));
    }

    @PostMapping("/visits/scan")
    public ResponseEntity<ApiResponse<VisitResponse>> scan(
            @Valid @RequestBody ScanRequest request) {
        return ResponseEntity.ok(ApiResponse.success(boothVisitService.scan(request)));
    }

    @GetMapping("/visits/my")
    public ResponseEntity<ApiResponse<?>> getMyVisits(
            @AuthenticationPrincipal String employeeId) {
        return ResponseEntity.ok(ApiResponse.success(boothVisitService.getMyVisits(employeeId)));
    }

    @GetMapping("/visits/my/latest")
    public ResponseEntity<ApiResponse<VisitResponse>> getLatestVisit(
            @AuthenticationPrincipal String employeeId) {
        return ResponseEntity.ok(ApiResponse.success(boothVisitService.getLatestVisit(employeeId)));
    }
}
