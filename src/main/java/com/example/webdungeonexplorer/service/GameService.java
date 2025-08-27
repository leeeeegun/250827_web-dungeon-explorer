package com.example.webdungeonexplorer.service;

import com.example.webdungeonexplorer.dto.GameStateResponse;
import com.example.webdungeonexplorer.model.GameMap;
import com.example.webdungeonexplorer.model.Player;
import com.example.webdungeonexplorer.model.TileType;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GameService {

    private GameMap gameMap;
    private Player player;

    public GameService() {
        initializeGame();
    }

    // 게임 초기화 로직
    private void initializeGame() {

        // 10 x 10 크기의 맵 생성
        gameMap = new GameMap(10, 10);
        // 플레이어는 (1,1) 위치에 생성
        player = new Player(1, 1, 100);

        // 맵 데이터 생성 (테두리는 벽, 내부는 바닥)
        for (int y = 0; y < gameMap.getHeight(); y++) {
            for (int x = 0; x < gameMap.getWidth(); x++) {
                if (y == 0 || y == gameMap.getHeight() - 1 || x == 0 || x == gameMap.getWidth() - 1) {
                    gameMap.setTile(x, y, TileType.WALL);
                } else {
                    gameMap.setTile(x, y, TileType.FLOOR);
                }
            }
        }
    }

    // 현재 게임 상태를 DTO에 담아서 반환하는 메서드
    public GameStateResponse getGameState() {
        // 1. TileType[][]을 DTO String 으로 변환
        String[][] mapForDto = new String[gameMap.getHeight()][gameMap.getWidth()];
        for (int y = 0; y < gameMap.getHeight(); y++) {
            for (int x = 0; x < gameMap.getWidth(); x++) {
                // "WALL", "FLOOR" 등 문자열로 변환
                mapForDto[y][x] = gameMap.getTiles()[y][x].name();
            }
        }

        // 플레이어 위치를 맵에 표시
        mapForDto[player.getY()][player.getX()] = TileType.PLAYER.name();

        // 플레이어 정보를 DTO로 변환
        GameStateResponse.PlayerInfo playerInfo = GameStateResponse.PlayerInfo.builder()
                .x(player.getX())
                .y(player.getY())
                .hp(player.getHp())
                .build();

        // 최종 DTO를 만들어서 반환
        return GameStateResponse.builder()
                .map(mapForDto)
                .player(playerInfo)
                // 아직 몬스터가 없으므로 빈 리스트
                .monsters(Collections.emptyList())
                .message("던전에 오신 것을 환용합니다.")
                .build();
    }
}
