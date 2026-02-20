package com.nextlevel.domain.mission;

import com.nextlevel.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_missions",
        uniqueConstraints = @UniqueConstraint(columnNames = {"employee_id", "mission_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserMission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 10)
    private String missionId;  // M1~M5

    @Column(nullable = false)
    @Builder.Default
    private boolean isUnlocked = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean isCompleted = false;

    @Column(nullable = false)
    @Builder.Default
    private int progress = 0;

    @Column(nullable = false)
    @Builder.Default
    private int target = 1;

    private LocalDateTime unlockedAt;
    private LocalDateTime completedAt;

    public void unlock() {
        if (!this.isUnlocked) {
            this.isUnlocked = true;
            this.unlockedAt = LocalDateTime.now();
        }
    }

    public void incrementProgress() {
        if (!this.isCompleted) {
            this.progress++;
            if (this.progress >= this.target) {
                complete();
            }
        }
    }

    public void complete() {
        if (!this.isCompleted) {
            this.isCompleted = true;
            this.completedAt = LocalDateTime.now();
        }
    }
}
