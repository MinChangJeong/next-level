package com.nextlevel.domain.comment;

import com.nextlevel.domain.booth.Booth;
import com.nextlevel.domain.booth.BoothRepository;
import com.nextlevel.domain.comment.dto.CommentRequest;
import com.nextlevel.domain.comment.dto.CommentResponse;
import com.nextlevel.domain.mission.MissionService;
import com.nextlevel.domain.user.User;
import com.nextlevel.domain.user.UserRepository;
import com.nextlevel.exception.BusinessException;
import com.nextlevel.exception.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoothRepository boothRepository;
    private final UserRepository userRepository;
    private final MissionService missionService;

    @Transactional(readOnly = true)
    public List<CommentResponse> getComments(String boothId) {
        return commentRepository.findByBoothBoothIdOrderByCreatedAtDesc(boothId)
                .stream().map(CommentResponse::of).toList();
    }

    @Transactional
    public CommentResponse addComment(String boothId, String employeeId, CommentRequest request) {
        Booth booth = boothRepository.findById(boothId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 부스입니다."));
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        // 자신의 부스에는 제안 불가
        if (employeeId.equals(booth.getOwnerEmployeeId())) {
            throw new BusinessException("자신의 부스에는 제안을 남길 수 없습니다.", HttpStatus.BAD_REQUEST, "COMMENT_OWN_BOOTH");
        }

        Comment comment = Comment.builder()
                .booth(booth)
                .user(user)
                .suggestion(request.getSuggestion())
                .expectedEffect(request.getExpectedEffect())
                .build();
        commentRepository.save(comment);

        // 미션1 진행도 업데이트
        missionService.onCommentAdded(employeeId);

        return CommentResponse.of(comment);
    }
}
