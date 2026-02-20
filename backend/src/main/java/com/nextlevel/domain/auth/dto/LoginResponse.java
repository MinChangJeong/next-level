package com.nextlevel.domain.auth.dto;

import com.nextlevel.domain.user.User;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class LoginResponse {

    private String token;
    private String employeeId;
    private String name;
    private int totalPoints;
    private int missionsCompleted;
    private String role;

    public static LoginResponse of(String token, User user) {
        return LoginResponse.builder()
                .token(token)
                .employeeId(user.getEmployeeId())
                .name(user.getName())
                .totalPoints(user.getTotalPoints())
                .missionsCompleted(user.getMissionsCompleted())
                .role(user.getRole().name())
                .build();
    }
}
