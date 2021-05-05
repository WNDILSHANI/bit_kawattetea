-- drop database if exist
DROP DATABASE IF EXISTS `kahawatte_tea`;


-- create new database
CREATE DATABASE `kahawatte_tea`;
USE `kahawatte_tea`;


-- set max allowed packet size
set global max_allowed_packet = 64000000;


-- table definitions
CREATE TABLE `categorizationstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `catmaterialstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `civilstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `collectionstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `customertype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `designation`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NULL
);

CREATE TABLE `distributionstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `dryeringline`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NULL
);

CREATE TABLE `dryeringstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `employeestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `gender`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `grade`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(50) NULL
);

CREATE TABLE `grindingmachine`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NULL
);

CREATE TABLE `grindingnetsize`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NULL
);

CREATE TABLE `grindingstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `materialstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `nametitle`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `packingstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `paymentstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `paymenttype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `permentingmachine`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `permentingstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `porderstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `productstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `route`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `salestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(10) NULL
);

CREATE TABLE `supplierstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `tastingstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `tealeaftype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `teatreetype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `vehiclestatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `vehicletype`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(25) NULL
);

CREATE TABLE `witheringstatus`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `witherline`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(12) NULL
);

CREATE TABLE `categorizationemployee`(
    `categorization_id` INT NOT NULL,
    `employee_id` INT NOT NULL
);

CREATE TABLE `categorizationcollection`(
    `categorization_id` INT NOT NULL,
    `collection_id` INT NOT NULL
);

CREATE TABLE `categorization`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `tostart` DATETIME NULL,
    `toend` DATETIME NULL,
    `categorizationstatus_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `categorizedmaterial`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `categorization_id` INT NULL,
    `material_id` INT NULL,
    `weight` DECIMAL(10,3) NULL,
    `catmaterialstatus_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `collection`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `date` DATE NULL,
    `weight` DECIMAL(10,3) NULL,
    `unitprice` DECIMAL(10,2) NULL,
    `supplier_id` INT NULL,
    `material_id` INT NULL,
    `collectionstatus_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `customer`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `customertype_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `contact1` CHAR(10) NOT NULL,
    `contact2` CHAR(10) NULL,
    `fax` CHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `address` TEXT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `customerpayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `date` DATE NULL,
    `amount` DECIMAL(10,2) NULL,
    `chequeno` VARCHAR(255) NULL,
    `chequebank` VARCHAR(255) NULL,
    `chequebranch` VARCHAR(255) NULL,
    `chequedate` DATE NULL,
    `paymenttype_id` INT NULL,
    `paymentstatus_id` INT NULL,
    `sale_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `customerrefundproduct`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `customerrefund_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `refundprice` DECIMAL(10,2) NOT NULL,
    `qty` INT(11) NOT NULL
);

CREATE TABLE `customerrefund`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `reason` TEXT NULL,
    `date` DATE NULL,
    `amount` DECIMAL(10,2) NULL,
    `chequeno` VARCHAR(255) NULL,
    `chequebank` VARCHAR(255) NULL,
    `chequebranch` VARCHAR(255) NULL,
    `chequedate` DATE NULL,
    `paymenttype_id` INT NULL,
    `paymentstatus_id` INT NULL,
    `sale_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `disposalgradebatch`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `disposal_id` INT NOT NULL,
    `gradebatch_id` INT NOT NULL,
    `weight` DECIMAL(10,2) NOT NULL
);

CREATE TABLE `disposal`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `reason` TEXT NOT NULL,
    `date` DATE NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `distributionemployee`(
    `distribution_id` INT NOT NULL,
    `employee_id` INT NOT NULL
);

CREATE TABLE `distribution`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `sale_id` INT NULL,
    `vehicle_id` INT NULL,
    `distributionstatus_id` INT NULL,
    `contactpersonname` VARCHAR(255) NOT NULL,
    `contactpersonnic` VARCHAR(255) NULL,
    `contactpersontel` CHAR(10) NOT NULL,
    `date` DATE NULL,
    `fee` DECIMAL(10,2) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `dryeringemployee`(
    `dryering_id` INT NOT NULL,
    `employee_id` INT NOT NULL
);

CREATE TABLE `dryeringdryeringline`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `dryering_id` INT NOT NULL,
    `dryeringline_id` INT NOT NULL,
    `initweight` DECIMAL(10,3) NOT NULL,
    `finalweight` DECIMAL(10,3) NULL
);

CREATE TABLE `dryering`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `tostart` DATETIME NULL,
    `toend` DATETIME NULL,
    `initweight` DECIMAL(10,3) NULL,
    `finalweight` DECIMAL(10,3) NULL,
    `dryeringstatus_id` INT NULL,
    `categorizedmaterial_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `employee`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `nametitle_id` INT NOT NULL,
    `callingname` VARCHAR(255) NOT NULL,
    `fullname` VARCHAR(255) NOT NULL,
    `nic` VARCHAR(12) NOT NULL,
    `dobirth` DATE NOT NULL,
    `gender_id` INT NOT NULL,
    `civilstatus_id` INT NULL,
    `employeestatus_id` INT NOT NULL,
    `mobile` VARCHAR(10) NOT NULL,
    `land` VARCHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `photo` CHAR(36) NULL,
    `address` TEXT NOT NULL,
    `designation_id` INT NOT NULL,
    `dorecruit` DATE NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `gradebatch`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `grade_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `categorizedmaterial_id` INT NULL,
    `weight` DECIMAL(10,3) NULL,
    `domanufactured` DATE NULL,
    `doexpire` DATE NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `grindingemployee`(
    `grinding_id` INT NOT NULL,
    `employee_id` INT NOT NULL
);

CREATE TABLE `grindinggrindingmachine`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `grinding_id` INT NOT NULL,
    `grindingmachine_id` INT NOT NULL,
    `initweight` DECIMAL(10,3) NOT NULL,
    `finalweight` DECIMAL(10,3) NULL
);

CREATE TABLE `grinding`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `tostart` DATETIME NULL,
    `toend` DATETIME NULL,
    `initweight` DECIMAL(10,3) NULL,
    `finalweight` DECIMAL(10,3) NULL,
    `grindingstatus_id` INT NULL,
    `grindingnetsize_id` INT NULL,
    `categorizedmaterial_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `inventory`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `qty` INT(11) NULL,
    `initqty` INT(11) NULL,
    `domanufactured` DATE NULL,
    `doexpire` DATE NULL,
    `porder_id` INT NULL,
    `product_id` INT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `material`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `tealeaftype_id` INT NULL,
    `teatreetype_id` INT NULL,
    `unitprice` DECIMAL(10,2) NULL,
    `materialstatus_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `packingemployee`(
    `packing_id` INT NOT NULL,
    `employee_id` INT NOT NULL
);

CREATE TABLE `packingproduct`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `packing_id` INT NOT NULL,
    `product_id` INT NULL,
    `qty` DECIMAL(10,2) NULL
);

CREATE TABLE `packing`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `tostart` DATETIME NULL,
    `toend` DATETIME NULL,
    `packingstatus_id` INT NULL,
    `porder_id` INT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `permentingemployee`(
    `permenting_id` INT NOT NULL,
    `employee_id` INT NOT NULL
);

CREATE TABLE `permentingpermentingmachine`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `permenting_id` INT NOT NULL,
    `permentingmachine_id` INT NOT NULL,
    `initweight` DECIMAL(10,3) NOT NULL,
    `finalweight` DECIMAL(10,3) NULL
);

CREATE TABLE `permenting`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `tostart` DATETIME NULL,
    `toend` DATETIME NULL,
    `initweight` DECIMAL(10,3) NULL,
    `finalweight` DECIMAL(10,3) NULL,
    `permentingstatus_id` INT NULL,
    `categorizedmaterial_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `porderproduct`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `porder_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `qty` DECIMAL(10,2) NOT NULL
);

CREATE TABLE `porder`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `doordered` DATE NOT NULL,
    `dorequired` DATE NOT NULL,
    `dorecived` DATE NOT NULL,
    `description` TEXT NULL,
    `porderstatus_id` INT NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `productmaterial`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `material_id` INT NOT NULL,
    `qty` DECIMAL(10,2) NOT NULL
);

CREATE TABLE `product`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `photo` CHAR(36) NULL,
    `productstatus_id` INT NOT NULL,
    `grade_id` INT NOT NULL,
    `rop` INT(11) NULL,
    `weight` DECIMAL(10,2) NULL,
    `price` DECIMAL(10,2) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `productdisposalinventory`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `productdisposal_id` INT NOT NULL,
    `inventory_id` INT NOT NULL,
    `qty` DECIMAL(10,2) NOT NULL
);

CREATE TABLE `productdisposal`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `reason` TEXT NULL,
    `date` DATE NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `saleinventory`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `sale_id` INT NOT NULL,
    `inventory_id` INT NOT NULL,
    `unitprice` DECIMAL(10,2) NOT NULL,
    `qty` INT(11) NOT NULL
);

CREATE TABLE `sale`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `total` DECIMAL(10,2) NULL,
    `discount` DECIMAL(10,2) NULL,
    `customer_id` INT NULL,
    `salestatus_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `supplier`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `supplierstatus_id` INT NOT NULL,
    `route_id` INT NULL,
    `contact1` CHAR(10) NOT NULL,
    `contact2` CHAR(10) NULL,
    `fax` CHAR(10) NULL,
    `email` VARCHAR(255) NULL,
    `address` TEXT NOT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `deduction`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `supplierpayment_id` INT NOT NULL,
    `name` VARCHAR(255) NULL,
    `amount` DECIMAL(10,2) NULL
);

CREATE TABLE `supplierpayment`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `date` DATE NULL,
    `amount` DECIMAL(10,2) NULL,
    `chequeno` VARCHAR(255) NULL,
    `chequebank` VARCHAR(255) NULL,
    `chequebranch` VARCHAR(255) NULL,
    `chequedate` DATE NULL,
    `paymenttype_id` INT NULL,
    `paymentstatus_id` INT NULL,
    `collection_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `tastingemployee`(
    `tasting_id` INT NOT NULL,
    `employee_id` INT NOT NULL
);

CREATE TABLE `tasting`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `tostart` DATETIME NULL,
    `toend` DATETIME NULL,
    `initweight` DECIMAL(10,3) NULL,
    `finalweight` DECIMAL(10,3) NULL,
    `tastingstatus_id` INT NULL,
    `categorizedmaterial_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `vehicle`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `no` VARCHAR(255) NOT NULL,
    `modal` VARCHAR(255) NULL,
    `brand` VARCHAR(255) NULL,
    `payloadwidth` INT(11) NULL,
    `payloadlength` INT(11) NULL,
    `payloadheight` INT(11) NULL,
    `vehicletype_id` INT NOT NULL,
    `vehiclestatus_id` INT NOT NULL,
    `photo` CHAR(36) NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `witheringemployee`(
    `withering_id` INT NOT NULL,
    `employee_id` INT NOT NULL
);

CREATE TABLE `witheringwitherline`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `withering_id` INT NOT NULL,
    `witherline_id` INT NOT NULL,
    `initweight` DECIMAL(10,3) NOT NULL,
    `finalweight` DECIMAL(10,3) NULL
);

CREATE TABLE `withering`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `code` CHAR(10) NOT NULL,
    `tostart` DATETIME NULL,
    `toend` DATETIME NULL,
    `initweight` DECIMAL(10,3) NULL,
    `finalweight` DECIMAL(10,3) NULL,
    `witheringstatus_id` INT NULL,
    `categorizedmaterial_id` INT NULL,
    `description` TEXT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `user`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `tocreation` DATETIME NULL,
    `tolocked` DATETIME NULL,
    `failedattempts` INT NULL DEFAULT 0,
    `creator_id` INT NULL,
    `photo` CHAR(36) NULL,
    `employee_id` INT NULL
);

CREATE TABLE `userrole`(
    `user_id` INT NOT NULL,
    `role_id` INT NOT NULL
);

CREATE TABLE `role`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `tocreation` DATETIME NULL,
    `creator_id` INT NOT NULL
);

CREATE TABLE `systemmodule`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

CREATE TABLE `usecase`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `task` VARCHAR(255) NOT NULL,
    `systemmodule_id` INT NOT NULL
);

CREATE TABLE `roleusecase`(
    `role_id` INT NOT NULL,
    `usecase_id` INT NOT NULL
);

CREATE TABLE `notification`(
    `id` CHAR(36) NOT NULL,
    `dosend` DATETIME NOT NULL,
    `dodelivered` DATETIME NULL,
    `doread` DATETIME NULL,
    `message` TEXT NOT NULL,
    `user_id` INT NOT NULL
);

CREATE TABLE `token`(
    `id` CHAR(36) NOT NULL,
    `tocreation` DATETIME NULL,
    `toexpiration` DATETIME NULL,
    `ip` VARCHAR(100) NULL,
    `status` VARCHAR(20) NULL,
    `user_id` INT NOT NULL
);

CREATE TABLE `servicelog`(
    `id` CHAR(36) NOT NULL,
    `method` VARCHAR(10) NULL,
    `responsecode` INT NULL,
    `ip` VARCHAR(100) NULL,
    `torequest` DATETIME NULL,
    `url` TEXT NULL,
    `handler` VARCHAR(255) NULL,
    `token_id` CHAR(36) NULL
);

CREATE TABLE `file`(
    `id` CHAR(36) NOT NULL,
    `file` MEDIUMBLOB NULL,
    `thumbnail` MEDIUMBLOB NULL,
    `filemimetype` VARCHAR(255) NULL,
    `thumbnailmimetype` VARCHAR(255) NULL,
    `filesize` INT NULL,
    `originalname` VARCHAR(255) NULL,
    `tocreation` DATETIME NULL,
    `isused` TINYINT NULL DEFAULT 0
);



-- primary key definitions
ALTER TABLE `categorizationemployee` ADD CONSTRAINT pk_categorizationemployee PRIMARY KEY (`categorization_id`,`employee_id`);
ALTER TABLE `categorizationcollection` ADD CONSTRAINT pk_categorizationcollection PRIMARY KEY (`categorization_id`,`collection_id`);
ALTER TABLE `distributionemployee` ADD CONSTRAINT pk_distributionemployee PRIMARY KEY (`distribution_id`,`employee_id`);
ALTER TABLE `dryeringemployee` ADD CONSTRAINT pk_dryeringemployee PRIMARY KEY (`dryering_id`,`employee_id`);
ALTER TABLE `grindingemployee` ADD CONSTRAINT pk_grindingemployee PRIMARY KEY (`grinding_id`,`employee_id`);
ALTER TABLE `packingemployee` ADD CONSTRAINT pk_packingemployee PRIMARY KEY (`packing_id`,`employee_id`);
ALTER TABLE `permentingemployee` ADD CONSTRAINT pk_permentingemployee PRIMARY KEY (`permenting_id`,`employee_id`);
ALTER TABLE `tastingemployee` ADD CONSTRAINT pk_tastingemployee PRIMARY KEY (`tasting_id`,`employee_id`);
ALTER TABLE `witheringemployee` ADD CONSTRAINT pk_witheringemployee PRIMARY KEY (`withering_id`,`employee_id`);
ALTER TABLE `userrole` ADD CONSTRAINT pk_userrole PRIMARY KEY (`user_id`,`role_id`);
ALTER TABLE `roleusecase` ADD CONSTRAINT pk_roleusecase PRIMARY KEY (`role_id`,`usecase_id`);
ALTER TABLE `notification` ADD CONSTRAINT pk_notification PRIMARY KEY (`id`);
ALTER TABLE `token` ADD CONSTRAINT pk_token PRIMARY KEY (`id`);
ALTER TABLE `servicelog` ADD CONSTRAINT pk_servicelog PRIMARY KEY (`id`);
ALTER TABLE `file` ADD CONSTRAINT pk_file PRIMARY KEY (`id`);


-- unique key definitions
ALTER TABLE `categorization` ADD CONSTRAINT unique_categorization_code UNIQUE (`code`);
ALTER TABLE `categorizedmaterial` ADD CONSTRAINT unique_categorizedmaterial_code UNIQUE (`code`);
ALTER TABLE `collection` ADD CONSTRAINT unique_collection_code UNIQUE (`code`);
ALTER TABLE `customer` ADD CONSTRAINT unique_customer_code UNIQUE (`code`);
ALTER TABLE `customerpayment` ADD CONSTRAINT unique_customerpayment_code UNIQUE (`code`);
ALTER TABLE `customerrefund` ADD CONSTRAINT unique_customerrefund_code UNIQUE (`code`);
ALTER TABLE `disposal` ADD CONSTRAINT unique_disposal_code UNIQUE (`code`);
ALTER TABLE `distribution` ADD CONSTRAINT unique_distribution_code UNIQUE (`code`);
ALTER TABLE `dryering` ADD CONSTRAINT unique_dryering_code UNIQUE (`code`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_code UNIQUE (`code`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_nic UNIQUE (`nic`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_mobile UNIQUE (`mobile`);
ALTER TABLE `employee` ADD CONSTRAINT unique_employee_email UNIQUE (`email`);
ALTER TABLE `gradebatch` ADD CONSTRAINT unique_gradebatch_code UNIQUE (`code`);
ALTER TABLE `grinding` ADD CONSTRAINT unique_grinding_code UNIQUE (`code`);
ALTER TABLE `inventory` ADD CONSTRAINT unique_inventory_code UNIQUE (`code`);
ALTER TABLE `material` ADD CONSTRAINT unique_material_code UNIQUE (`code`);
ALTER TABLE `packing` ADD CONSTRAINT unique_packing_code UNIQUE (`code`);
ALTER TABLE `permenting` ADD CONSTRAINT unique_permenting_code UNIQUE (`code`);
ALTER TABLE `porder` ADD CONSTRAINT unique_porder_code UNIQUE (`code`);
ALTER TABLE `product` ADD CONSTRAINT unique_product_code UNIQUE (`code`);
ALTER TABLE `productdisposal` ADD CONSTRAINT unique_productdisposal_code UNIQUE (`code`);
ALTER TABLE `sale` ADD CONSTRAINT unique_sale_code UNIQUE (`code`);
ALTER TABLE `supplier` ADD CONSTRAINT unique_supplier_code UNIQUE (`code`);
ALTER TABLE `supplierpayment` ADD CONSTRAINT unique_supplierpayment_code UNIQUE (`code`);
ALTER TABLE `tasting` ADD CONSTRAINT unique_tasting_code UNIQUE (`code`);
ALTER TABLE `withering` ADD CONSTRAINT unique_withering_code UNIQUE (`code`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_employee_id UNIQUE (`employee_id`);
ALTER TABLE `user` ADD CONSTRAINT unique_user_username UNIQUE (`username`);
ALTER TABLE `role` ADD CONSTRAINT unique_role_name UNIQUE (`name`);


-- foreign key definitions
ALTER TABLE `categorization` ADD CONSTRAINT f_categorization_categorizationstatus_id_fr_categorizationstatu FOREIGN KEY (`categorizationstatus_id`) REFERENCES `categorizationstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `categorizationemployee` ADD CONSTRAINT f_categorizationemployee_categorization_id_fr_categorization_id FOREIGN KEY (`categorization_id`) REFERENCES `categorization`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `categorizationemployee` ADD CONSTRAINT f_categorizationemployee_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `categorizationcollection` ADD CONSTRAINT f_categorizationcollection_categorization_id_fr_categorization_ FOREIGN KEY (`categorization_id`) REFERENCES `categorization`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `categorizationcollection` ADD CONSTRAINT f_categorizationcollection_collection_id_fr_collection_id FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `categorization` ADD CONSTRAINT f_categorization_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `categorizedmaterial` ADD CONSTRAINT f_categorizedmaterial_categorization_id_fr_categorization_id FOREIGN KEY (`categorization_id`) REFERENCES `categorization`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `categorizedmaterial` ADD CONSTRAINT f_categorizedmaterial_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `categorizedmaterial` ADD CONSTRAINT f_categorizedmaterial_catmaterialstatus_id_fr_catmaterialstatus FOREIGN KEY (`catmaterialstatus_id`) REFERENCES `catmaterialstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `categorizedmaterial` ADD CONSTRAINT f_categorizedmaterial_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `collection` ADD CONSTRAINT f_collection_supplier_id_fr_supplier_id FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `collection` ADD CONSTRAINT f_collection_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `collection` ADD CONSTRAINT f_collection_collectionstatus_id_fr_collectionstatus_id FOREIGN KEY (`collectionstatus_id`) REFERENCES `collectionstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `collection` ADD CONSTRAINT f_collection_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customer` ADD CONSTRAINT f_customer_customertype_id_fr_customertype_id FOREIGN KEY (`customertype_id`) REFERENCES `customertype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customer` ADD CONSTRAINT f_customer_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_sale_id_fr_sale_id FOREIGN KEY (`sale_id`) REFERENCES `sale`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerpayment` ADD CONSTRAINT f_customerpayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefund` ADD CONSTRAINT f_customerrefund_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefund` ADD CONSTRAINT f_customerrefund_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefund` ADD CONSTRAINT f_customerrefund_sale_id_fr_sale_id FOREIGN KEY (`sale_id`) REFERENCES `sale`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefundproduct` ADD CONSTRAINT f_customerrefundproduct_product_id_fr_product_id FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefundproduct` ADD CONSTRAINT f_customerrefundproduct_customerrefund_id_fr_customerrefund_id FOREIGN KEY (`customerrefund_id`) REFERENCES `customerrefund`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `customerrefund` ADD CONSTRAINT f_customerrefund_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `disposalgradebatch` ADD CONSTRAINT f_disposalgradebatch_gradebatch_id_fr_gradebatch_id FOREIGN KEY (`gradebatch_id`) REFERENCES `gradebatch`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `disposalgradebatch` ADD CONSTRAINT f_disposalgradebatch_disposal_id_fr_disposal_id FOREIGN KEY (`disposal_id`) REFERENCES `disposal`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `disposal` ADD CONSTRAINT f_disposal_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `distribution` ADD CONSTRAINT f_distribution_sale_id_fr_sale_id FOREIGN KEY (`sale_id`) REFERENCES `sale`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `distribution` ADD CONSTRAINT f_distribution_vehicle_id_fr_vehicle_id FOREIGN KEY (`vehicle_id`) REFERENCES `vehicle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `distribution` ADD CONSTRAINT f_distribution_distributionstatus_id_fr_distributionstatus_id FOREIGN KEY (`distributionstatus_id`) REFERENCES `distributionstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `distributionemployee` ADD CONSTRAINT f_distributionemployee_distribution_id_fr_distribution_id FOREIGN KEY (`distribution_id`) REFERENCES `distribution`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `distributionemployee` ADD CONSTRAINT f_distributionemployee_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `distribution` ADD CONSTRAINT f_distribution_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `dryeringemployee` ADD CONSTRAINT f_dryeringemployee_dryering_id_fr_dryering_id FOREIGN KEY (`dryering_id`) REFERENCES `dryering`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `dryeringemployee` ADD CONSTRAINT f_dryeringemployee_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `dryering` ADD CONSTRAINT f_dryering_dryeringstatus_id_fr_dryeringstatus_id FOREIGN KEY (`dryeringstatus_id`) REFERENCES `dryeringstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `dryering` ADD CONSTRAINT f_dryering_categorizedmaterial_id_fr_categorizedmaterial_id FOREIGN KEY (`categorizedmaterial_id`) REFERENCES `categorizedmaterial`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `dryeringdryeringline` ADD CONSTRAINT f_dryeringdryeringline_dryeringline_id_fr_dryeringline_id FOREIGN KEY (`dryeringline_id`) REFERENCES `dryeringline`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `dryeringdryeringline` ADD CONSTRAINT f_dryeringdryeringline_dryering_id_fr_dryering_id FOREIGN KEY (`dryering_id`) REFERENCES `dryering`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `dryering` ADD CONSTRAINT f_dryering_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_nametitle_id_fr_nametitle_id FOREIGN KEY (`nametitle_id`) REFERENCES `nametitle`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_gender_id_fr_gender_id FOREIGN KEY (`gender_id`) REFERENCES `gender`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_civilstatus_id_fr_civilstatus_id FOREIGN KEY (`civilstatus_id`) REFERENCES `civilstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_employeestatus_id_fr_employeestatus_id FOREIGN KEY (`employeestatus_id`) REFERENCES `employeestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_designation_id_fr_designation_id FOREIGN KEY (`designation_id`) REFERENCES `designation`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `employee` ADD CONSTRAINT f_employee_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `gradebatch` ADD CONSTRAINT f_gradebatch_grade_id_fr_grade_id FOREIGN KEY (`grade_id`) REFERENCES `grade`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `gradebatch` ADD CONSTRAINT f_gradebatch_categorizedmaterial_id_fr_categorizedmaterial_id FOREIGN KEY (`categorizedmaterial_id`) REFERENCES `categorizedmaterial`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `gradebatch` ADD CONSTRAINT f_gradebatch_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `grindingemployee` ADD CONSTRAINT f_grindingemployee_grinding_id_fr_grinding_id FOREIGN KEY (`grinding_id`) REFERENCES `grinding`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `grindingemployee` ADD CONSTRAINT f_grindingemployee_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `grinding` ADD CONSTRAINT f_grinding_grindingstatus_id_fr_grindingstatus_id FOREIGN KEY (`grindingstatus_id`) REFERENCES `grindingstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `grinding` ADD CONSTRAINT f_grinding_grindingnetsize_id_fr_grindingnetsize_id FOREIGN KEY (`grindingnetsize_id`) REFERENCES `grindingnetsize`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `grinding` ADD CONSTRAINT f_grinding_categorizedmaterial_id_fr_categorizedmaterial_id FOREIGN KEY (`categorizedmaterial_id`) REFERENCES `categorizedmaterial`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `grindinggrindingmachine` ADD CONSTRAINT f_grindinggrindingmachine_grindingmachine_id_fr_grindingmachine FOREIGN KEY (`grindingmachine_id`) REFERENCES `grindingmachine`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `grindinggrindingmachine` ADD CONSTRAINT f_grindinggrindingmachine_grinding_id_fr_grinding_id FOREIGN KEY (`grinding_id`) REFERENCES `grinding`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `grinding` ADD CONSTRAINT f_grinding_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `inventory` ADD CONSTRAINT f_inventory_porder_id_fr_porder_id FOREIGN KEY (`porder_id`) REFERENCES `porder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `inventory` ADD CONSTRAINT f_inventory_product_id_fr_product_id FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `inventory` ADD CONSTRAINT f_inventory_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_tealeaftype_id_fr_tealeaftype_id FOREIGN KEY (`tealeaftype_id`) REFERENCES `tealeaftype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_teatreetype_id_fr_teatreetype_id FOREIGN KEY (`teatreetype_id`) REFERENCES `teatreetype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_materialstatus_id_fr_materialstatus_id FOREIGN KEY (`materialstatus_id`) REFERENCES `materialstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `material` ADD CONSTRAINT f_material_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `packingemployee` ADD CONSTRAINT f_packingemployee_packing_id_fr_packing_id FOREIGN KEY (`packing_id`) REFERENCES `packing`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `packingemployee` ADD CONSTRAINT f_packingemployee_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `packing` ADD CONSTRAINT f_packing_packingstatus_id_fr_packingstatus_id FOREIGN KEY (`packingstatus_id`) REFERENCES `packingstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `packing` ADD CONSTRAINT f_packing_porder_id_fr_porder_id FOREIGN KEY (`porder_id`) REFERENCES `porder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `packingproduct` ADD CONSTRAINT f_packingproduct_product_id_fr_product_id FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `packingproduct` ADD CONSTRAINT f_packingproduct_packing_id_fr_packing_id FOREIGN KEY (`packing_id`) REFERENCES `packing`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `packing` ADD CONSTRAINT f_packing_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `permentingemployee` ADD CONSTRAINT f_permentingemployee_permenting_id_fr_permenting_id FOREIGN KEY (`permenting_id`) REFERENCES `permenting`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `permentingemployee` ADD CONSTRAINT f_permentingemployee_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `permenting` ADD CONSTRAINT f_permenting_permentingstatus_id_fr_permentingstatus_id FOREIGN KEY (`permentingstatus_id`) REFERENCES `permentingstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `permenting` ADD CONSTRAINT f_permenting_categorizedmaterial_id_fr_categorizedmaterial_id FOREIGN KEY (`categorizedmaterial_id`) REFERENCES `categorizedmaterial`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `permentingpermentingmachine` ADD CONSTRAINT f_permentingpermentingmachine_permentingmachine_id_fr_permentin FOREIGN KEY (`permentingmachine_id`) REFERENCES `permentingmachine`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `permentingpermentingmachine` ADD CONSTRAINT f_permentingpermentingmachine_permenting_id_fr_permenting_id FOREIGN KEY (`permenting_id`) REFERENCES `permenting`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `permenting` ADD CONSTRAINT f_permenting_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `porder` ADD CONSTRAINT f_porder_porderstatus_id_fr_porderstatus_id FOREIGN KEY (`porderstatus_id`) REFERENCES `porderstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `porderproduct` ADD CONSTRAINT f_porderproduct_product_id_fr_product_id FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `porderproduct` ADD CONSTRAINT f_porderproduct_porder_id_fr_porder_id FOREIGN KEY (`porder_id`) REFERENCES `porder`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `porder` ADD CONSTRAINT f_porder_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `product` ADD CONSTRAINT f_product_productstatus_id_fr_productstatus_id FOREIGN KEY (`productstatus_id`) REFERENCES `productstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `product` ADD CONSTRAINT f_product_grade_id_fr_grade_id FOREIGN KEY (`grade_id`) REFERENCES `grade`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productmaterial` ADD CONSTRAINT f_productmaterial_material_id_fr_material_id FOREIGN KEY (`material_id`) REFERENCES `material`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productmaterial` ADD CONSTRAINT f_productmaterial_product_id_fr_product_id FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `product` ADD CONSTRAINT f_product_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productdisposalinventory` ADD CONSTRAINT f_productdisposalinventory_inventory_id_fr_inventory_id FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productdisposalinventory` ADD CONSTRAINT f_productdisposalinventory_productdisposal_id_fr_productdisposa FOREIGN KEY (`productdisposal_id`) REFERENCES `productdisposal`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `productdisposal` ADD CONSTRAINT f_productdisposal_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `sale` ADD CONSTRAINT f_sale_customer_id_fr_customer_id FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `sale` ADD CONSTRAINT f_sale_salestatus_id_fr_salestatus_id FOREIGN KEY (`salestatus_id`) REFERENCES `salestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `saleinventory` ADD CONSTRAINT f_saleinventory_inventory_id_fr_inventory_id FOREIGN KEY (`inventory_id`) REFERENCES `inventory`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `saleinventory` ADD CONSTRAINT f_saleinventory_sale_id_fr_sale_id FOREIGN KEY (`sale_id`) REFERENCES `sale`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `sale` ADD CONSTRAINT f_sale_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplier` ADD CONSTRAINT f_supplier_supplierstatus_id_fr_supplierstatus_id FOREIGN KEY (`supplierstatus_id`) REFERENCES `supplierstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplier` ADD CONSTRAINT f_supplier_route_id_fr_route_id FOREIGN KEY (`route_id`) REFERENCES `route`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplier` ADD CONSTRAINT f_supplier_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_paymenttype_id_fr_paymenttype_id FOREIGN KEY (`paymenttype_id`) REFERENCES `paymenttype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_paymentstatus_id_fr_paymentstatus_id FOREIGN KEY (`paymentstatus_id`) REFERENCES `paymentstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_collection_id_fr_collection_id FOREIGN KEY (`collection_id`) REFERENCES `collection`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `deduction` ADD CONSTRAINT f_deduction_supplierpayment_id_fr_supplierpayment_id FOREIGN KEY (`supplierpayment_id`) REFERENCES `supplierpayment`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `supplierpayment` ADD CONSTRAINT f_supplierpayment_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `tastingemployee` ADD CONSTRAINT f_tastingemployee_tasting_id_fr_tasting_id FOREIGN KEY (`tasting_id`) REFERENCES `tasting`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `tastingemployee` ADD CONSTRAINT f_tastingemployee_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `tasting` ADD CONSTRAINT f_tasting_tastingstatus_id_fr_tastingstatus_id FOREIGN KEY (`tastingstatus_id`) REFERENCES `tastingstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `tasting` ADD CONSTRAINT f_tasting_categorizedmaterial_id_fr_categorizedmaterial_id FOREIGN KEY (`categorizedmaterial_id`) REFERENCES `categorizedmaterial`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `tasting` ADD CONSTRAINT f_tasting_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `vehicle` ADD CONSTRAINT f_vehicle_vehicletype_id_fr_vehicletype_id FOREIGN KEY (`vehicletype_id`) REFERENCES `vehicletype`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `vehicle` ADD CONSTRAINT f_vehicle_vehiclestatus_id_fr_vehiclestatus_id FOREIGN KEY (`vehiclestatus_id`) REFERENCES `vehiclestatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `vehicle` ADD CONSTRAINT f_vehicle_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `witheringemployee` ADD CONSTRAINT f_witheringemployee_withering_id_fr_withering_id FOREIGN KEY (`withering_id`) REFERENCES `withering`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `witheringemployee` ADD CONSTRAINT f_witheringemployee_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `withering` ADD CONSTRAINT f_withering_witheringstatus_id_fr_witheringstatus_id FOREIGN KEY (`witheringstatus_id`) REFERENCES `witheringstatus`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `withering` ADD CONSTRAINT f_withering_categorizedmaterial_id_fr_categorizedmaterial_id FOREIGN KEY (`categorizedmaterial_id`) REFERENCES `categorizedmaterial`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `witheringwitherline` ADD CONSTRAINT f_witheringwitherline_witherline_id_fr_witherline_id FOREIGN KEY (`witherline_id`) REFERENCES `witherline`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `witheringwitherline` ADD CONSTRAINT f_witheringwitherline_withering_id_fr_withering_id FOREIGN KEY (`withering_id`) REFERENCES `withering`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `withering` ADD CONSTRAINT f_withering_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_employee_id_fr_employee_id FOREIGN KEY (`employee_id`) REFERENCES `employee`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `user` ADD CONSTRAINT f_user_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `userrole` ADD CONSTRAINT f_userrole_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `userrole` ADD CONSTRAINT f_userrole_role_id_fr_role_id FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `role` ADD CONSTRAINT f_role_creator_id_fr_user_id FOREIGN KEY (`creator_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `roleusecase` ADD CONSTRAINT f_roleusecase_role_id_fr_role_id FOREIGN KEY (`role_id`) REFERENCES `role`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `roleusecase` ADD CONSTRAINT f_roleusecase_usecase_id_fr_usecase_id FOREIGN KEY (`usecase_id`) REFERENCES `usecase`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `usecase` ADD CONSTRAINT f_usecase_systemmodule_id_fr_systemmodule_id FOREIGN KEY (`systemmodule_id`) REFERENCES `systemmodule`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `notification` ADD CONSTRAINT f_notification_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `token` ADD CONSTRAINT f_token_user_id_fr_user_id FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
ALTER TABLE `servicelog` ADD CONSTRAINT f_servicelog_token_id_fr_token_id FOREIGN KEY (`token_id`) REFERENCES `token`(`id`) ON UPDATE CASCADE ON DELETE RESTRICT;
