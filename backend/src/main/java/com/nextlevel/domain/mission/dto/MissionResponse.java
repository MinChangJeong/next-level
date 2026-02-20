package com.nextlevel.domain.mission.dto;

import com.nextlevel.domain.mission.UserMission;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class MissionResponse {

    private String missionId;
    private String title;
    private String description;
    private boolean isUnlocked;
    private boolean isCompleted;
    private int progress;
    private int target;
    private LocalDateTime unlockedAt;
    private LocalDateTime completedAt;

    public static MissionResponse of(UserMission mission) {
        String title = getMissionTitle(mission.getMissionId());
        String description = mission.isUnlocked()
                ? getMissionDescription(mission.getMissionId())
                : "???";

        return MissionResponse.builder()
                .missionId(mission.getMissionId())
                .title(title)
                .description(description)
                .isUnlocked(mission.isUnlocked())
                .isCompleted(mission.isCompleted())
                .progress(mission.getProgress())
                .target(mission.getTarget())
                .unlockedAt(mission.getUnlockedAt())
                .completedAt(mission.getCompletedAt())
                .build();
    }

    private static String getMissionTitle(String missionId) {
        return switch (missionId) {
            case "M1" -> "내일 더 새롭게";
            case "M2" -> "꿈을 원대하게";
            case "M3" -> "반드시 결과로";
            case "M4" -> "안돼도 다시";
            case "M5" -> "진정성 있게";
            default -> "???";
        };
    }

    private static String getMissionDescription(String missionId) {
        return switch (missionId) {
            case "M1" -> "타 부스 아이디어에 개선 제안을 남겨보세요.";
            case "M2" -> "성장 ZONE을 체험하고 QR을 스캔하세요.";
            case "M3" -> "내 부스에 70명 이상이 방문하면 달성!";
            case "M4" -> "가챠에 2회 도전하세요.";
            case "M5" -> "12개의 진정성 있는 리뷰를 작성하세요.";
            default -> "???";
        };
    }
}
