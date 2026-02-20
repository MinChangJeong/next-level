package com.nextlevel.domain.growth;

import com.nextlevel.domain.growth.dto.GrowthZoneRequest;
import com.nextlevel.domain.mission.MissionService;
import com.nextlevel.domain.user.User;
import com.nextlevel.domain.user.UserRepository;
import com.nextlevel.exception.BusinessException;
import com.nextlevel.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GrowthZoneService {

    private final GrowthZoneRepository growthZoneRepository;
    private final UserRepository userRepository;
    private final MissionService missionService;

    @Transactional
    public void complete(String employeeId, GrowthZoneRequest request) {
        if (growthZoneRepository.existsByUserEmployeeId(employeeId)) {
            throw new BusinessException("이미 성장존을 완료했습니다.", HttpStatus.CONFLICT, "GROWTH_DUPLICATE");
        }

        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        GrowthZoneEntry entry = GrowthZoneEntry.builder()
                .user(user)
                .failureText(request.getFailureText())
                .growthText(request.getGrowthText())
                .slowLetter(request.getSlowLetter())
                .build();
        growthZoneRepository.save(entry);

        // 미션2 완료
        missionService.onGrowthZoneCompleted(employeeId);
    }

    @Transactional(readOnly = true)
    public boolean isCompleted(String employeeId) {
        return growthZoneRepository.existsByUserEmployeeId(employeeId);
    }
}
