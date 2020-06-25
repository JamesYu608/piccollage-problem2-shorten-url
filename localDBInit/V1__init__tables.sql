CREATE TABLE tbl_url_pair (
   shortened_path VARCHAR (10) NOT NULL,
   original_url VARCHAR (512) NOT NULL,
   PRIMARY KEY (shortened_path),
   UNIQUE INDEX original_url_INDEX (original_url)
);
