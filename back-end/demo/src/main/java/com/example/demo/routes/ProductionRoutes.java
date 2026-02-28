package com.example.demo.routes;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.sql.DataSource;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

// WIP Documentar
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class ProductionRoutes {

    private final DataSource dataSource;

    public ProductionRoutes(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    // PRODUCTS
    @PostMapping("/products/new_product")
    public ResponseEntity<String> addProduct(@RequestBody Map<String, Object> body) {

        try {
            String name = body.get("name").toString();

            int quantity = ((Number) body.get("quantity")).intValue();
            double price = ((Number) body.get("price")).doubleValue();

            String materials = body.get("materials").toString();

            String sql = "INSERT INTO products (name, quantity, price, materials) VALUES (?, ?, ?, ?)";

            try (Connection conn = dataSource.getConnection();
                    PreparedStatement ps = conn.prepareStatement(sql)) {

                ps.setString(1, name);
                ps.setInt(2, quantity);
                ps.setDouble(3, price);
                ps.setString(4, materials);

                ps.executeUpdate();
            }

            return ResponseEntity.ok("Produto criado com sucesso");

        } catch (Exception e) {
            e.printStackTrace(); // 🔥 isso vai te mostrar o erro REAL no console
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    @GetMapping("/products/products")
    public List<Map<String, Object>> getProducts() throws SQLException {

        String sql = "SELECT id, name, quantity, price, materials FROM products ORDER BY id";
        List<Map<String, Object>> result = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("id", rs.getLong("id"));
                row.put("name", rs.getString("name"));
                row.put("quantity", rs.getInt("quantity"));
                row.put("price", rs.getDouble("price"));
                row.put("materials", rs.getString("materials")); // JSON
                result.add(row);
            }
        }

        return result;
    }

    @PutMapping("/products/update_product")
    public ResponseEntity<String> updateProduct(@RequestBody Map<String, Object> body) throws SQLException {

        long id = Long.parseLong(body.get("id").toString());
        String name = body.get("name").toString();
        int quantity = Integer.parseInt(body.get("quantity").toString());
        double price = Double.parseDouble(body.get("price").toString());
        String materials = body.get("materials").toString();

        String sql = "UPDATE products SET name = ?, quantity = ?, price = ?, materials = ? WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, name);
            ps.setInt(2, quantity);
            ps.setDouble(3, price);
            ps.setString(4, materials);
            ps.setLong(5, id);

            ps.executeUpdate();
        }

        return ResponseEntity.ok("Produto atualizado com sucesso");
    }

    @DeleteMapping("/products/delete_product")
    public ResponseEntity<String> deleteProduct(@RequestParam long id) throws SQLException {

        String sql = "DELETE FROM products WHERE id = ?";

        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            ps.executeUpdate();
        }

        return ResponseEntity.ok("Produto removido com sucesso");
    }

    // RAW MATERIALS
    @PostMapping("/raw-materials/new_raw_material")
    public ResponseEntity<String> addRawMaterial(@RequestBody Map<String, Object> body) throws SQLException {
        String name = body.get("name").toString();
        double stockQuantity = Double.parseDouble(body.get("stockQuantity").toString());
        String identifier = body.get("identifier").toString();

        String sql = "INSERT INTO raw_materials (name, stock_quantity, identifier) VALUES (?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setString(1, name);
            ps.setDouble(2, stockQuantity);
            ps.setString(3, identifier);
            ps.executeUpdate();
        }
        return ResponseEntity.ok("Matéria-prima criada com sucesso");
    }

    @GetMapping("/raw-materials/raw_materials")
    public List<Map<String, Object>> getRawMaterials() throws SQLException {
        String sql = "SELECT id, name, stock_quantity, identifier FROM raw_materials ORDER BY id";
        List<Map<String, Object>> result = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("id", rs.getLong("id"));
                row.put("name", rs.getString("name"));
                row.put("stockQuantity", rs.getDouble("stock_quantity"));
                row.put("identifier", rs.getString("identifier"));
                result.add(row);
            }
        }
        return result;
    }

    @PutMapping("/raw-materials/update_raw_material")
    public ResponseEntity<String> updateRawMaterial(@RequestBody Map<String, Object> body) throws SQLException {
        long id = Long.parseLong(body.get("id").toString());
        String name = body.get("name").toString();
        double stockQuantity = Double.parseDouble(body.get("stockQuantity").toString());
        String identifier = body.get("identifier").toString();

        String sql = "UPDATE raw_materials SET name = ?, description = ?, stock_quantity = ?, identifier = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(5, id);
            ps.setString(1, name);
            ps.setDouble(3, stockQuantity);
            ps.setString(4, identifier);
            ps.executeUpdate();
        }
        return ResponseEntity.ok("Matéria-prima atualizada com sucesso");
    }

    @DeleteMapping("/raw-materials/delete_raw_material")
    public ResponseEntity<String> deleteRawMaterial(@RequestParam long id) throws SQLException {
        String sql = "DELETE FROM raw_materials WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        }
        return ResponseEntity.ok("Matéria-prima removida com sucesso");
    }

    // PRODUCT x RAW MATERIAL
    @PostMapping("/product-raw-materials/new_association")
    public ResponseEntity<String> addAssociation(@RequestBody Map<String, Object> body) throws SQLException {
        long productId = Long.parseLong(body.get("productId").toString());
        long rawMaterialId = Long.parseLong(body.get("rawMaterialId").toString());
        double requiredQuantity = Double.parseDouble(body.get("requiredQuantity").toString());

        String sql = "INSERT INTO product_raw_materials (product_id, raw_material_id, required_quantity) VALUES (?, ?, ?)";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, productId);
            ps.setLong(2, rawMaterialId);
            ps.setDouble(3, requiredQuantity);
            ps.executeUpdate();
        }
        return ResponseEntity.ok("Associação criada com sucesso");
    }

    @GetMapping("/product-raw-materials/associations")
    public List<Map<String, Object>> getAssociations() throws SQLException {
        String sql = "SELECT id, product_id, raw_material_id, required_quantity FROM product_raw_materials ORDER BY id";
        List<Map<String, Object>> result = new ArrayList<>();
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Map<String, Object> row = new HashMap<>();
                row.put("id", rs.getLong("id"));
                row.put("productId", rs.getLong("product_id"));
                row.put("rawMaterialId", rs.getLong("raw_material_id"));
                row.put("requiredQuantity", rs.getDouble("required_quantity"));
                result.add(row);
            }
        }
        return result;
    }

    @PutMapping("/product-raw-materials/update_association")
    public ResponseEntity<String> updateAssociation(@RequestBody Map<String, Object> body) throws SQLException {
        long id = Long.parseLong(body.get("id").toString());
        double requiredQuantity = Double.parseDouble(body.get("requiredQuantity").toString());

        String sql = "UPDATE product_raw_materials SET required_quantity = ? WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setDouble(1, requiredQuantity);
            ps.setLong(2, id);
            ps.executeUpdate();
        }
        return ResponseEntity.ok("Associação atualizada com sucesso");
    }

    @DeleteMapping("/product-raw-materials/delete_association")
    public ResponseEntity<String> deleteAssociation(@RequestParam long id) throws SQLException {
        String sql = "DELETE FROM product_raw_materials WHERE id = ?";
        try (Connection conn = dataSource.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setLong(1, id);
            ps.executeUpdate();
        }
        return ResponseEntity.ok("Associação removida com sucesso");
    }

    // PRODUCT CRAFTING LÓGIC
    @PostMapping("/craft/new_craft")
    public ResponseEntity<String> addCraftProduct(@RequestBody Map<String, Object> body) {
        // 1. É necessário obter a quantidade e o nome do item eles virão em um json
        // contendo: {name: String, quantity: int}
        // ---------------------------------------------------------------------------------
        // 2. Após isso é necessário consultar na tabela products o custo contido na coluna
        // "materials" que é armazenada da seguinte forma:
        // [{"name":"Metal","requiredQuantity":100},{"name":"Wood","requiredQuantity":500}]
        // ---------------------------------------------------------------------------------
        // 3. Com o valor e nome de cada item necessário multiplicar o valor
        // "requiredQuantity" pelo quantity no json que será enviado a essa função
        // conseguindo assim o custo total.
        // ---------------------------------------------------------------------------------
        // 4. Após conseguir o custo total será necessário obter todos os "recursos crus"
        // contidos na tabela "raw_materials" que batem diretamente com os materiais
        // encontrados no custo da tabela products
        // ---------------------------------------------------------------------------------
        // 5 & 6. Aqui serão necessárias 2 condicionais sendo elas
        // 1. Se o valor do custo for maior que o valor armazenado de QUALQUER MATERIAL
        // deverá retornar uma mensagem falando que o custo para criar é maior do que o
        // em estoque.
        // ---------------------------------------------------------------------------------
        // 2. Se o item não for encontrado na tabela é necessário devolver uma mensagem
        // dizendo que a obra prima não exista na tabela raw_materials
        // ---------------------------------------------------------------------------------
        // 7. Se nenhuma das condicionais forem aceitas então os itens serão subtraidos da
        // tabela raw_materials e uma mensagem deverá ser enviada informando o sucesso
        // da operação
        // Obtém os dados enviados no JSON: { "name": String, "quantity": int }

        String productName = (String) body.get("name");
        if (productName == null || productName.isBlank()) {
            return ResponseEntity.badRequest().body("O nome do produto é obrigatório.");
        }
        Integer quantityObj = (Integer) body.get("quantity");
        if (quantityObj == null || quantityObj <= 0) {
            return ResponseEntity.badRequest().body("A quantidade deve ser um número inteiro positivo.");
        }
        int requestedQuantity = quantityObj;

        Connection conn = null;
        try {
            conn = dataSource.getConnection();
            conn.setAutoCommit(false); // Inicia transação

            // 1. Buscar os materiais necessários para o produto
            String materialsJson;
            try (PreparedStatement ps = conn.prepareStatement("SELECT materials FROM products WHERE name = ?")) {
                ps.setString(1, productName);
                try (ResultSet rs = ps.executeQuery()) {
                    if (!rs.next()) {
                        return ResponseEntity.status(404).body("Produto não encontrado: " + productName);
                    }
                    materialsJson = rs.getString("materials");
                }
            }

            // 2. Converter o JSON da coluna materials para uma lista de mapas
            ObjectMapper mapper = new ObjectMapper();
            List<Map<String, Object>> materialsList;
            try {
                materialsList = mapper.readValue(materialsJson, new TypeReference<List<Map<String, Object>>>() {
                });
            } catch (Exception e) {
                throw new RuntimeException("Erro ao interpretar os materiais do produto: " + e.getMessage(), e);
            }

            // 3. Calcular a quantidade total necessária de cada matéria-prima
            Map<String, Integer> requiredMaterials = new HashMap<>();
            for (Map<String, Object> mat : materialsList) {
                String name = (String) mat.get("name");
                // requiredQuantity é a quantidade por unidade do produto
                int perUnit = ((Number) mat.get("requiredQuantity")).intValue();
                int totalRequired = perUnit * requestedQuantity;
                requiredMaterials.put(name, totalRequired);
            }

            // 4. Verificar se todas as matérias-primas existem na tabela raw_materials
            Set<String> materialNames = requiredMaterials.keySet();
            String sqlSelect = "SELECT name, stock_quantity FROM raw_materials WHERE name IN (" +
                    String.join(",", Collections.nCopies(materialNames.size(), "?")) + ")";
            Map<String, Integer> availableQuantities = new HashMap<>();
            try (PreparedStatement ps = conn.prepareStatement(sqlSelect)) {
                int index = 1;
                for (String name : materialNames) {
                    ps.setString(index++, name);
                }
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        String name = rs.getString("name");
                        int qty = rs.getInt("stock_quantity");
                        availableQuantities.put(name, qty);
                    }
                }
            }

            // 5. Verificar se alguma matéria-prima não foi encontrada
            List<String> missingMaterials = new ArrayList<>();
            for (String name : materialNames) {
                if (!availableQuantities.containsKey(name)) {
                    missingMaterials.add(name);
                }
            }
            if (!missingMaterials.isEmpty()) {
                return ResponseEntity.status(400)
                        .body("As seguintes obras-primas não existem na tabela raw_materials: " + missingMaterials);
            }

            // 6. Verificar se há quantidade suficiente em estoque
            List<String> insufficientMaterials = new ArrayList<>();
            for (Map.Entry<String, Integer> entry : requiredMaterials.entrySet()) {
                String name = entry.getKey();
                int needed = entry.getValue();
                int available = availableQuantities.get(name);
                if (needed > available) {
                    insufficientMaterials.add(name + " (necessário: " + needed + ", disponível: " + available + ")");
                }
            }
            if (!insufficientMaterials.isEmpty()) {
                return ResponseEntity.status(400)
                        .body("Estoque insuficiente para: " + insufficientMaterials);
            }

            // 7. Subtrair as quantidades da tabela raw_materials
            String sqlUpdate = "UPDATE raw_materials SET stock_quantity = stock_quantity - ? WHERE name = ?";
            try (PreparedStatement ps = conn.prepareStatement(sqlUpdate)) {
                for (Map.Entry<String, Integer> entry : requiredMaterials.entrySet()) {
                    ps.setInt(1, entry.getValue());
                    ps.setString(2, entry.getKey());
                    ps.addBatch();
                }
                ps.executeBatch();
            }

            conn.commit(); // Confirma a transação
            return ResponseEntity.ok("Produto fabricado com sucesso! Quantidade utilizada: " + requestedQuantity);

        } catch (Exception e) {
            if (conn != null) {
                try {
                    conn.rollback(); // Desfaz em caso de erro
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erro interno: " + e.getMessage());
        } finally {
            if (conn != null) {
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

}