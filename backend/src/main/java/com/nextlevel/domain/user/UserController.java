package com.nextlevel.domain.user;

import com.nextlevel.common.ApiResponse;
import com.nextlevel.domain.auth.dto.LoginResponse;
import com.nextlevel.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<LoginResponse>> getMe(@AuthenticationPrincipal String employeeId) {
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));
        return ResponseEntity.ok(ApiResponse.success(LoginResponse.of(null, user)));
    }
}
