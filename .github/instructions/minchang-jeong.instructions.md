# CLAUDE.md - 프로젝트 개발 원칙 및 지시사항

> 이 문서는 Claude Code가 코드를 작성할 때 반드시 따라야 하는 규칙입니다.
> 모든 코드 생성, 수정, 리팩토링 시 아래 원칙을 준수하세요.

---

## 1. 객체지향적 코드 설계 (OOP Design)

### 핵심 원칙
- **SOLID 원칙**을 준수한다.
  - **S (Single Responsibility)**: 하나의 클래스는 하나의 책임만 가진다. 클래스가 변경되어야 하는 이유는 단 하나여야 한다.
  - **O (Open-Closed)**: 확장에는 열려있고 수정에는 닫혀있도록 설계한다. 새 기능 추가 시 기존 코드를 수정하지 않고 확장할 수 있어야 한다.
  - **L (Liskov Substitution)**: 하위 타입은 상위 타입을 대체할 수 있어야 한다.
  - **I (Interface Segregation)**: 클라이언트가 사용하지 않는 메서드에 의존하지 않도록 인터페이스를 분리한다.
  - **D (Dependency Inversion)**: 구체 클래스가 아닌 추상화(인터페이스)에 의존한다. 생성자 주입(Constructor Injection)을 기본으로 사용한다.

### 구체적 규칙
- 비즈니스 로직은 반드시 별도의 클래스/메서드로 캡슐화한다. Controller나 Handler에 비즈니스 로직을 직접 작성하지 않는다.
- 공통 기능은 상속보다 **합성(Composition)**을 우선 사용한다.
- 매직 넘버, 매직 스트링을 사용하지 않는다. 상수(enum 또는 static final)로 정의한다.
- God Object(하나의 클래스가 너무 많은 역할을 하는 것)를 만들지 않는다. 클래스의 메서드가 7개를 초과하면 분리를 검토한다.
- DTO(Data Transfer Object)와 Entity(Domain Model)를 명확히 분리한다. Entity를 API 응답으로 직접 노출하지 않는다.

---

## 2. Backend Layered Architecture

### 계층 구조
```
Controller (Presentation Layer)
    ↓
Service (Business Logic Layer)
    ↓
Repository (Data Access Layer)
```

### Controller (Presentation Layer)
- HTTP 요청/응답 처리만 담당한다.
- 요청 데이터의 기본 유효성 검증(Validation)을 수행한다. (`@Valid`, `@RequestBody` 등)
- 비즈니스 로직을 절대 포함하지 않는다. Service를 호출하고 결과를 반환하는 역할만 한다.
- 응답 형식은 통일된 Response DTO를 사용한다.
- 파일 구조: `controller/` 디렉토리에 위치한다.

```java
// ✅ 올바른 예시
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponseDto>> getUser(@PathVariable Long id) {
        UserResponseDto user = userService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(user));
    }
}

// ❌ 잘못된 예시 - Controller에 비즈니스 로직이 있음
@GetMapping("/{id}")
public ResponseEntity<?> getUser(@PathVariable Long id) {
    User user = userRepository.findById(id).orElse(null);
    if (user == null) { ... }
    // 이런 로직은 Service에 있어야 한다
}
```

### Service (Business Logic Layer)
- 모든 비즈니스 로직을 이 계층에서 처리한다.
- 인터페이스와 구현체를 분리한다. (`UserService` 인터페이스 + `UserServiceImpl` 구현체)
- 트랜잭션 관리는 Service 계층에서 수행한다. (`@Transactional`)
- 다른 Service를 주입받아 사용할 수 있으나, 순환 참조에 주의한다.
- 파일 구조: `service/` 디렉토리에 인터페이스와 `service/impl/` 디렉토리에 구현체를 위치시킨다.

```java
// 인터페이스
public interface UserService {
    UserResponseDto findById(Long id);
    UserResponseDto create(UserCreateRequestDto request);
}

// 구현체
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserResponseDto findById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다. ID: " + id));
        return UserResponseDto.from(user);
    }
}
```

### Repository (Data Access Layer)
- 데이터베이스 접근 로직만 담당한다.
- Spring Data JPA의 `JpaRepository`를 기본으로 사용한다.
- 복잡한 쿼리는 `@Query` 어노테이션 또는 QueryDSL을 사용한다.
- 파일 구조: `repository/` 디렉토리에 위치한다.

### 추가 디렉토리 규칙
```
src/main/java/com/project/
├── config/          # 설정 클래스 (SecurityConfig, WebConfig 등)
├── controller/      # REST Controller
├── service/         # Service 인터페이스
│   └── impl/        # Service 구현체
├── repository/      # JPA Repository
├── domain/          # Entity, Enum
├── dto/             # Request/Response DTO
│   ├── request/
│   └── response/
├── exception/       # 커스텀 예외 클래스 및 Global Exception Handler
├── common/          # 공통 유틸, 상수, 공통 응답 객체
└── security/        # 인증/인가 관련 (필요 시)
```

---

## 3. E2E JUnit 테스트 코드

### 필수 규칙
- **모든 API 엔드포인트**에 대해 E2E 테스트를 작성한다. 예외 없음.
- 새 API를 추가하면 반드시 해당 테스트 코드를 함께 작성한다. 테스트 없이 API를 완성된 것으로 간주하지 않는다.
- `@SpringBootTest` + `MockMvc` 또는 `TestRestTemplate`을 사용하여 실제 HTTP 요청/응답 흐름을 테스트한다.

### 테스트 작성 기준
각 API에 대해 최소한 다음 케이스를 포함한다:
- **정상 동작 (Happy Path)**: 올바른 입력에 대한 정상 응답 확인
- **유효성 검증 실패**: 잘못된 입력(null, 빈 문자열, 범위 초과 등)에 대한 400 응답 확인
- **존재하지 않는 리소스**: 404 응답 확인
- **인증/인가 실패** (해당되는 경우): 401/403 응답 확인

### 테스트 코드 구조
```java
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@Transactional  // 각 테스트 후 자동 롤백
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Nested
    @DisplayName("GET /api/v1/users/{id}")
    class GetUser {

        @Test
        @DisplayName("성공: 존재하는 사용자 조회 시 200과 사용자 정보를 반환한다")
        void shouldReturnUserWhenExists() throws Exception {
            // given
            // 테스트 데이터 준비

            // when & then
            mockMvc.perform(get("/api/v1/users/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("홍길동"));
        }

        @Test
        @DisplayName("실패: 존재하지 않는 사용자 조회 시 404를 반환한다")
        void shouldReturn404WhenUserNotFound() throws Exception {
            mockMvc.perform(get("/api/v1/users/{id}", 99999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
        }
    }
}
```

### 테스트 네이밍 규칙
- `@DisplayName`에 한글로 시나리오를 명확히 기술한다.
- 메서드명은 `should~When~` 패턴을 사용한다.
- `@Nested` 클래스로 API 엔드포인트별로 그룹핑한다.

### 테스트 데이터
- 테스트 간 독립성을 보장한다. 테스트 순서에 의존하지 않는다.
- `@BeforeEach`에서 테스트 데이터를 세팅하고, `@Transactional`로 자동 롤백한다.
- 테스트용 설정은 `application-test.yml`에 분리한다. (H2 인메모리 DB 권장)

---

## 4. 에러 처리 원칙

### Global Exception Handler
- `@RestControllerAdvice`를 사용하여 **전역 예외 처리기**를 반드시 구현한다.
- 모든 API 응답은 통일된 형식을 따른다.

```java
// 통일된 API 응답 형식
@Getter
@AllArgsConstructor
public class ApiResponse<T> {
    private final boolean success;
    private final String message;
    private final T data;
    private final String errorCode;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "요청이 성공적으로 처리되었습니다.", data, null);
    }

    public static <T> ApiResponse<T> error(String message, String errorCode) {
        return new ApiResponse<>(false, message, null, errorCode);
    }
}
```

### 커스텀 예외 클래스
- 비즈니스 로직 예외는 커스텀 예외 클래스를 정의하여 사용한다.
- 예외 클래스에 HTTP 상태 코드와 에러 코드를 포함한다.

```java
// 비즈니스 예외 기본 클래스
@Getter
public class BusinessException extends RuntimeException {
    private final HttpStatus status;
    private final String errorCode;

    public BusinessException(String message, HttpStatus status, String errorCode) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }
}

// 구체적 예외
public class EntityNotFoundException extends BusinessException {
    public EntityNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND, "ENTITY_NOT_FOUND");
    }
}
```

### 에러 메시지 규칙
- 사용자에게 보여주는 메시지는 **한글**로, 기술적 용어 없이 이해하기 쉽게 작성한다.
- 에러 코드는 **영문 대문자 + 언더스코어** 형식으로 작성한다. (예: `USER_NOT_FOUND`, `INVALID_INPUT`)
- 내부 서버 에러(500)는 상세 원인을 사용자에게 노출하지 않는다. 로그에만 기록한다.
- 모든 예외 발생 시 로그를 남긴다. (`log.error()` 사용, 스택 트레이스 포함)

### Service 계층 에러 처리
```java
// ✅ 올바른 예시
@Override
public UserResponseDto findById(Long id) {
    return userRepository.findById(id)
        .map(UserResponseDto::from)
        .orElseThrow(() -> new EntityNotFoundException("사용자를 찾을 수 없습니다. ID: " + id));
}

// ❌ 잘못된 예시 - null 반환
@Override
public UserResponseDto findById(Long id) {
    User user = userRepository.findById(id).orElse(null);
    if (user == null) return null;  // null 반환 금지
}
```

### 외부 API 호출 시
- 외부 API 호출은 반드시 try-catch로 감싸고, 타임아웃을 설정한다.
- 외부 서비스 장애가 전체 시스템에 영향을 주지 않도록 **적절한 fallback**을 제공한다.
- 재시도(Retry) 로직이 필요한 경우 최대 횟수를 제한한다.

---

## 5. 민감 정보 관리

### 절대 금지 사항
- API 키, 시크릿 키, DB 비밀번호, 토큰 등을 **절대** 소스 코드에 하드코딩하지 않는다.
- 민감 정보가 포함된 파일을 Git에 커밋하지 않는다.

### .env / application.yml 관리
```yaml
# application.yml - 민감 정보는 환경변수로 주입
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION:3600000}  # 기본값 설정 가능
```

### .env 파일 구조
```env
# .env (이 파일은 절대 Git에 커밋하지 않는다)
DB_URL=jdbc:mysql://localhost:3306/mydb
DB_USERNAME=root
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret_key
```

### 필수 조치
- `.gitignore`에 다음 항목을 반드시 포함한다:
  ```
  .env
  .env.local
  .env.*.local
  application-local.yml
  application-secret.yml
  ```
- `.env.example` 파일을 제공하여 필요한 환경변수 목록과 형식을 문서화한다. (값은 비워둔다)
- 프로필별 설정 분리: `application-dev.yml`, `application-prod.yml`, `application-test.yml`

### 코드 내 사용
```java
// ✅ 올바른 예시
@Value("${jwt.secret}")
private String jwtSecret;

// ❌ 잘못된 예시
private String jwtSecret = "my-secret-key-12345";
```

---

## 6. 의존성 관리

### 새 패키지 추가 전 원칙
1. **정당한 이유를 먼저 설명한다**: 왜 이 라이브러리가 필요한지, 어떤 문제를 해결하는지 명시한다.
2. **기존 의존성으로 해결 가능한지 먼저 확인한다**: 이미 프로젝트에 포함된 라이브러리로 해결할 수 있다면 새 의존성을 추가하지 않는다.
3. **표준 라이브러리(JDK)로 충분한지 확인한다**: Java 표준 라이브러리로 구현 가능하면 외부 의존성을 추가하지 않는다.

### 의존성 추가 시 확인사항
- **라이선스**: 상용 프로젝트에 사용 가능한 라이선스인지 확인한다. (MIT, Apache 2.0 등)
- **유지보수 상태**: 최근 6개월 이내에 업데이트가 있었는지, 활발히 관리되는 프로젝트인지 확인한다.
- **보안 취약점**: 알려진 보안 취약점이 없는지 확인한다.
- **크기와 의존성 트리**: 하나의 기능을 위해 과도하게 큰 라이브러리를 추가하지 않는다.

### 의존성 추가 형식
새 의존성을 추가할 때는 반드시 주석으로 사유를 기록한다:

```groovy
// build.gradle
dependencies {
    // JSON 직렬화/역직렬화 - Spring Boot 기본 포함, 별도 추가 불필요
    // implementation 'com.google.code.gson:gson' ← 불필요 (Jackson 사용)

    // JWT 토큰 생성 및 검증
    implementation 'io.jsonwebtoken:jjwt-api:0.12.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.5'
    runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.5'
}
```

### 버전 관리
- Spring Boot에서 관리하는 의존성은 버전을 명시하지 않는다. (Spring Boot BOM 활용)
- 그 외 의존성은 정확한 버전을 명시한다. (`+`, `latest` 등 동적 버전 사용 금지)
- 주기적으로 의존성 업데이트를 확인하고, 보안 패치가 있으면 즉시 반영한다.

---

## 참고: 코드 작성 시 일반 규칙

- 모든 public 메서드에는 JavaDoc 주석을 작성한다.
- Lombok을 적극 활용하되, `@Data` 대신 `@Getter`, `@Builder` 등 필요한 것만 사용한다.
- `@RequiredArgsConstructor`로 생성자 주입을 사용한다. (`@Autowired` 필드 주입 금지)
- API 경로는 `/api/v1/`으로 시작하며, REST 명명 규칙을 따른다. (복수형 명사 사용)
- 날짜/시간은 `LocalDateTime`(Java 8+)을 사용한다. `Date` 클래스 사용 금지.

---

## 7. 기술 스택 (Tech Stack)

### Frontend
- **Framework**: React 18 (Vite 기반, TypeScript)
- **스타일링**: styled-components (모바일 퍼스트 반응형 디자인)
- **HTTP 클라이언트**: axios
- **상태관리**: 필요 시 Zustand 또는 React Context API
- **패키지 매니저**: npm

### Backend
- **Framework**: Java Spring Boot 3.x
- **빌드 도구**: Gradle (Kotlin DSL, `build.gradle.kts`)
- **언어**: Java 17+
- **ORM**: Spring Data JPA + Hibernate
- **유효성 검증**: Spring Validation (`@Valid`)

### Database
- **운영 환경**: MySQL 8.x
- **개발/테스트 환경**: H2 인메모리 DB

### API 통신
- REST API (JSON)
- API 경로: `/api/v1/` 시작
- 모든 응답은 `ApiResponse<T>` 통일 형식 사용

### 프로젝트 구조 (모노레포)
```
next-level/
├── frontend/               # React + Vite + TypeScript
└── backend/                # Spring Boot 3.x
```

### Frontend 디렉토리 구조
```
frontend/
├── src/
│   ├── components/     # 공통 UI 컴포넌트
│   ├── pages/          # 페이지 컴포넌트
│   ├── hooks/          # 커스텀 훅
│   ├── services/       # API 호출 (axios 기반)
│   ├── types/          # TypeScript 타입 정의
│   ├── styles/         # GlobalStyle, theme
│   ├── utils/          # 공통 유틸
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts      # /api → localhost:8080 프록시 설정
└── .env.example
```

### Frontend 코딩 규칙
- 컴포넌트 파일명은 PascalCase 사용 (예: `UserCard.tsx`)
- 모든 props는 TypeScript interface로 타입 정의
- API 호출은 반드시 `services/` 디렉토리에 모듈화 (컴포넌트에 직접 axios 호출 금지)
- styled-components 테마(`theme.ts`)를 통해 색상, 폰트, 간격을 관리한다
- 모바일 퍼스트: 기본 스타일 → `@media (min-width: breakpoint)` 순서로 작성