#!/bin/bash

_cwd="$PWD"

yarn run build
rm -rf $HOME/Downloads/UMA-DWH
rm -rf $HOME/Downloads/UMA-DWH.zip
mkdir $HOME/Downloads/UMA-DWH
cp -r "$_cwd/requirements" "$HOME/Downloads/UMA-DWH/requirements"
cp -r "$_cwd/requirements.txt" "$HOME/Downloads/UMA-DWH/requirements.txt"
cp -r "$_cwd/uma_dwh_app.py" "$HOME/Downloads/UMA-DWH/uma_dwh_app.py"
# cp "$_cwd/.env.example" "$HOME/Downloads/UMA-DWH/.env"
cp -r "$_cwd/uma_dwh" "$HOME/Downloads/UMA-DWH/uma_dwh"
