package com.nextlevel.domain.evaluation;

import com.nextlevel.domain.booth.Booth;
import com.nextlevel.domain.booth.BoothRepository;
import com.nextlevel.domain.evaluation.dto.EvaluationRequest;
import com.nextlevel.domain.evaluation.dto.ReviewRequest;
import com.nextlevel.domain.evaluation.dto.ReviewResponse;
import com.nextlevel.domain.mission.MissionService;
import com.nextlevel.domain.user.User;
import com.nextlevel.domain.user.UserRepository;
import com.nextlevel.domain.visit.BoothVisitRepository;
import com.nextlevel.exception.BusinessException;
import com.nextlevel.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EvaluationService {

    private final EvaluationRepository evaluationRepository;
    private final ReviewRepository reviewRepository;
    private final BoothRepository boothRepository;
    private final UserRepository userRepository;
    private final BoothVisitRepository boothVisitRepository;
    private final MissionService missionService;

    @Transactional
    public void submitEvaluation(String boothId, String employeeId, EvaluationRequest request) {
        // 방문 확인
        if (!boothVisitRepository.existsByBoothBoothIdAndUserEmployeeId(boothId, employeeId)) {
            throw new BusinessException("부스를 먼저 방문해야 합니다.", HttpStatus.FORBIDDEN, "VISIT_REQUIRED");
        }
        // 중복 평가 확인
        if (evaluationRepository.existsByBoothBoothIdAndUserEmployeeId(boothId, employeeId)) {
            throw new BusinessException("이미 평가한 부스입니다.", HttpStatus.CONFLICT, "EVAL_DUPLICATE");
        }

        Booth booth = boothRepository.findById(boothId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 부스입니다."));
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        int total = request.getScoreFirst() + request.getScoreBest() + request.getScoreDiff()
                + request.getScoreNo1() + request.getScoreGap() + request.getScoreGlobal();

        Evaluation evaluation = Evaluation.builder()
                .booth(booth)
                .user(user)
                .scoreFirst(request.getScoreFirst())
                .scoreBest(request.getScoreBest())
                .scoreDiff(request.getScoreDiff())
                .scoreNo1(request.getScoreNo1())
                .scoreGap(request.getScoreGap())
                .scoreGlobal(request.getScoreGlobal())
                .totalScore(total)
                .build();
        evaluationRepository.save(evaluation);
    }

    @Transactional
    public ReviewResponse submitReview(String boothId, String employeeId, ReviewRequest request) {
        Booth booth = boothRepository.findById(boothId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 부스입니다."));
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        Review review = Review.builder()
                .booth(booth)
                .user(user)
                .content(request.getContent())
                .build();
        reviewRepository.save(review);

        int reviewCount = reviewRepository.countByUserEmployeeId(employeeId);
        missionService.onReviewAdded(employeeId, reviewCount);

        return ReviewResponse.of(review);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getMyReviews(String employeeId) {
        return reviewRepository.findByUserEmployeeIdOrderByCreatedAtDesc(employeeId)
                .stream().map(ReviewResponse::of).toList();
    }
}
