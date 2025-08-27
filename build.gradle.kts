// build.gradle.kts

// 사용할 플러그인들을 정의하는 부분
plugins {
    java
    id("org.springframework.boot") version "3.3.3"
    id("io.spring.dependency-management") version "1.1.5"
}

// 프로젝트의 기본 정보
group = "com.example"
version = "0.0.1-SNAPSHOT"

// 사용할 자바 버전 설정
java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

// Lombok 설정을 위한 부분
configurations {
    compileOnly {
        extendsFrom(configurations.annotationProcessor.get())
    }
}

// 라이브러리를 다운로드할 저장소 (Maven Central)
repositories {
    mavenCentral()
}

// 프로젝트에 필요한 의존성(라이브러리) 목록
dependencies {
    // Spring Web: REST API와 웹 서버 기능
    implementation("org.springframework.boot:spring-boot-starter-web")
    // WebSocket: 실시간 통신 기능
    implementation("org.springframework.boot:spring-boot-starter-websocket")
    // Lombok: Getter, Setter 등 보일러플레이트 코드 감소
    compileOnly("org.projectlombok:lombok")
    annotationProcessor("org.projectlombok:lombok")
    // DevTools: 개발 편의 기능 (자동 재시작 등)
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    // Test: 테스트 코드 작성을 위한 라이브러리
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

// 테스트 실행 시 JUnit5를 사용하도록 설정
tasks.withType<Test> {
    useJUnitPlatform()
}
