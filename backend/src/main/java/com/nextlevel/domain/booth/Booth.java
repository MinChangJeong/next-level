package com.nextlevel.domain.booth;

import com.nextlevel.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "booths")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Booth extends BaseTimeEntity {

    @Id
    @Column(name = "booth_id", length = 20)
    private String boothId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 200)
    private String shortDescription;

    @Column(columnDefinition = "TEXT")
    private String longDescription;

    @Column(length = 50)
    private String onlyoneValue;

    @Column(length = 500)
    private String imageUrl;

    @Column(nullable = false, length = 20)
    private String zone;

    @Column(nullable = false, length = 10)
    private String floor;

    @Column(nullable = false)
    @Builder.Default
    private int visitorCount = 0;

    // 부스 소유자 (사번) - 미션3(반드시 결과로) 용
    @Column(length = 20)
    private String ownerEmployeeId;

    public void incrementVisitorCount() {
        this.visitorCount++;
    }
}
