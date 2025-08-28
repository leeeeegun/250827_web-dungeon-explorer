package com.example.webdungeonexplorer.service;

import com.example.webdungeonexplorer.dto.GameStateResponse;
import com.example.webdungeonexplorer.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class GameService {

    private GameMap gameMap;
    private Player player;
    private List<Monster> monsters;
    private List<Item> items;

    public GameService() {
        initializeGame();
    }

    // 게임 초기화 로직
    private void initializeGame() {

        // 10 x 10 크기의 맵 생성
        gameMap = new GameMap(10, 10);
        // 플레이어는 (1,1) 위치에 생성
        player = new Player(1, 1, 100, 15);
        monsters = new ArrayList<>();
        items = new ArrayList<>();

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

        // 몬스터와 아이템 배치
        monsters.add(new Monster(7, 7, 50, 10));
        items.add(new Item(8, 2, "KEY"));
    }

    // 전투 로직
    public GameStateResponse attack() {
        String message = "공격할 대상이 근처에 없습니다.";

        // 플레이어 주변에 있는 몬스터를 찾는다.
        Monster targetMonster = monsters.stream()
                .filter(m -> Math.abs(m.getX() - player.getX()) <= 1 && Math.abs(m.getY() - player.getY()) <= 1)
                .findFirst()
                .orElse(null);

        if (targetMonster != null) {
            // 플레이어가 몬스터 공격
            targetMonster.setHp(targetMonster.getHp() - player.getAttackPower());

            // 몬스터가 플레이어 반격
            if (targetMonster.getHp() > 0) {
                player.setHp(player.getHp() - targetMonster.getAttackPower());
                message = "몬스터와 공격을 주고 받았습니다!";
            } else {
                message = "몬스터를 물리쳤습니다!";
                monsters.remove(targetMonster); // 몬스터 디짐
            }
        }
        return getGameState(message);
    }

    // 아이템 줍기 로직
    public GameStateResponse pickupItem() {
        String message = "주울 아이템이 없습니다.";

        // 플레이어와 같은 위치에 있는 아이템을 찾는다.
        Item targetItem = items.stream()
                .filter(i -> i.getX() == player.getX() && i.getY() == player.getY())
                .findFirst()
                .orElse(null);

        if (targetItem != null) {
            player.getInventory().add(targetItem);
            items.remove(targetItem); // 맵에서 아이템 제거
            message = targetItem.getName() + "을(를) 주웠습니다!";
        }
        return getGameState(message);
    }

    public GameStateResponse movePlayer(String direction) {
        int newX = player.getX();
        int newY = player.getY();

        switch (direction.toUpperCase()) {
            case "UP":      newY--; break;
            case "DOWN":    newY++; break;
            case "LEFT":    newX--; break;
            case "RIGHT":   newX++; break;
        }

        if (isValidMove(newX, newY)) {
            player.setX(newX);
            player.setY(newY);
        }
        return getGameState("플레이어가 이동했습니다.");
    }

    private boolean isValidMove(int x, int y) {
        if (x < 0 || x >= gameMap.getWidth() || y < 0 || y >= gameMap.getHeight())
            return false;
        if (gameMap.getTiles()[y][x] == TileType.WALL)
            return false;

        return true;
    }

    // getGameState 메서드를 오버로딩해서 메시지를 받을 수 있도록 수정
    public GameStateResponse getGameState() {
        return getGameState("던전에 오신 것을 환영합니다.");
    }

    // 현재 게임 상태를 DTO에 담아서 반환하는 메서드
    public GameStateResponse getGameState(String message) {
        // 1. TileType[][]을 DTO String 으로 변환
        String[][] mapForDto = new String[gameMap.getHeight()][gameMap.getWidth()];
        for (int y = 0; y < gameMap.getHeight(); y++) {
            for (int x = 0; x < gameMap.getWidth(); x++) {
                // "WALL", "FLOOR" 등 문자열로 변환
                mapForDto[y][x] = gameMap.getTiles()[y][x].name();
            }
        }
        // 맵에 몬스터와 아이템 표시
        monsters.forEach(m -> mapForDto[m.getY()][m.getX()] = TileType.MONSTER.name());
        items.forEach(i -> mapForDto[i.getY()][i.getX()] = TileType.ITEM.name());
        mapForDto[player.getY()][player.getX()] = TileType.PLAYER.name();

        // DTO 변환 로직 업데이트
        GameStateResponse.PlayerInfo playerInfo = GameStateResponse.PlayerInfo.builder()
                .x(player.getX()).y(player.getY()).hp(player.getHp())
                .inventory(player.getInventory().stream().map(Item::getName).collect(Collectors.toList()))
                .build();

        List<GameStateResponse.MonsterInfo> monsterInfo = monsters.stream()
                .map(m -> GameStateResponse.MonsterInfo.builder().x(m.getX()).y(m.getY()).hp(m.getHp()).build())
                .collect(Collectors.toList());

        List<GameStateResponse.ItemInfo> itemInfo = items.stream()
                .map(i -> GameStateResponse.ItemInfo.builder().x(i.getX()).y(i.getY()).name(i.getName()).build())
                .collect(Collectors.toList());

        return GameStateResponse.builder()
                .map(mapForDto).player(playerInfo).monsters(monsterInfo).items(itemInfo)
                .message(message)
                .build();

//        // 플레이어 위치를 맵에 표시
//        mapForDto[player.getY()][player.getX()] = TileType.PLAYER.name();
//
//        // 플레이어 정보를 DTO로 변환
//        GameStateResponse.PlayerInfo playerInfo = GameStateResponse.PlayerInfo.builder()
//                .x(player.getX())
//                .y(player.getY())
//                .hp(player.getHp())
//                .build();
//
//        // 최종 DTO를 만들어서 반환
//        return GameStateResponse.builder()
//                .map(mapForDto)
//                .player(playerInfo)
//                // 아직 몬스터가 없으므로 빈 리스트
//                .monsters(Collections.emptyList())
//                .message("던전에 오신 것을 환용합니다.")
//                .build();
    }
}
