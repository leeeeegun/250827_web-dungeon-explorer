package com.example.webdungeonexplorer.dto;

import com.example.webdungeonexplorer.model.Player;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GameStateResponse {
    private String[][] map; // 프론트엔드가 쓰기 쉽게 배열 변환
    private PlayerInfo player;
    private List<MonsterInfo> monsters;
    private String message; // 게임 메세지

    // 이중 DTO
    @Data
    @Builder
    public static class PlayerInfo {
        private int x;
        private int y;
        private int hp;
    }

    @Data
    @Builder
    public static class MonsterInfo {
        private int x;
        private int y;
        private int hp;
    }
}
