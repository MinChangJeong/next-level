package com.nextlevel.domain.growth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class GrowthZoneRequest {

    private String failureText;

    @NotBlank(message = "성장 문구를 입력해주세요.")
    private String growthText;

    private String slowLetter;
}
