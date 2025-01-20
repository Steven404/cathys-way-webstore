# Database info and commands

---
***

### Create commands

``CREATE DATABASE cathys_way; USE cathys_way;``

Create table categories:
```
CREATE TABLE categories (
id INT AUTO_INCREMENT PRIMARY KEY,         -- Unique identifier for the category
name VARCHAR(255) NOT NULL,                -- Name of the category or subcategory
parent_id INT DEFAULT NULL,                -- Parent category (NULL if root category)
description TEXT,                          -- Optional description of the category
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the category is created
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Timestamp for last update
FOREIGN KEY (parent_id) REFERENCES categories(id) -- Self-referential foreign key
)
```

---

### Insert commands

Insert categories:

```
INSERT INTO categories (name, parent_id, description) 
VALUES ('Miyuki', NULL, null), 
       ('Διάφορες Χάντρες', NULL, null),
       ('Ημιπολύτιμες', NULL, null),
       ('Ατάσλι', NULL, null),
       ('Macrame', NULL, null),
       ('Plexiglas', NULL, null),
       ('Διάφορα', NULL, null),
       ('Εποχιακά', NULL, null);
```

Insert subcategories

```
INSERT INTO categories (name, parent_id, description) 
VALUES ('Γιάλυνες', 2, null), ('Κρυσταλάκια', 2, null), ('Πέρλα', 2, null);

INSERT INTO categories (name, parent_id, description) 
VALUES ('Δίγμα', 7, null);

INSERT INTO categories (name, parent_id, description) 
VALUES ('Γούρια', 8, null), ('Λαμπάδες', 8, null), ('Μαρτάκια', 8, null);
```