package com.nextlevel.domain.gacha;

import com.nextlevel.domain.gacha.dto.GachaResultResponse;
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
import java.util.Random;

@Service
@RequiredArgsConstructor
public class GachaService {

    private static final int GACHA_COST = 40;
    private static final int MAX_ATTEMPTS = 2;

    private final GachaAttemptRepository gachaAttemptRepository;
    private final GoodsRepository goodsRepository;
    private final UserRepository userRepository;
    private final MissionService missionService;

    @Transactional
    public GachaResultResponse attempt(String employeeId) {
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));

        int attemptCount = gachaAttemptRepository.countByUserEmployeeId(employeeId);
        if (attemptCount >= MAX_ATTEMPTS) {
            throw new BusinessException("가챠는 최대 2회까지만 도전할 수 있습니다.", HttpStatus.BAD_REQUEST, "GACHA_MAX_REACHED");
        }

        if (user.getTotalPoints() < GACHA_COST) {
            throw new BusinessException("포인트가 부족합니다. (필요: " + GACHA_COST + "p)", HttpStatus.BAD_REQUEST, "POINT_INSUFFICIENT");
        }

        // 재고 있는 굿즈 중 랜덤 선택 (비관적 락)
        List<Goods> availableGoods = goodsRepository.findByRemainingStockGreaterThan(0);
        if (availableGoods.isEmpty()) {
            throw new BusinessException("모든 굿즈 재고가 소진되었습니다.", HttpStatus.CONFLICT, "GOODS_OUT_OF_STOCK");
        }

        Goods selectedGoods = availableGoods.get(new Random().nextInt(availableGoods.size()));
        // 락을 걸고 재고 차감
        Goods lockedGoods = goodsRepository.findByIdWithLock(selectedGoods.getGoodsId())
                .orElseThrow(() -> new EntityNotFoundException("굿즈를 찾을 수 없습니다."));
        lockedGoods.decreaseStock();

        // 포인트 차감
        user.deductPoints(GACHA_COST);
        userRepository.save(user);

        int newAttemptNumber = attemptCount + 1;
        GachaAttempt gachaAttempt = GachaAttempt.builder()
                .user(user)
                .goods(lockedGoods)
                .pointsSpent(GACHA_COST)
                .attemptNumber(newAttemptNumber)
                .build();
        gachaAttemptRepository.save(gachaAttempt);

        // 미션4 업데이트
        missionService.onGachaAttempted(employeeId, newAttemptNumber);

        return GachaResultResponse.of(gachaAttempt, user.getTotalPoints());
    }

    @Transactional(readOnly = true)
    public List<GachaResultResponse> getHistory(String employeeId) {
        User user = userRepository.findById(employeeId)
                .orElseThrow(() -> new EntityNotFoundException("존재하지 않는 사용자입니다."));
        return gachaAttemptRepository.findByUserEmployeeIdOrderByCreatedAtDesc(employeeId)
                .stream().map(a -> GachaResultResponse.of(a, user.getTotalPoints())).toList();
    }
}
