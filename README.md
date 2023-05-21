# Assignment 3
## based on DWAD 19 (2023Q1) by BeeLee
## based on DWAD 20 Framework by Kunxin Chor

## Dependencies
* `express`
* `hbs`
* `wax-on`


To start mysql, in the terminal, type in `mysql -u root`

# Create a new database user
In the MySQL CLI:
```
CREATE USER 'ahkow'@'localhost' IDENTIFIED BY 'rotiprata123';
```

```
GRANT ALL PRIVILEGES on sakila.* TO 'ahkow'@'localhost' WITH GRANT OPTION;
```
**Note:** Replace *sakila* with the name of the database you want the user to have access to
 
 ```
FLUSH PRIVILEGES;
```

## References

Icons and images are created by Stable-diffusion webui. https://github.com/AUTOMATIC1111/stable-diffusion-webui
