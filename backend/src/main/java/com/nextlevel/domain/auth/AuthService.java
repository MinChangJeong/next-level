package com.nextlevel.domain.auth;

import com.nextlevel.domain.auth.dto.LoginRequest;
import com.nextlevel.domain.auth.dto.LoginResponse;
import com.nextlevel.domain.mission.UserMission;
import com.nextlevel.domain.mission.UserMissionRepository;
import com.nextlevel.domain.user.User;
import com.nextlevel.domain.user.UserRepository;
import com.nextlevel.exception.BusinessException;
import com.nextlevel.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final UserMissionRepository userMissionRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmployeeIdAndName(request.getEmployeeId(), request.getName())
                .orElseThrow(() -> new BusinessException(
                        "등록되지 않은 사번이거나 이름이 일치하지 않습니다.",
                        HttpStatus.UNAUTHORIZED,
                        "AUTH_INVALID"
                ));

        // 미션이 초기화되지 않은 경우 초기화
        initMissionsIfNeeded(user);

        String token = jwtTokenProvider.generateToken(user.getEmployeeId(), user.getRole().name());
        return LoginResponse.of(token, user);
    }

    private void initMissionsIfNeeded(User user) {
        List<UserMission> missions = userMissionRepository.findByUserEmployeeIdOrderByMissionId(user.getEmployeeId());
        if (!missions.isEmpty()) return;

        // 미션 초기 생성: M1, M2는 공개, M3~M5는 잠금
        userMissionRepository.saveAll(List.of(
                UserMission.builder().user(user).missionId("M1").isUnlocked(true).target(1).build(),
                UserMission.builder().user(user).missionId("M2").isUnlocked(true).target(1).build(),
                UserMission.builder().user(user).missionId("M3").isUnlocked(false).target(1).build(),
                UserMission.builder().user(user).missionId("M4").isUnlocked(false).target(2).build(),
                UserMission.builder().user(user).missionId("M5").isUnlocked(false).target(12).build()
        ));
    }
}
