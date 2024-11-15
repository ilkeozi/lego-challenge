# Lego Challenge

Lego Database is a sample PostgreSQL database setup for managing Lego pieces, boxes, and components, making it easy to set up locally with Docker.

## Description

**Story: “Assembling the Iconic Lego Sets of Blockville”**  
In Blockville’s **Lego Design Studio**, a team of creative designers crafts themed Lego sets that delight builders of all ages. These sets, from the **City Building Set** to the **Space Shuttle Set**, are designed using a combination of five fundamental Lego bricks, each named after a geometric shape: **Square**, **Rectangle**, **Circle**, **Triangle**, and **Hexagon**. These bricks are the core components, each with a set price, allowing designers to build consistent and modular collections.

## Challenge

The Design Studio faces several challenges as they assemble these popular collections:

1. **Designing individual Lego sets** that incorporate both basic Lego pieces and other boxed sets, allowing for greater complexity and variety.
2. **Supporting nested Lego boxes** so that sets can contain smaller, self-contained sets as components.
3. **Ensuring accurate pricing** across all sets, particularly when an update to a component in one set should cascade to other sets that include it.

To tackle these challenges, the **Lego Box API** was developed to help designers manage complex, nested sets. This API ensures that any modifications made to a component are automatically reflected in all sets that rely on it, maintaining accurate and up-to-date pricing across the Design Studio’s entire inventory.

### Scenario: Creating Blockville’s Iconic Lego Sets

**Alex**, a designer at the **Lego Design Studio**, is tasked with preparing two themed sets: the **City Building Set** and the **Classic Bricks Set**.

#### 1. Using Fundamental Lego Pieces

The Studio works with five core Lego shapes, each representing a specific geometric form. These pieces serve as the building blocks for every Lego set, and their prices are fixed, allowing them to be used across multiple designs.  
By using these predefined pieces, Alex can build new sets without the need to redefine each component, ensuring efficiency and consistency in design.

#### 2. Building Modular Sets

Alex begins by designing the **City Building Set**, a larger, more intricate set composed of multiple pieces and sub-components.  
Later, Alex creates the **Classic Bricks Set**, a simpler box set that can stand alone or be included as a component in other, larger sets. This flexibility in nesting smaller boxes within larger sets gives Blockville’s customers more creative possibilities.

#### 3. Automated Pricing and Update Propagation

Each set has a total price, which the API calculates based on the prices of its individual pieces and any nested sets.  
When Alex updates a component in the **Classic Bricks Set**, any other set containing this component, for example, the **City Building Set**, reflects the updated price automatically.

With this system in place, the Lego Design Studio team can create new Lego sets, nest existing collections, and maintain pricing accuracy across all sets. This gives Blockville’s customers a streamlined, accurate experience when ordering customized sets, complete with modular options for building the most iconic Lego collections.

### Considerations and Hints for Implementation

To complete this assignment successfully, consider the following system design principles to optimize for performance, reliability, and data integrity:

- **Database Optimization:** Think about indexing strategies, partitioning, and caching mechanisms to keep query performance high, especially as the number of Lego sets and pieces grows.
- **Concurrency Management:** Be mindful of how to handle concurrent requests for transactions, as data consistency is crucial. How you manage concurrency is up to your interpretation and will showcase your approach to high-performance, reliable design.
- **Error Handling:** Design error reporting and rollback mechanisms for cases where imports fail. This ensures that partial imports don’t compromise data integrity across the sets.

You may use any technology you prefer for message handling, such as **Kafka**, **RabbitMQ**, or any other solution that aligns with your design. You can modify the database in any way, shape, or form as you prefer. Only requirements are **Node.js** and **PostgreSQL**.

### Assignment Submission:

The result should be REST API that complies with the included file with example requests, no UI needed. Please complete this assignment in a private repository and invite us to access it

## Installation

Use Docker to set up and run the Lego Database.

```
docker-compose up -d
```

This command will pull the PostgreSQL Docker image (if not already present), create a container, and initialize it with the database schema and sample data.
