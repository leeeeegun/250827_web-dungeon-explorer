package com.example.webdungeonexplorer.model;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Player {
    private int x;
    private int y;
    private int hp;
    private int attackPower;
    private List<Item> inventory = new ArrayList<>();

    public Player(int x, int y, int hp, int attackPower) {
        this.x = x;
        this.y = y;
        this.hp = hp;
        this.attackPower = attackPower;
    }
}