#/bin/bash

if [ -z "$1" ]
  then
    echo "No day supplied"
    exit 1
fi
day=$1
if [ ${#1} -eq 1 ]
  then
    day="0$1"
fi
cp src/day_template.ts src/day${day}.js
cp src/day_template.ts src/day${day}b.js
touch inputs/day${day}.txt
touch inputs/day${day}_test.txt
