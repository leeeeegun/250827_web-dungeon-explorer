package com.example.webdungeonexplorer.service;

import com.example.webdungeonexplorer.dto.GameStateResponse;
import com.example.webdungeonexplorer.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Slf4j
@Service
public class GameService {

    private GameMap gameMap;
    private Player player;
    private List<Monster> monsters;
    private List<Item> items;
    private final Random random = new Random();
    private static final int HEAL_AMOUNT = 30;

    public GameService() {
        initializeGame();
    }

    private void initializeGame() {
        generateDungeon(30, 30, 10, 5, 10);

        monsters = new ArrayList<>();
        items = new ArrayList<>();

        player = new Player(0, 0, 100, 15);
        placePlayerInEmptyRoom();

        placeEntities(10, 3, 1, 5); // 10 monsters, 3 keys, 1 boss, 5 potions
    }

    private void generateDungeon(int width, int height, int maxRooms, int minRoomSize, int maxRoomSize) {
        gameMap = new GameMap(width, height);
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                gameMap.setTile(x, y, TileType.WALL);
            }
        }

        List<Room> rooms = new ArrayList<>();
        for (int i = 0; i < maxRooms; i++) {
            int roomWidth = random.nextInt(maxRoomSize - minRoomSize + 1) + minRoomSize;
            int roomHeight = random.nextInt(maxRoomSize - minRoomSize + 1) + minRoomSize;
            int x = random.nextInt(width - roomWidth - 1) + 1;
            int y = random.nextInt(height - roomHeight - 1) + 1;

            Room newRoom = new Room(x, y, roomWidth, roomHeight);
            boolean intersects = false;
            for (Room otherRoom : rooms) {
                if (newRoom.intersects(otherRoom)) {
                    intersects = true;
                    break;
                }
            }

            if (!intersects) {
                rooms.add(newRoom);
                createRoom(newRoom);

                if (rooms.size() > 1) {
                    Room prevRoom = rooms.get(rooms.size() - 2);
                    createCorridor(newRoom.getCenterX(), newRoom.getCenterY(), prevRoom.getCenterX(), prevRoom.getCenterY());
                }
            }
        }
    }

    private void createRoom(Room room) {
        for (int y = room.y; y < room.y + room.height; y++) {
            for (int x = room.x; x < room.x + room.width; x++) {
                gameMap.setTile(x, y, TileType.FLOOR);
            }
        }
    }

    private void createCorridor(int x1, int y1, int x2, int y2) {
        int currentX = x1;
        int currentY = y1;

        while (currentX != x2) {
            gameMap.setTile(currentX, currentY, TileType.FLOOR);
            currentX += (x2 > x1) ? 1 : -1;
        }
        while (currentY != y2) {
            gameMap.setTile(currentX, currentY, TileType.FLOOR);
            currentY += (y2 > y1) ? 1 : -1;
        }
        gameMap.setTile(currentX, currentY, TileType.FLOOR);
    }

    private void placePlayerInEmptyRoom() {
        List<int[]> emptyCells = getEmptyCells();
        int[] pos = emptyCells.get(random.nextInt(emptyCells.size()));
        player.setX(pos[0]);
        player.setY(pos[1]);
    }

    private void placeEntities(int monsterCount, int keyCount, int bossCount, int potionCount) {
        List<int[]> emptyCells = getEmptyCells();
        Collections.shuffle(emptyCells);

        for (int i = 0; i < monsterCount && !emptyCells.isEmpty(); i++) {
            int[] pos = emptyCells.remove(0);
            monsters.add(new Monster(pos[0], pos[1], 30, 8, false));
        }

        for (int i = 0; i < keyCount && !emptyCells.isEmpty(); i++) {
            int[] pos = emptyCells.remove(0);
            items.add(new Item(pos[0], pos[1], ItemType.KEY));
        }

        for (int i = 0; i < bossCount && !emptyCells.isEmpty(); i++) {
            int[] pos = emptyCells.remove(0);
            monsters.add(new Monster(pos[0], pos[1], 150, 25, true));
        }

        for (int i = 0; i < potionCount && !emptyCells.isEmpty(); i++) {
            int[] pos = emptyCells.remove(0);
            items.add(new Item(pos[0], pos[1], ItemType.POTION));
        }
    }

    private List<int[]> getEmptyCells() {
        List<int[]> emptyCells = new ArrayList<>();
        for (int y = 0; y < gameMap.getHeight(); y++) {
            for (int x = 0; x < gameMap.getWidth(); x++) {
                if (gameMap.getTiles()[y][x] == TileType.FLOOR) {
                    emptyCells.add(new int[]{x, y});
                }
            }
        }
        // 플레이어 위치는 제외
        emptyCells.removeIf(cell -> cell[0] == player.getX() && cell[1] == player.getY());
        return emptyCells;
    }

    public GameStateResponse attack() {
        String message = "공격할 대상이 근처에 없습니다.";
        Monster targetMonster = monsters.stream()
                .filter(m -> Math.abs(m.getX() - player.getX()) <= 1 && Math.abs(m.getY() - player.getY()) <= 1)
                .findFirst()
                .orElse(null);

        if (targetMonster != null) {
            targetMonster.setHp(targetMonster.getHp() - player.getAttackPower());
            if (targetMonster.getHp() > 0) {
                player.setHp(player.getHp() - targetMonster.getAttackPower());
                message = (targetMonster.isBoss() ? "보스" : "몬스터") + "와 공격을 주고 받았습니다!";
            } else {
                message = (targetMonster.isBoss() ? "보스" : "몬스터") + "를 물리쳤습니다!";
                monsters.remove(targetMonster);
            }
        }
        return getGameState(message);
    }

    public GameStateResponse pickupItem() {
        String message = "주울 아이템이 없습니다.";
        Item targetItem = items.stream()
                .filter(i -> i.getX() == player.getX() && i.getY() == player.getY())
                .findFirst()
                .orElse(null);

        if (targetItem != null) {
            if (targetItem.getType() == ItemType.POTION) {
                player.setHp(Math.min(player.getMaxHp(), player.getHp() + HEAL_AMOUNT));
                items.remove(targetItem);
                message = "물약을 마셔 체력을 " + HEAL_AMOUNT + " 회복했습니다!";
            } else if (targetItem.getType() == ItemType.KEY) {
                player.getInventory().add(targetItem);
                items.remove(targetItem);
                message = "열쇠를 주웠습니다!";
            }
        }
        return getGameState(message);
    }

    public GameStateResponse movePlayer(String direction) {
        int newX = player.getX();
        int newY = player.getY();

        switch (direction.toUpperCase()) {
            case "UP": newY--; break;
            case "DOWN": newY++; break;
            case "LEFT": newX--; break;
            case "RIGHT": newX++; break;
        }

        if (isValidMove(newX, newY)) {
            player.setX(newX);
            player.setY(newY);
        }
        return getGameState("플레이어가 이동했습니다.");
    }

    private boolean isValidMove(int x, int y) {
        return x >= 0 && x < gameMap.getWidth() && y >= 0 && y < gameMap.getHeight() &&
               gameMap.getTiles()[y][x] != TileType.WALL;
    }

    public GameStateResponse getGameState() {
        return getGameState("던전에 오신 것을 환영합니다.");
    }

    public GameStateResponse getGameState(String message) {
        String[][] mapForDto = new String[gameMap.getHeight()][gameMap.getWidth()];
        for (int y = 0; y < gameMap.getHeight(); y++) {
            for (int x = 0; x < gameMap.getWidth(); x++) {
                mapForDto[y][x] = gameMap.getTiles()[y][x].name();
            }
        }

        monsters.forEach(m -> mapForDto[m.getY()][m.getX()] = m.isBoss() ? TileType.BOSS.name() : TileType.MONSTER.name());
        items.forEach(i -> {
            if (i.getType() == ItemType.POTION) {
                mapForDto[i.getY()][i.getX()] = TileType.POTION.name();
            } else {
                mapForDto[i.getY()][i.getX()] = TileType.ITEM.name();
            }
        });
        mapForDto[player.getY()][player.getX()] = TileType.PLAYER.name();

        GameStateResponse.PlayerInfo playerInfo = GameStateResponse.PlayerInfo.builder()
                .x(player.getX()).y(player.getY()).hp(player.getHp()).maxHp(player.getMaxHp())
                .inventory(player.getInventory().stream().map(item -> item.getType().name()).collect(Collectors.toList()))
                .build();

        List<GameStateResponse.MonsterInfo> monsterInfo = monsters.stream()
                .map(m -> GameStateResponse.MonsterInfo.builder()
                        .x(m.getX()).y(m.getY()).hp(m.getHp()).isBoss(m.isBoss()).build())
                .collect(Collectors.toList());

        List<GameStateResponse.ItemInfo> itemInfo = items.stream()
                .map(i -> GameStateResponse.ItemInfo.builder().x(i.getX()).y(i.getY()).type(i.getType()).build())
                .collect(Collectors.toList());

        return GameStateResponse.builder()
                .map(mapForDto).player(playerInfo).monsters(monsterInfo).items(itemInfo)
                .message(message)
                .build();
    }

    private static class Room {
        int x, y, width, height;

        Room(int x, int y, int width, int height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        int getCenterX() { return x + width / 2; }
        int getCenterY() { return y + height / 2; }

        boolean intersects(Room other) {
            return (x < other.x + other.width && x + width > other.x &&
                    y < other.y + other.height && y + height > other.y);
        }
    }
}
