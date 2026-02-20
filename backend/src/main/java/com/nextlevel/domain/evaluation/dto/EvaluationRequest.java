package com.nextlevel.domain.evaluation.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class EvaluationRequest {

    @Min(1) @Max(5)
    private int scoreFirst;

    @Min(1) @Max(5)
    private int scoreBest;

    @Min(1) @Max(5)
    private int scoreDiff;

    @Min(1) @Max(5)
    private int scoreNo1;

    @Min(1) @Max(5)
    private int scoreGap;

    @Min(1) @Max(5)
    private int scoreGlobal;
}
