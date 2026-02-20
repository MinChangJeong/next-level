package com.nextlevel.domain.evaluation.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ReviewRequest {

    @NotBlank(message = "리뷰 내용을 입력해주세요.")
    @Size(min = 30, message = "리뷰는 최소 30자 이상 작성해주세요.")
    private String content;
}
