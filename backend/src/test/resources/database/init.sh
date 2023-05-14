#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
RESET='\033[0m'

service mysql start

if [ -d "/var/lib/mysql/${MARIADB_DATABASE}" ]
then
	echo -e "${RED} Database already exist!! ${RESET}"
else
	# Create root user
	echo "Create root user..."
	echo -e "${GREEN} GRANT ALL ON *.* TO 'root'@'%' IDENTIFIED BY '$MARIADB_PASSWORD'; FLUSH PRIVILEGES; ${RESET}"
	echo "GRANT ALL ON *.* TO 'root'@'%' IDENTIFIED BY '$MARIADB_PASSWORD'; FLUSH PRIVILEGES;" | mysql -u$MARIADB_USER -p$MARIADB_PASSWORD

	# Create database and grant all on $MARIADB_USER
	echo "Create database and grant all on $MARIADB_USER"
	echo -e "${GREEN} DROP DATABASE IF EXISTS $MARIADB_DATABASE; CREATE DATABASE $MARIADB_DATABASE; GRANT ALL ON $MARIADB_DATABASE.* TO '$MARIADB_USER'@'%' IDENTIFIED BY '$MARIADB_PASSWORD'; FLUSH PRIVILEGES; ${RESET}"
	echo "DROP DATABASE IF EXISTS $MARIADB_DATABASE; CREATE DATABASE $MARIADB_DATABASE; GRANT ALL ON $MARIADB_DATABASE.* TO '$MARIADB_USER'@'%' IDENTIFIED BY '$MARIADB_PASSWORD'; FLUSH PRIVILEGES;" | mysql -u$MARIADB_USER -p$MARIADB_PASSWORD

	# Import database
	echo "Import database"
	echo -e "${GREEN} mysql -u$MARIADB_USER -p$MARIADB_PASSWORD $MARIADB_DATABASE < /database/spring_test_db.sql ${RESET}"
	mysql -u$MARIADB_USER -p$MARIADB_PASSWORD $MARIADB_DATABASE < /database/spring_test_db.sql
fi

# Import sample data
if [ "$(ls -A /database/credentials)" ]
then
	search_dir=/database/credentials
	echo "Import credential data..."
	for entry in "$search_dir"/*
	do
		echo -e "${GREEN} mysql -u$MARIADB_USER -p$MARIADB_PASSWORD $MARIADB_DATABASE < $entry ${RESET}"
		mysql -u$MARIADB_USER -p$MARIADB_PASSWORD $MARIADB_DATABASE < $entry
	done
else
	echo -e "${RED} There is no sample data! ${RESET}"
fi

service mysql stop

exec "$@"
