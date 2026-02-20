package com.nextlevel.domain.mission;

import com.nextlevel.common.ApiResponse;
import com.nextlevel.domain.mission.dto.MissionResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/missions")
@RequiredArgsConstructor
public class MissionController {

    private final MissionService missionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<MissionResponse>>> getMissions(
            @AuthenticationPrincipal String employeeId) {
        return ResponseEntity.ok(ApiResponse.success(missionService.getMissions(employeeId)));
    }

    @PostMapping("/{missionId}/complete")
    public ResponseEntity<ApiResponse<Void>> completeMission(
            @PathVariable String missionId,
            @AuthenticationPrincipal String employeeId) {
        missionService.completeMission(employeeId, missionId);
        return ResponseEntity.ok(ApiResponse.success());
    }
}
