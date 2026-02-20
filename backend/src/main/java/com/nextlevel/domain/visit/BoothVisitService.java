package com.nextlevel.domain.visit;

import com.nextlevel.domain.booth.Booth;
import com.nextlevel.domain.booth.BoothRepository;
import com.nextlevel.domain.mission.MissionService;
import com.nextlevel.domain.user.User;
import com.nextlevel.domain.user.UserRepository;
import com.nextlevel.domain.visit.dto.QrResponse;
import com.nextlevel.domain.visit.dto.ScanRequest;
import com.nextlevel.domain.visit.dto.VisitResponse;
import com.nextlevel.exception.BusinessException;
import com.nextlevel.exception.EntityNotFoundException;
import com.nextlevel.security.JwtTokenProvider;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BoothVisitService {

    private final BoothVisitRepository boothVisitRepository;
    private final BoothRepository boothRepository;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final MissionService missionService;

    public QrResponse generateQr(String employeeId) {
        String qrToken = jwtTokenProvider.generateQrToken(employeeId);
        return QrResponse.builder()
                .qrToken(qrToken)
                .employeeId(employeeId)
                .expiresAt(System.currentTimeMillis() + 600_000L)
                .build();
    }

    @Transactional
    public VisitResponse scan(ScanRequest request) {
        // QR 토큰 검증
        String employeeId;
        try {
            employeeId = jwtTokenProvider.getQrEmployeeId(request.getQrToken());
        } catch (JwtException e) {
            throw new BusinessException("유효하지 않거나 만료된 QR 코드입니다.", HttpStatus.BAD_REQUEST, "QR_INVALID");
        }

        Booth booth = boothRepository.findById(request.getBoothId())
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 부스입니다."));
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        // 중복 방문 확인
        if (boothVisitRepository.existsByBoothBoothIdAndUserEmployeeId(request.getBoothId(), employeeId)) {
            throw new BusinessException("이미 방문한 부스입니다.", HttpStatus.CONFLICT, "VISIT_DUPLICATE");
        }

        BoothVisit visit = BoothVisit.builder()
                .booth(booth)
                .user(user)
                .status(BoothVisit.VisitStatus.FINISHED)
                .visitedAt(LocalDateTime.now())
                .pointsEarned(10)
                .build();
        boothVisitRepository.save(visit);

        // 부스 방문자 수 증가
        booth.incrementVisitorCount();
        boothRepository.save(booth);

        // 포인트 지급
        user.addPoints(10);
        userRepository.save(user);

        // 부스 소유자의 미션3 체크
        if (booth.getOwnerEmployeeId() != null) {
            missionService.onBoothVisitCountUpdated(booth.getOwnerEmployeeId(), booth.getVisitorCount());
        }

        return VisitResponse.of(visit);
    }

    @Transactional(readOnly = true)
    public List<VisitResponse> getMyVisits(String employeeId) {
        return boothVisitRepository.findByUserEmployeeIdOrderByVisitedAtDesc(employeeId)
                .stream().map(VisitResponse::of).toList();
    }

    @Transactional(readOnly = true)
    public VisitResponse getLatestVisit(String employeeId) {
        return boothVisitRepository.findTopByUserEmployeeIdOrderByVisitedAtDesc(employeeId)
                .map(VisitResponse::of)
                .orElse(null);
    }
}
