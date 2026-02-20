package com.nextlevel.domain.mission;

import com.nextlevel.domain.mission.dto.MissionResponse;
import com.nextlevel.domain.user.User;
import com.nextlevel.domain.user.UserRepository;
import com.nextlevel.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class MissionService {

    private final UserMissionRepository userMissionRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<MissionResponse> getMissions(String employeeId) {
        return userMissionRepository.findByUserEmployeeIdOrderByMissionId(employeeId)
                .stream().map(MissionResponse::of).toList();
    }

    // 미션1: 내일 더 새롭게 - 댓글 1회
    @Transactional
    public void onCommentAdded(String employeeId) {
        updateMissionProgress(employeeId, "M1");
    }

    // 미션2: 꿈을 원대하게 - 성장존 QR
    @Transactional
    public void onGrowthZoneCompleted(String employeeId) {
        updateMissionProgress(employeeId, "M2");
    }

    // 미션3: 반드시 결과로 - 내 부스 방문 인원
    @Transactional
    public void onBoothVisitCountUpdated(String boothOwnerEmployeeId, int visitorCount) {
        Optional<UserMission> missionOpt = userMissionRepository
                .findByUserEmployeeIdAndMissionId(boothOwnerEmployeeId, "M3");
        if (missionOpt.isEmpty()) return;

        UserMission mission = missionOpt.get();
        if (visitorCount >= 30 && !mission.isUnlocked()) {
            mission.unlock();
        }
        if (visitorCount >= 70 && !mission.isCompleted()) {
            mission.complete();
            incrementUserMissionsCompleted(boothOwnerEmployeeId);
        }
    }

    // 미션4: 안돼도 다시 - 가챠 1~2회
    @Transactional
    public void onGachaAttempted(String employeeId, int attemptCount) {
        Optional<UserMission> missionOpt = userMissionRepository
                .findByUserEmployeeIdAndMissionId(employeeId, "M4");
        if (missionOpt.isEmpty()) return;

        UserMission mission = missionOpt.get();
        if (attemptCount >= 1 && !mission.isUnlocked()) {
            mission.unlock();
        }
        if (attemptCount >= 2 && !mission.isCompleted()) {
            mission.complete();
            incrementUserMissionsCompleted(employeeId);
        }
    }

    // 미션5: 진정성 있게 - 리뷰 1~12개
    @Transactional
    public void onReviewAdded(String employeeId, int reviewCount) {
        Optional<UserMission> missionOpt = userMissionRepository
                .findByUserEmployeeIdAndMissionId(employeeId, "M5");
        if (missionOpt.isEmpty()) return;

        UserMission mission = missionOpt.get();
        if (reviewCount >= 1 && !mission.isUnlocked()) {
            mission.unlock();
        }
        // progress 직접 설정
        if (!mission.isCompleted()) {
            // UserMission의 progress를 reviewCount로 동기화
            while (mission.getProgress() < reviewCount && !mission.isCompleted()) {
                mission.incrementProgress();
            }
            if (mission.isCompleted()) {
                incrementUserMissionsCompleted(employeeId);
            }
        }
    }

    private void updateMissionProgress(String employeeId, String missionId) {
        Optional<UserMission> missionOpt = userMissionRepository
                .findByUserEmployeeIdAndMissionId(employeeId, missionId);
        if (missionOpt.isEmpty()) return;

        UserMission mission = missionOpt.get();
        if (mission.isUnlocked() && !mission.isCompleted()) {
            mission.incrementProgress();
            if (mission.isCompleted()) {
                incrementUserMissionsCompleted(employeeId);
            }
        }
    }

    private void incrementUserMissionsCompleted(String employeeId) {
        userRepository.findById(employeeId).ifPresent(user -> {
            user.incrementMissionsCompleted();
            userRepository.save(user);
        });
    }

    @Transactional
    public void completeMission(String employeeId, String missionId) {
        UserMission mission = userMissionRepository
                .findByUserEmployeeIdAndMissionId(employeeId, missionId)
                .orElseThrow(() -> new EntityNotFoundException("미션을 찾을 수 없습니다."));

        if (mission.isUnlocked() && !mission.isCompleted()) {
            mission.complete();
            incrementUserMissionsCompleted(employeeId);
        }
    }
}
