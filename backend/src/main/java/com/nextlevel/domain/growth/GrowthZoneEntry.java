package com.nextlevel.domain.growth;

import com.nextlevel.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "growth_zone_entries")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class GrowthZoneEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long entryId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String failureText;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String growthText;

    @Column(columnDefinition = "TEXT")
    private String slowLetter;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime completedAt = LocalDateTime.now();
}
