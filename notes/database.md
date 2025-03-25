# Database info and commands

---
***

### Create commands

``CREATE DATABASE cathys_way; USE cathys_way;``

Create categories table:
```
CREATE TABLE categories (
id INT AUTO_INCREMENT PRIMARY KEY,         -- Unique identifier for the category
name VARCHAR(255) NOT NULL,                -- Name of the category or subcategory
description TEXT,                          -- Optional description of the category
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the category is created
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Timestamp for last update
)
```

Create table subcategories: 

```
CREATE TABLE subcategories (id INT AUTO_INCREMENT primary key, 
name varchar(255) not null,
description TEXT,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Timestamp for when the category is created
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Timestamp for last update
)
```


Create products table: 

```
CREATE TABLE products (
code VARCHAR(100) not null PRIMARY KEY,
name VARCHAR(100) not null,
categoryId INT not null,
subcategoryId INT not null,
dimentions VARCHAR(100),
imageFile VARCHAR(255),
price FLOAT,
description TEXT,
foreign key (categoryId) references categories(id), foreign key (subcategoryId) references subcategories(id));

ALTER TABLE products ADD COLUMN colours VARCHAR(255) NULL;
```

---

### Insert commands

Insert categories:

```
INSERT INTO categories (name, description) 
VALUES ('Σκουλαρίκια', null), 
       ('Βραχιόλια', null),
       ('Χειροπέδες', null),
       ('Κρεμαστά', null),
       ('Μενταγιόν', null),
       ('Σετ', null);
```

Insert subcategories

```
INSERT INTO subcategories (name, description) 
VALUES ('Mijuki', null);
```

Insert mijuki products

```
INSERT INTO products (code, categoryId, subcategoryId, dimensions, name, price, description, colours) values 
('ΣΚ-013', 1, 1, '2,5cm x 1,5cm', 'Πεταλούδες', 14.00, 'Πεταλούδες σε διάφορα χρώματα με κουμπωμα κρικάκι από ανοιξείδωτο ατσάλι', null),
('ΣΚ-014', 1, 1, '3,5cm x 1,5cm', 'Τριγωνάκια', 14.00, 'Τριγωνάκια σε διάφορα χρώματα', '["black/gold", "gold", "silver"]'),
('ΣΚ-015', 1, 1, '3,5cm x 1,5cm', 'Μιννιέ', 14.00, 'Με ροζ ή κόκκινο φιόγκο', '["pink", "red"]'),
('ΣΚ-016', 1, 1, '5cm x 3cm', 'Frida Kahlo', 22.00, null, null),
('ΣΚ-017', 1, 1, '7cm x 2cm', 'Τριπλοί ενωμένοι ρόμβοι', 25.00, null, '["white/gold/blue", "white/gold/black", "black/gold"]'),
('ΣΚ-018', 1, 1, '5,3cm x 1,80cm', 'Διπλός πλεκτός ρόμβος', 17.00, null, '["gold/black", "gold/blue", "gold/white"]'),
('ΣΚ-019', 1, 1, '3,3cm περιμ', 'Σενίλ', 20.00, null, '["gold", "silver"]'),
('ΣΚ-020', 1, 1, '3cm περιμ', 'Στριφτό', 20.00, null, '["gold", "silver"]'),
('Β-010', 2, 1, '1cm x 12cm', 'Ρευοτέ απλό', 20.00, 'Βραχιόλι με αυξομειούμενο κούμπωμα marcame', null),
('Β-011', 2, 1, '1,10cm x 12cm', 'Ρευοτέ χιαστί', 25.00, 'Βραχιόλι με αυξομειούμενο κούμπωμα marcame', null),
('Β-012', 2, 1, null, 'Frida Kahlo', 12.00, 'Βραχιόλι με αυξομειούμενο κούμπωμα marcame', null),
('Β-016', 2, 1, '1,50cm x 1,50cm', 'Μιννιε', 12.00, 'Βραχιόλι με αυξομειούμενο κούμπωμα marcame', null),
('ΧΡ-001', 3, 1, '2cm x 0,70cm', 'Χειροπέδα Χρυσή', 20.00, 'Χειροπέδα απο ανοξείδωτο ατσάλι με ακροδέκτες', null),
('ΧΡ-002', 3, 1, '2cm x 0,70cm', 'Χειροπέδα Ασημί (απλή)', 17.00, 'Χειροπέδα απο ανοξείδωτο ατσάλι με ακροδέκτες', null),
('ΧΡ-003-01', 3, 1, '2cm x 0,70cm', 'Χειροπέδα Ασημί (μεγάλη)', 17.00, 'Χειροπέδα ρυθμιζόμενη από ανοξείδοτο ατσάλι μεγάλη', null),
('ΧΡ-003-02', 3, 1, '2cm x 0,70cm', 'Χειροπέδα Ασημί (μικρή)', 14.00, 'Χειροπέδα ρυθμιζόμενη από ανοξείδοτο ατσάλι μικρή', null),
('ΚΡ-009', 4, 1, '1,80cm x 1,50cm', 'Καρδιά', 12.00, 'Καρδιά σε διάφορα χρώματα με αλυσία από ανοξείδοτο ατσάλι', null),
('ΚΡ-010', 4, 1, '1,80cm x 2,00cm', 'Δίχρωμη καρδιά', 15.00, 'Καρδιά με περίγραμμα', '["Χρυσό", "Ασημή/Μάυρο", "Κόκκινο", "Τυρκουάζ"]'),
('ΚΡ-012', 4, 1, '2,00cm x 1,50cm', 'Φάκελος με καρδούλα', 15.00, null,'["Άσπρο", "Μωβ"]'),
('ΚΡ-013', 4, 1, '2,50cm x 1,50cm', 'Μάτι', 15.00, 'Ματί οβάλ με χρυσό περίβλημα', null),
('ΚΡ-014', 4, 1, '3,00cm x 1,50cm', 'Love', 15.00, 'Κόκκινο με χρυσό περίβλημα', null),
('ΚΡ-015', 4, 1, '2,50cm x 1,50cm', 'Χειλάκια', 15.00, 'Κόκκινο με χρυσό περίβλημα', null),
('ΚΡ-016', 4, 1, '1,50cm x 0,50cm', 'Ρολακι', 15.00, 'Ρολάκι σε διάφορα χρώματα', null),
('ΚΡ-025', 4, 1, '1,50cm x 1,50cm', 'Μιννιε (μικρή)', 12.00, 'Με κόκκινο ή ροζ φιόγκο', '["Κόκκινο", "Ροζ"]'),
('ΚΡ-026', 4, 1, '3,00cm x 3,20cm', 'Μιννιε (μεγάλη)', 16.00, null, null),
('ΚΡ-027', 4, 1, '3,30cm x 2,30cm', 'Λαγουδάκι', 16.00, 'Άσπρο με λαγουδάκι και χρυσό περίγραμμα', null),
('ΚΡ-028-01', 4, 1, '3,00cm x 2,50cm', 'Σταυρός (Μεγάλος)', 16.00, 'Μαύρος σταυρός με περίγραμμα χάνδρα BDM 10/0', '["Χρυσό", "Ασημί"]'),
('ΚΡ-028-02', 4, 1, '2,50cm x 2,00cm', 'Σταυρός (Μικρός)', 12.00, 'Μαύρος σταυρός με περίγραμμα χάνδρα BDM 10/0', '["Χρυσό", "Ασημί"]'),
('ΚΡ-029', 4, 1, '2,00cm x 2,00cm', 'Σταυρός Τετράγωνος', 12.00, 'Μαύρος σταυρός με περίγραμμα', '["Χρυσό", "Ασημί"]'),
('ΚΡ-019', 4, 1, '3,00cm x 2,70cm', 'FRIDA KAHLO', 17.00, 'Κεφάλι', null),
('ΚΡ-020', 4, 1, '4,00cm x 2,50cm', 'FRIDA KAHLO', 22.00, 'Σώμα (φόρεμα κόκκινο/μπλε/μαύρο', '["Χρυσό", "Ασημί"]'),
('ΚΡ-030', 4, 1, '2,50cm x 2,00cm', 'Μονόγραμμα', 20.00, 'Μαύρο μονόγραμα με περίγραμμα', '["Χρυσό", "Ασημί"]'),
('ΚΡ-031', 4, 1, '1,70cm x 1,50cm', 'Μονόγραμμα', 20.00, 'Μαύρο μονόγραμα με περίγραμμα', '["Χρυσό", "Ασημί"]'),
('ΣΚ-021', 1, 1, '5,50cm x 3,00cm', 'Ισοσκελές Τρίγωνο', 18.00, 'Τρίγωνο με ρίγες', '["Χρυσό", "Ασημί"]'),
('ΣΚ-022', 1, 1, '4,00cm x 1,70cm', 'Καρπουζάκι', 14.00, 'Καρπουζάκι τριγωνάκι φέτα', '["Χρυσό", "Ασημί", "Μαύρο"]'),
('ΜΝΓ-002', 5, 1, '6,50cm x 3,10cm', 'Αζντεκ μικρό', 50.00, null, '["Χρυσό", "Ασημί", "Μαύρο"]'),
('ΣΕΤ-001', 6, 1, 'ΣΚ8cm/ΒΡ3cm', 'Τρίχρωμο στριφτό', 45.00, 'Στριφτά ρολάκια σετ σκουλαρίκια και μενταγιόν', '["Χρυσό", "Ασημί", "Μαύρο"]'),
('ΣΕΤ-002', 6, 1, 'ΣΚ3,50cm x 1,60cm', 'Ο ', 28.00, 'Μπλέ μάτι', null),
('ΣΕΤ-003', 6, 1, 'ΣΚ3,50cm x 1,00cm', 'Τριγωνάκια ', 45.00, 'Στριφτά ρολάκια σετ σκουλαρίκια και μενταγιόν', null);
```