@echo off
if "%~1"=="" (
  echo Usage: create-hotel HOTEL_FOLDER_NAME
  echo Example: create-hotel royal-semiramis-hotel
  pause
  exit /b
)

set TEMPLATE=hotel-template
set NAME=%~1

if not exist "%TEMPLATE%\" (
  echo ERROR: Template folder "%TEMPLATE%" not found in current directory.
  pause
  exit /b
)

if exist "%NAME%\" (
  echo ERROR: Folder "%NAME%" already exists.
  pause
  exit /b
)

xcopy "%TEMPLATE%" "%NAME%" /E /I /H /K /Y >nul
echo Done: Created "%NAME%" from "%TEMPLATE%".
pause