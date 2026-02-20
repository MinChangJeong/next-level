package com.nextlevel.domain.booth.dto;

import com.nextlevel.domain.booth.Booth;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class BoothResponse {

    private String boothId;
    private String name;
    private String shortDescription;
    private String imageUrl;
    private String zone;
    private String floor;
    private int visitorCount;
    private boolean visited;

    public static BoothResponse of(Booth booth, boolean visited) {
        return BoothResponse.builder()
                .boothId(booth.getBoothId())
                .name(booth.getName())
                .shortDescription(booth.getShortDescription())
                .imageUrl(booth.getImageUrl())
                .zone(booth.getZone())
                .floor(booth.getFloor())
                .visitorCount(booth.getVisitorCount())
                .visited(visited)
                .build();
    }
}
