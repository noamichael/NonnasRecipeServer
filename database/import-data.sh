#!/bin/sh
# A script to run in a container to bootstrap all the data
mysql -u ${MYSQL_USER} -p${MYSQL_PASSWORD} ${MYSQL_DATABASE} < ./data.sql