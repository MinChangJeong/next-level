package com.nextlevel.domain.user;

import com.nextlevel.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class User extends BaseTimeEntity {

    @Id
    @Column(name = "employee_id", length = 20)
    private String employeeId;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    @Builder.Default
    private int totalPoints = 0;

    @Column(nullable = false)
    @Builder.Default
    private int missionsCompleted = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private Role role = Role.USER;

    public enum Role {
        USER, ADMIN
    }

    public void addPoints(int points) {
        this.totalPoints += points;
    }

    public void deductPoints(int points) {
        if (this.totalPoints < points) {
            throw new IllegalStateException("포인트가 부족합니다.");
        }
        this.totalPoints -= points;
    }

    public void incrementMissionsCompleted() {
        this.missionsCompleted++;
    }
}
