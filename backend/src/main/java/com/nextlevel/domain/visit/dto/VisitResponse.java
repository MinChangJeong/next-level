package com.nextlevel.domain.visit.dto;

import com.nextlevel.domain.visit.BoothVisit;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class VisitResponse {

    private Long visitId;
    private String boothId;
    private String boothName;
    private int pointsEarned;
    private LocalDateTime visitedAt;

    public static VisitResponse of(BoothVisit visit) {
        return VisitResponse.builder()
                .visitId(visit.getVisitId())
                .boothId(visit.getBooth().getBoothId())
                .boothName(visit.getBooth().getName())
                .pointsEarned(visit.getPointsEarned())
                .visitedAt(visit.getVisitedAt())
                .build();
    }
}
