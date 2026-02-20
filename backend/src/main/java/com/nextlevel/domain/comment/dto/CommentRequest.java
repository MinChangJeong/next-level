package com.nextlevel.domain.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class CommentRequest {

    @NotBlank(message = "제안 사항을 입력해주세요.")
    @Size(max = 150, message = "제안 사항은 150자 이내로 입력해주세요.")
    private String suggestion;

    @NotBlank(message = "기대 효과를 입력해주세요.")
    @Size(max = 50, message = "기대 효과는 50자 이내로 입력해주세요.")
    private String expectedEffect;
}
