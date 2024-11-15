# Example Request Bodies

### 1. Create Lego Box

Request Body:
json

```
{
  "name": "Classic Bricks Set",
}
```

### 2. Add Components to Lego Box (Update Propagation)

Request Body:
json

```
{
  "parent_item_id": 1, // Assuming the ID of the Lego Box
  "components": [
    {
      "component_type": "piece",
      "component_id": 1,// Assuming the ID of the 2x4 Brick
      “amount”: 2,
    },
  {
    "component_type": "piece",
    “amount”: 2,
    "component_id": 2 // Assuming another Lego Piece ID
  }
 ]
}
```

### 3. Create Transaction Box for Importing a Lego Box (Automated Pricing) (Data validation, concurrency management)

Request Body:
json

```
{
  "box_id": 1, // ID of the Lego Box being imported
  "amount": 100
}
```

## Considerations for High-Performance System Design

- **Database Optimization:** Discuss indexing strategies, partitioning, and caching mechanisms to enhance query performance.
- **Data Validation:** Ensure data integrity during batch imports and validate that all component IDs exist in the lego_pieces table before processing the import.
- **Concurrency Management:** Explore how to handle concurrent requests for imports and transactions, ensuring data consistency.
- **Error Handling:** Design mechanisms for error reporting and rollback in case of import failures.
