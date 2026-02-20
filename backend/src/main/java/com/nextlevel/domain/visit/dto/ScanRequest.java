package com.nextlevel.domain.visit.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ScanRequest {

    @NotBlank(message = "QR 토큰이 필요합니다.")
    private String qrToken;

    @NotBlank(message = "부스 ID가 필요합니다.")
    private String boothId;
}
