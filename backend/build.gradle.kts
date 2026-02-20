plugins {
    java
    id("org.springframework.boot") version "3.4.2"
    id("io.spring.dependency-management") version "1.1.7"
}

group = "com.nextlevel"
version = "0.0.1-SNAPSHOT"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    // Spring Boot Web (REST API 제공)
    implementation("org.springframework.boot:spring-boot-starter-web")

    // Spring Data JPA (ORM)
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")

    // Bean Validation (@Valid, @NotBlank 등)
    implementation("org.springframework.boot:spring-boot-starter-validation")

    // MySQL 커넥터 (운영 환경)
    runtimeOnly("com.mysql:mysql-connector-j")

    // H2 인메모리 DB (개발/테스트 환경)
    runtimeOnly("com.h2database:h2")

    // Lombok (보일러플레이트 코드 제거)
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")

    // 테스트
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
