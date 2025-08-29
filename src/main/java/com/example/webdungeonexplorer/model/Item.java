package com.example.webdungeonexplorer.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Item {
    private int x;
    private int y;
    private ItemType type;
}