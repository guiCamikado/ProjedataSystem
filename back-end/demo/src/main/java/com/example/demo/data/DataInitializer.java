package com.example.demo.data;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;

import javax.sql.DataSource;

import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class DataInitializer {

    private final DataSource dataSource;

    public DataInitializer(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostConstruct
    public void init() throws SQLException {

        try (Connection conn = dataSource.getConnection();
                Statement stmt = conn.createStatement()) {

            // PRODUCTS
            stmt.execute("CREATE TABLE IF NOT EXISTS products (" +
                    "id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                    "name VARCHAR(255) NOT NULL," +
                    "quantity INT NOT NULL," +
                    "price DECIMAL(10,2) NOT NULL," +
                    "materials JSON NOT NULL" +
                    ")");

            // RAW MATERIALS
            stmt.execute("CREATE TABLE IF NOT EXISTS raw_materials (" +
                    "id BIGINT AUTO_INCREMENT PRIMARY KEY," +
                    "name VARCHAR(255) NOT NULL," +
                    "stock_quantity BIGINT NOT NULL," +
                    "identifier VARCHAR(50) NOT NULL" +
                    ")");
        }
    }
}