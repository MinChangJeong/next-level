package com.nextlevel.domain.visit;

import com.nextlevel.domain.booth.Booth;
import com.nextlevel.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "booth_visits",
        uniqueConstraints = @UniqueConstraint(columnNames = {"booth_id", "user_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class BoothVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long visitId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booth_id", nullable = false)
    private Booth booth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private VisitStatus status = VisitStatus.FINISHED;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime visitedAt = LocalDateTime.now();

    @Column(nullable = false)
    @Builder.Default
    private int pointsEarned = 10;

    public enum VisitStatus {
        WAITING, FINISHED
    }
}
