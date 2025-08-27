package com.example.webdungeonexplorer.model;

import lombok.Getter;

@Getter
public class GameMap {
    private final int width;
    private final int height;
    private final TileType[][] tiles; // 2차원 배열로 맵에 타일 정보 저장

    public GameMap(int width, int height) {
        this.width = width;
        this.height = height;
        tiles = new TileType[height][width];
    }

    public void setTile(int x, int y, TileType type) {
        if ( x >= 0 && x < width && y >= 0 && y < height ) {
            this.tiles[y][x] = type;
        }
    }
}
