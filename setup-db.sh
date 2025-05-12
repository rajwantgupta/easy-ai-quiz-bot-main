#!/bin/bash

# MySQL credentials
read -p "Enter MySQL username: " MYSQL_USER
read -s -p "Enter MySQL password: " MYSQL_PASSWORD
echo

# Create database and tables
echo "Creating database and tables..."
mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" < database.sql

# Update .env file with database URL
echo "Updating .env file..."
echo "DATABASE_URL=\"mysql://$MYSQL_USER:$MYSQL_PASSWORD@localhost:3306/training_db\"" >> .env

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

echo "Database setup completed!" 