package com.nextlevel.domain.evaluation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {

    boolean existsByBoothBoothIdAndUserEmployeeId(String boothId, String employeeId);

    Optional<Evaluation> findByBoothBoothIdAndUserEmployeeId(String boothId, String employeeId);

    // 1등 부스 선정: 각 유저의 최고 평가 부스를 집계
    @Query("""
        SELECT e.booth.boothId, COUNT(e) as voteCount
        FROM Evaluation e
        WHERE e.evalId IN (
            SELECT MAX(e2.evalId) FROM Evaluation e2
            WHERE e2.totalScore = (
                SELECT MAX(e3.totalScore) FROM Evaluation e3
                WHERE e3.user.employeeId = e2.user.employeeId
            )
            AND e2.user.employeeId = e.user.employeeId
        )
        GROUP BY e.booth.boothId
        ORDER BY voteCount DESC
        """)
    List<Object[]> findBoothRanking();
}
