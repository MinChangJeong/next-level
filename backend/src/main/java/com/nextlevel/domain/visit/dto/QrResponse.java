package com.nextlevel.domain.visit.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class QrResponse {

    private String qrToken;
    private String employeeId;
    private long expiresAt;  // epoch millis
}
