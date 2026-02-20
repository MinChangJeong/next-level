package com.nextlevel.init;

import com.nextlevel.domain.booth.Booth;
import com.nextlevel.domain.booth.BoothRepository;
import com.nextlevel.domain.gacha.Goods;
import com.nextlevel.domain.gacha.GoodsRepository;
import com.nextlevel.domain.user.User;
import com.nextlevel.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final BoothRepository boothRepository;
    private final GoodsRepository goodsRepository;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedUsers();
        seedBooths();
        seedGoods();
        log.info("✅ 초기 데이터 로드 완료");
    }

    private void seedUsers() {
        if (userRepository.count() > 0) return;

        userRepository.saveAll(List.of(
                User.builder().employeeId("ADMIN").name("관리자").role(User.Role.ADMIN).build(),
                User.builder().employeeId("E001").name("김철수").build(),
                User.builder().employeeId("E002").name("이영희").build(),
                User.builder().employeeId("E003").name("박민수").build(),
                User.builder().employeeId("E004").name("최지은").build(),
                User.builder().employeeId("E005").name("정수현").build(),
                User.builder().employeeId("E006").name("강동원").build(),
                User.builder().employeeId("E007").name("윤서연").build(),
                User.builder().employeeId("E008").name("임재원").build()
        ));
        log.info("✅ 사용자 시드 완료");
    }

    private void seedBooths() {
        if (boothRepository.count() > 0) return;

        boothRepository.saveAll(List.of(
                // B1F - 손복남 홀
                Booth.builder()
                        .boothId("BOOTH-01")
                        .name("AI 스마트 물류 최적화")
                        .shortDescription("AI로 물류 비용 30% 절감")
                        .longDescription("인공지능 기반 실시간 경로 최적화 시스템으로 물류 비용을 혁신적으로 절감합니다. 머신러닝 알고리즘을 활용해 배송 경로와 재고를 자동 최적화합니다.")
                        .onlyoneValue("AI 기반 자동화로 업계 최초 실시간 물류 최적화 달성")
                        .zone("HALL")
                        .floor("B1F")
                        .ownerEmployeeId("E001")
                        .build(),

                Booth.builder()
                        .boothId("BOOTH-02")
                        .name("탄소중립 스마트팩토리")
                        .shortDescription("제조 현장의 탄소 배출 제로 도전")
                        .longDescription("재생에너지와 에너지 저장 시스템을 결합해 공장 탄소 배출을 실질적으로 제로로 만드는 솔루션입니다. IoT 센서로 에너지 사용을 실시간 모니터링합니다.")
                        .onlyoneValue("국내 최고 수준의 탄소중립 제조 공정 기술 보유")
                        .zone("HALL")
                        .floor("B1F")
                        .ownerEmployeeId("E002")
                        .build(),

                // B1F - L01 (도전존)
                Booth.builder()
                        .boothId("BOOTH-03")
                        .name("디지털 헬스케어 플랫폼")
                        .shortDescription("개인 맞춤형 건강 관리 솔루션")
                        .longDescription("웨어러블 기기와 AI를 연동해 개인화된 건강 관리 서비스를 제공합니다. 실시간 건강 데이터 분석으로 질병 예방과 조기 진단을 지원합니다.")
                        .onlyoneValue("개인 유전체 데이터 기반 차별화된 헬스케어 서비스")
                        .zone("L01")
                        .floor("B1F")
                        .ownerEmployeeId("E003")
                        .build(),

                Booth.builder()
                        .boothId("BOOTH-04")
                        .name("메타버스 교육 솔루션")
                        .shortDescription("가상현실로 만드는 몰입형 학습 경험")
                        .longDescription("VR/AR 기술을 교육에 접목해 학습 효율을 극대화합니다. 실험, 역사 체험, 언어 학습 등 다양한 분야에서 실제처럼 느껴지는 교육 콘텐츠를 제공합니다.")
                        .onlyoneValue("몰입도 95% 달성, 기존 교육 대비 학습 효율 3배 향상")
                        .zone("L01")
                        .floor("B1F")
                        .ownerEmployeeId("E004")
                        .build(),

                Booth.builder()
                        .boothId("BOOTH-05")
                        .name("블록체인 공급망 투명화")
                        .shortDescription("원산지부터 소비자까지 완전 투명한 공급망")
                        .longDescription("블록체인 기술로 제품의 생산부터 소비까지 전 과정을 투명하게 추적합니다. 위변조 불가능한 데이터로 소비자 신뢰와 기업 가치를 높입니다.")
                        .onlyoneValue("식품·의약품 이력 추적 분야 글로벌 최고 수준 구현")
                        .zone("L01")
                        .floor("B1F")
                        .ownerEmployeeId("E005")
                        .build(),

                // B1F - L02 (창의존)
                Booth.builder()
                        .boothId("BOOTH-06")
                        .name("친환경 패키징 혁신")
                        .shortDescription("100% 생분해 소재로 만드는 미래 포장재")
                        .longDescription("해조류와 농업 부산물을 원료로 100% 생분해 가능한 포장재를 개발했습니다. 기존 플라스틱 대비 동일한 내구성을 유지하면서 환경 부담을 제로로 만듭니다.")
                        .onlyoneValue("해조류 기반 생분해 포장재, 업계 최초 상용화 달성")
                        .zone("L02")
                        .floor("B1F")
                        .ownerEmployeeId("E006")
                        .build(),

                Booth.builder()
                        .boothId("BOOTH-07")
                        .name("AI 고객 경험 혁신")
                        .shortDescription("AI가 예측하는 개인 맞춤 쇼핑 경험")
                        .longDescription("고객 행동 패턴을 분석해 개인화된 추천과 서비스를 제공합니다. 실시간 감정 인식 AI로 고객 만족도를 높이고 이탈률을 획기적으로 줄입니다.")
                        .onlyoneValue("감정 인식 AI로 고객 만족도 업계 최고 수준 달성")
                        .zone("L02")
                        .floor("B1F")
                        .ownerEmployeeId("E007")
                        .build(),

                // 1F - 101
                Booth.builder()
                        .boothId("BOOTH-08")
                        .name("스마트 빌딩 에너지 관리")
                        .shortDescription("IoT로 건물 에너지 소비 40% 절감")
                        .longDescription("IoT 센서와 AI 분석으로 건물 내 에너지 소비를 실시간으로 최적화합니다. 조명, 냉난방, 전력 시스템을 통합 관리해 운영 비용을 대폭 절감합니다.")
                        .onlyoneValue("빌딩 에너지 절감 분야 국내 최고 기술력 보유")
                        .zone("101")
                        .floor("1F")
                        .ownerEmployeeId("E008")
                        .build(),

                Booth.builder()
                        .boothId("BOOTH-09")
                        .name("자율주행 물류 로봇")
                        .shortDescription("창고 물류 자동화의 새로운 기준")
                        .longDescription("실내 자율주행 기술로 창고 내 물류를 완전 자동화합니다. 장애물 회피, 협동 작업, 실시간 경로 재계획 기능으로 24시간 무중단 운영이 가능합니다.")
                        .onlyoneValue("창고 물류 자동화 효율 업계 최고, ROI 180% 달성")
                        .zone("101")
                        .floor("1F")
                        .build(),

                Booth.builder()
                        .boothId("BOOTH-10")
                        .name("차세대 배터리 기술")
                        .shortDescription("전기차 주행거리 2배 연장 배터리")
                        .longDescription("신소재 전극과 전해질 기술로 에너지 밀도를 2배 향상시킨 차세대 배터리를 개발했습니다. 충전 시간은 30% 단축하고 수명은 50% 연장했습니다.")
                        .onlyoneValue("차세대 배터리 에너지 밀도 세계 최고 수준 달성")
                        .zone("101")
                        .floor("1F")
                        .build(),

                // 1F - 102
                Booth.builder()
                        .boothId("BOOTH-11")
                        .name("스마트 농업 플랫폼")
                        .shortDescription("데이터 기반 정밀 농업으로 수확량 50% 증가")
                        .longDescription("드론, IoT 센서, AI 분석을 통합한 스마트 농업 플랫폼입니다. 토양 상태, 날씨, 작물 성장을 실시간 모니터링해 최적의 재배 환경을 자동으로 유지합니다.")
                        .onlyoneValue("정밀 농업 데이터 분석 분야 국내 최고 수준 플랫폼")
                        .zone("102")
                        .floor("1F")
                        .build(),

                Booth.builder()
                        .boothId("BOOTH-12")
                        .name("사이버보안 제로 트러스트")
                        .shortDescription("모든 접근을 검증하는 차세대 보안 아키텍처")
                        .longDescription("기존 경계 보안을 탈피한 제로 트러스트 아키텍처로 내부 위협을 원천 차단합니다. AI 기반 이상 행위 탐지로 보안 사고를 99% 예방합니다.")
                        .onlyoneValue("제로 트러스트 구현 분야 국내 최고 기술 및 레퍼런스")
                        .zone("102")
                        .floor("1F")
                        .build()
        ));
        log.info("✅ 부스 시드 완료");
    }

    private void seedGoods() {
        if (goodsRepository.count() > 0) return;

        goodsRepository.saveAll(List.of(
                Goods.builder()
                        .goodsId("GOODS-01")
                        .name("하고잡이 텀블러")
                        .totalStock(150)
                        .remainingStock(150)
                        .unitPrice(5000)
                        .build(),
                Goods.builder()
                        .goodsId("GOODS-02")
                        .name("하고잡이 에코백")
                        .totalStock(150)
                        .remainingStock(150)
                        .unitPrice(5000)
                        .build(),
                Goods.builder()
                        .goodsId("GOODS-03")
                        .name("하고잡이 노트")
                        .totalStock(150)
                        .remainingStock(150)
                        .unitPrice(5000)
                        .build(),
                Goods.builder()
                        .goodsId("GOODS-04")
                        .name("하고잡이 스티커 팩")
                        .totalStock(150)
                        .remainingStock(150)
                        .unitPrice(5000)
                        .build()
        ));
        log.info("✅ 굿즈 시드 완료");
    }
}
