#/bin/sh

COMPILE_DIR=$1
echo $1
if [ -z "$1" ]  
then
    echo "SETTING Default"
    COMPILE_DIR=contracts
fi


echo "COMPILE DIR $COMPILE_DIR"

CONTRACTS_BUILD_DIR=build/contracts
OUTPUT_DIR=untruffle/compiled

rm -r $OUTPUT_DIR
mkdir -p $OUTPUT_DIR
/usr/local/Cellar/solidity@5/0.5.16/bin/solc -o $OUTPUT_DIR --bin --abi --optimize $COMPILE_DIR/*.sol --allow-paths *,

mkdir -p $CONTRACTS_BUILD_DIR
