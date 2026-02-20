package com.nextlevel.domain.point;

import com.nextlevel.common.ApiResponse;
import com.nextlevel.domain.auth.dto.LoginResponse;
import com.nextlevel.domain.user.User;
import com.nextlevel.domain.user.UserRepository;
import com.nextlevel.exception.BusinessException;
import com.nextlevel.exception.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/points")
@RequiredArgsConstructor
public class PointController {

    private final UserRepository userRepository;

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PointBalance>> getMyPoints(@AuthenticationPrincipal String employeeId) {
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));
        return ResponseEntity.ok(ApiResponse.success(new PointBalance(user.getTotalPoints())));
    }

    @PostMapping("/deduct")
    @Transactional
    public ResponseEntity<ApiResponse<PointBalance>> deductPoints(
            @AuthenticationPrincipal String employeeId,
            @Valid @RequestBody DeductRequest request) {
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        if (user.getTotalPoints() < request.getAmount()) {
            throw new BusinessException("포인트가 부족합니다.", HttpStatus.BAD_REQUEST, "POINT_INSUFFICIENT");
        }
        user.deductPoints(request.getAmount());
        userRepository.save(user);
        return ResponseEntity.ok(ApiResponse.success(new PointBalance(user.getTotalPoints())));
    }

    @Getter
    @NoArgsConstructor
    public static class DeductRequest {
        private int amount;
    }

    public record PointBalance(int totalPoints) {}
}
