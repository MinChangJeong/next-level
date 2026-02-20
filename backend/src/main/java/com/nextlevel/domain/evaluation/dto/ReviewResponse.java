package com.nextlevel.domain.evaluation.dto;

import com.nextlevel.domain.evaluation.Review;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewResponse {

    private Long reviewId;
    private String boothId;
    private String boothName;
    private String content;
    private LocalDateTime createdAt;

    public static ReviewResponse of(Review review) {
        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .boothId(review.getBooth().getBoothId())
                .boothName(review.getBooth().getName())
                .content(review.getContent())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
