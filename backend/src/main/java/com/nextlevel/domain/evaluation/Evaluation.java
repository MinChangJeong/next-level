package com.nextlevel.domain.evaluation;

import com.nextlevel.common.BaseTimeEntity;
import com.nextlevel.domain.booth.Booth;
import com.nextlevel.domain.user.User;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "evaluations",
        uniqueConstraints = @UniqueConstraint(columnNames = {"booth_id", "user_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Evaluation extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long evalId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booth_id", nullable = false)
    private Booth booth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private int scoreFirst;    // 최초

    @Column(nullable = false)
    private int scoreBest;     // 최고

    @Column(nullable = false)
    private int scoreDiff;     // 차별화

    @Column(nullable = false)
    private int scoreNo1;      // 일등

    @Column(nullable = false)
    private int scoreGap;      // 초격차

    @Column(nullable = false)
    private int scoreGlobal;   // 글로벌

    @Column(nullable = false)
    private int totalScore;
}
