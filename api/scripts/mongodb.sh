#!/bin/bash

# MongoDB connection details
DB_ADDRESS=""
DB_NAME=""
USERNAME=""
PASSWORD=""

# Check if the unique index on ID already exists
ID_INDEX_EXISTS=$(mongosh $DB_ADDRESS \
  --username $USERNAME \
  --password $PASSWORD \
  --quiet \
  --eval "
    db.getSiblingDB('$DB_NAME').posts.getIndexes()
      .some(index => index.key.id == 1 && index.unique == true)
  ")

if [ "$ID_INDEX_EXISTS" = "true" ]; then
  echo "Unique index on ID field already exists."
else
  mongosh $DB_ADDRESS \
    --username $USERNAME \
    --password $PASSWORD \
    --quiet \
    --eval "
      db.getSiblingDB('$DB_NAME').posts.createIndex(
        { 'id': 1 },
        { unique: true }
      );
      print('Unique index on ID field created.');
    "
fi

# Check if the index on Tags already exists
TAGS_INDEX_EXISTS=$(mongosh $DB_ADDRESS \
  --username $USERNAME \
  --password $PASSWORD \
  --quiet \
  --eval "
    db.getSiblingDB('$DB_NAME').posts.getIndexes()
      .some(index => index.key.tags == 1)
  ")

if [ "$TAGS_INDEX_EXISTS" = "true" ]; then
  echo "Index on Tags field already exists."
else
  mongosh $DB_ADDRESS \
    --username $USERNAME \
    --password $PASSWORD \
    --quiet \
    --eval "
      db.getSiblingDB('$DB_NAME').posts.createIndex(
        { 'tags': 1 }
      );
      print('Index on Tags field created.');
    "
fi
