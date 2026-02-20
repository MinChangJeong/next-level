package com.nextlevel.domain.growth;

import com.nextlevel.common.ApiResponse;
import com.nextlevel.domain.growth.dto.GrowthZoneRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/growth-zone")
@RequiredArgsConstructor
public class GrowthZoneController {

    private final GrowthZoneService growthZoneService;

    @PostMapping("/complete")
    public ResponseEntity<ApiResponse<Void>> complete(
            @AuthenticationPrincipal String employeeId,
            @Valid @RequestBody GrowthZoneRequest request) {
        growthZoneService.complete(employeeId, request);
        return ResponseEntity.ok(ApiResponse.success());
    }

    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Boolean>> getStatus(
            @AuthenticationPrincipal String employeeId) {
        return ResponseEntity.ok(ApiResponse.success(growthZoneService.isCompleted(employeeId)));
    }
}
