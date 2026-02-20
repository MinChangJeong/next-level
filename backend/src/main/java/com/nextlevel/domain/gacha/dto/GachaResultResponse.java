package com.nextlevel.domain.gacha.dto;

import com.nextlevel.domain.gacha.GachaAttempt;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class GachaResultResponse {

    private Long attemptId;
    private int attemptNumber;
    private String goodsId;
    private String goodsName;
    private String goodsImageUrl;
    private int pointsSpent;
    private int remainingPoints;

    public static GachaResultResponse of(GachaAttempt attempt, int remainingPoints) {
        return GachaResultResponse.builder()
                .attemptId(attempt.getAttemptId())
                .attemptNumber(attempt.getAttemptNumber())
                .goodsId(attempt.getGoods().getGoodsId())
                .goodsName(attempt.getGoods().getName())
                .goodsImageUrl(attempt.getGoods().getImageUrl())
                .pointsSpent(attempt.getPointsSpent())
                .remainingPoints(remainingPoints)
                .build();
    }
}
