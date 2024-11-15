CREATE TABLE lego_pieces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE lego_box (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE lego_box_components (
    parent_box_id INT NOT NULL,
    component_type VARCHAR(10) NOT NULL, -- 'piece' or 'box'
    component_id INT NOT NULL,
    FOREIGN KEY (parent_box_id) REFERENCES lego_box(id),
    CONSTRAINT fk_component_piece FOREIGN KEY (component_id)
        REFERENCES lego_pieces(id) ON DELETE CASCADE
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    total_price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE transaction_boxes (
    lego_box_id INT NOT NULL,
    transaction_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (lego_box_id) REFERENCES lego_box(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

INSERT INTO lego_pieces (name, price) VALUES
('Square', 0.10),
('Rectangle', 0.08),
('Circle', 0.07),
('Triangle', 0.06),
('Hexagon', 0.09);

