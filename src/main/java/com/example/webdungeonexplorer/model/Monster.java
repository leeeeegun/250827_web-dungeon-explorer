package com.example.webdungeonexplorer.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Monster {
    private int x;
    private int y;
    private int hp;
    private int attackPower;
    private boolean isBoss;
}