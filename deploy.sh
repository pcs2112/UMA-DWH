#!/bin/bash

_cwd="$PWD"
_targetRoot="$HOME/Downloads"

yarn run build
rm -rf "$_targetRoot/UMA-DWH"
rm -rf "$_targetRoot/UMA-DWH.zip"
mkdir "$_targetRoot/UMA-DWH"
cp -r "$_cwd/requirements" "$_targetRoot/UMA-DWH/requirements"
cp -r "$_cwd/requirements.txt" "$_targetRoot/UMA-DWH/requirements.txt"
cp -r "$_cwd/uma_dwh_app.py" "$_targetRoot/UMA-DWH/uma_dwh_app.py"
# cp "$_cwd/.env.example" "$_targetRoot/UMA-DWH/.env"
cp -r "$_cwd/uma_dwh" "$_targetRoot/UMA-DWH/uma_dwh"
cd "$_targetRoot/UMA-DWH"
zip -r "$_targetRoot/UMA-DWH.zip" ./*
