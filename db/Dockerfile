FROM  mysql:8.0

ENV TZ=Asia/Tokyo
COPY init/1_create_tables.sql /docker-entrypoint-initdb.d/1_create_tables.sql
COPY my.conf /etc/mysql/conf.d/my.conf

CMD ["mysqld", "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci", "--default-authentication-plugin=mysql_native_password"]