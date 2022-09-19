#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
RESET='\033[0m'

service mysql start

#Check if the database exists

if [ -d "/var/lib/mysql/$MARIADB_DATABASE" ]
then
	echo -e "${RED} Database [$MARIADB_DATABASE] already exists ${RESET}"
else
	# Create root user
	echo -e "${GREEN} GRANT ALL ON *.* TO 'root'@'%' IDENTIFIED BY '$MARIADB_PASSWORD'; FLUSH PRIVILEGES; ${RESET}"
	echo "GRANT ALL ON *.* TO 'root'@'%' IDENTIFIED BY '$MARIADB_PASSWORD'; FLUSH PRIVILEGES;" | mysql -u$MARIADB_USER -p$MARIADB_PASSWORD

	# Create database and grant all on db_user for 42cabi
	echo -e "${GREEN} CREATE DATABASE IF NOT EXISTS $MARIADB_DATABASE; GRANT ALL ON $MARIADB_DATABASE.* TO '$MARIADB_USER'@'%' IDENTIFIED BY '$MARIADB_PASSWORD'; FLUSH PRIVILEGES; ${RESET}"
	echo "CREATE DATABASE IF NOT EXISTS $MARIADB_DATABASE; GRANT ALL ON $MARIADB_DATABASE.* TO '$MARIADB_USER'@'%' IDENTIFIED BY '$MARIADB_PASSWORD'; FLUSH PRIVILEGES;" | mysql -u$MARIADB_USER -p$MARIADB_PASSWORD

	# Import database
	mysql -u$MARIADB_USER -p$MARIADB_PASSWORD $MARIADB_DATABASE < /database/42cabi_v3_test.sql
fi

# Check if the v2 database exists

if [ -d "/var/lib/mysql/$MARIADB_DATABASE_V2" ]
then
	echo -e "${RED} Database [$MARIADB_DATABASE_V2] already exists ${RESET}"
else
	# Create v2 database and grant all on db_user for 42cabi
	echo -e "${GREEN} CREATE DATABASE IF NOT EXISTS $MARIADB_DATABASE_V2; GRANT ALL ON $MARIADB_DATABASE_V2.* TO '$MARIADB_USER'@'%' IDENTIFIED BY '$MARIADB_PASSWORD'; FLUSH PRIVILEGES; ${RESET}"
	echo "CREATE DATABASE IF NOT EXISTS $MARIADB_DATABASE_V2; GRANT ALL ON $MARIADB_DATABASE_V2.* TO '$MARIADB_USER'@'%' IDENTIFIED BY '$MARIADB_PASSWORD'; FLUSH PRIVILEGES;" | mysql -u$MARIADB_USER -p$MARIADB_PASSWORD

	# Import v2 database
	mysql -u$MARIADB_USER -p$MARIADB_PASSWORD $MARIADB_DATABASE_V2 < /database/42cabi_v2_test.sql
	mysql -u$MARIADB_USER -p$MARIADB_PASSWORD $MARIADB_DATABASE_V2 < /database/cabinet_data_v2.sql
fi

service mysql stop

exec "$@"
