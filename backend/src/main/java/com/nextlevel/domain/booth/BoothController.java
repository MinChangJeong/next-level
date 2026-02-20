package com.nextlevel.domain.booth;

import com.nextlevel.common.ApiResponse;
import com.nextlevel.domain.booth.dto.BoothDetailResponse;
import com.nextlevel.domain.booth.dto.BoothResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/booths")
@RequiredArgsConstructor
public class BoothController {

    private final BoothService boothService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BoothResponse>>> getAllBooths(
            @AuthenticationPrincipal String employeeId) {
        return ResponseEntity.ok(ApiResponse.success(boothService.getAllBooths(employeeId)));
    }

    @GetMapping("/zone/{zoneId}")
    public ResponseEntity<ApiResponse<List<BoothResponse>>> getBoothsByZone(
            @PathVariable String zoneId,
            @AuthenticationPrincipal String employeeId) {
        return ResponseEntity.ok(ApiResponse.success(boothService.getBoothsByZone(zoneId, employeeId)));
    }

    @GetMapping("/{boothId}")
    public ResponseEntity<ApiResponse<BoothDetailResponse>> getBoothDetail(
            @PathVariable String boothId,
            @AuthenticationPrincipal String employeeId) {
        return ResponseEntity.ok(ApiResponse.success(boothService.getBoothDetail(boothId, employeeId)));
    }
}
