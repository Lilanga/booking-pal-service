!#/bin/bash

docker run -p 5432:5432 --name postgresql -e POSTGRES_PASSWORD=postgres -d postgres