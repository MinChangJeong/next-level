package com.nextlevel.domain.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class LoginRequest {

    @NotBlank(message = "사번을 입력해주세요.")
    private String employeeId;

    @NotBlank(message = "이름을 입력해주세요.")
    private String name;
}
