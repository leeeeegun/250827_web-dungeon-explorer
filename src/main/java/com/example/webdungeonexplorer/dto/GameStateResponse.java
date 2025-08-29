package com.example.webdungeonexplorer.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GameStateResponse {
    private String[][] map;
    private PlayerInfo player;
    private List<MonsterInfo> monsters;
    private List<ItemInfo> items;
    private String message;

    @Data
    @Builder
    public static class PlayerInfo {
        private int x;
        private int y;
        private int hp;
        private List<String> inventory;
    }

    @Data
    @Builder
    public static class MonsterInfo {
        private int x;
        private int y;
        private int hp;
        private boolean isBoss;
    }

    @Data
    @Builder
    public static class ItemInfo {
        private int x;
        private int y;
        private String name;
    }
}