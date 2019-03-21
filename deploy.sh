#!/bin/bash

_cwd="$PWD"
_targetRoot="$HOME/Downloads"
_rootDirName="UMA-DWH"

yarn run build
rm -rf "$_targetRoot/$_rootDirName"
rm -rf "$_targetRoot/$_rootDirName.zip"
mkdir "$_targetRoot/$_rootDirName"
cp -r "$_cwd/requirements" "$_targetRoot/$_rootDirName/requirements"
cp -r "$_cwd/requirements.txt" "$_targetRoot/$_rootDirName/requirements.txt"
cp -r "$_cwd/uma_dwh_app.py" "$_targetRoot/$_rootDirName/uma_dwh_app.py"
cp "$_cwd/.env.example" "$_targetRoot/$_rootDirName/.env"
cp -r "$_cwd/uma_dwh" "$_targetRoot/$_rootDirName/uma_dwh"
cd "$_targetRoot"
zip -r "$_targetRoot/$_rootDirName.zip" ./${_rootDirName}/*
