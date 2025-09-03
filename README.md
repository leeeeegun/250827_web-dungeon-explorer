# 🎮 Web Dungeon Explorer

간단한 웹 기반 던전 탐험 로그라이크 게임입니다. Spring Boot와 순수 JavaScript를 사용하여 제작되었습니다.

## 😎 소개

<table>
  <tr>
    <td align="center"><b><a href="https://github.com/leeeeegun">이의건</a></b></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/leeeeegun"><img src="https://avatars.githubusercontent.com/u/80462203?v=4" width="100px" /></a></td>
  </tr>
</table>

## 🚀 프로젝트 개요

Web Dungeon Explorer는 절차적으로 생성된 던전을 탐험하고, 몬스터와 싸우고, 아이템을 획득하는 간단한 웹 게임입니다. 사용자는 실시간으로 게임 상태를 확인하며 던전을 탐험할 수 있습니다.

### 주요 기능

- 📝 **절차적 던전 생성**: 플레이할 때마다 새로운 구조의 던전이 생성됩니다.
- ⚔️ **전투 시스템**: 플레이어는 몬스터 및 보스와 턴 기반으로 공격을 주고받을 수 있습니다.
- 📦 **아이템**: 체력을 회복시켜주는 물약이나 특수 능력을 부여하는 열쇠 등 다양한 아이템이 존재합니다.
- 👾 **다양한 적**: 일반 몬스터와 강력한 보스가 던전 곳곳에 배치되어 있습니다.
- 🎮 **직관적인 조작**: 키보드를 사용하여 쉽게 플레이어를 이동하고 공격할 수 있습니다.
- 📊 **실시간 UI**: 플레이어의 HP, 인벤토리, 게임 메시지가 실시간으로 업데이트됩니다.

## 🏗️ 프로젝트 구조

```
web-dungeon-explorer/
├── gradle/
│   └── wrapper/
├── src/
│   ├── main/
│   │   ├── java/com/example/webdungeonexplorer/
│   │   │   ├── controller/     # 게임 API 요청 처리
│   │   │   ├── dto/            # 데이터 전송 객체
│   │   │   ├── model/          # 게임 엔티티 (플레이어, 몬스터 등)
│   │   │   └── service/        # 핵심 게임 로직
│   │   └── resources/
│   │       ├── static/         # 프론트엔드 (HTML, CSS, JS)
│   │       └── application.properties
│   └── test/
└── build.gradle.kts
```

## 🛠️ 기술 스택

### Frontend
- **Language**: JavaScript (ES6+)
- **Markup**: HTML5
- **Styling**: CSS3
- **Rendering**: Canvas API
- **HTTP Client**: Fetch API

### Backend
- **Framework**: Spring Boot 3.3.3
- **Language**: Java 17
- **Build Tool**: Gradle
- **Library**: Lombok

## 📦 설치 및 실행

### 사전 요구사항
- Java 17+
- Gradle

### 실행 방법

```bash
# 프로젝트 클론
git clone [https://github.com/leeeeegun/250827_web-dungeon-explorer.git](https://github.com/leeeeegun/250827_web-dungeon-explorer.git)
cd 250827_web-dungeon-explorer

# Gradle을 사용하여 프로젝트 실행
./gradlew bootRun
```

백엔드 서버가 `http://localhost:8081`에서 실행됩니다. 웹 브라우저에서 해당 주소로 접속하여 게임을 플레이할 수 있습니다.

## 🌟 주요 화면

### 1. 게임 플레이 화면
<table>
  <tr>
    <td align="center" valign="top">
      <b>던전 탐험</b><br/>
      http://googleusercontent.com/image_generation_content/5
    </td>
  </tr>
</table>
- 중앙에는 캔버스로 렌더링된 게임 화면이 표시됩니다.
- 오른쪽 UI 패널을 통해 플레이어의 상태, 인벤토리, 게임 메시지, 조작키를 확인할 수 있습니다.

### 2. 게임 오버 화면
<table>
  <tr>
    <td align="center" valign="top">
      <b>게임 오버</b><br/>
      http://googleusercontent.com/image_generation_content/4
    </td>
  </tr>
</table>
- 플레이어의 HP가 0이 되면 게임 오버 화면이 표시됩니다.
- 스페이스바를 눌러 게임을 다시 시작할 수 있습니다.
