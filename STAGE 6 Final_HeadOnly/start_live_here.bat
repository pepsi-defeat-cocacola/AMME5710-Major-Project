@echo off
setlocal
cd /d "%~dp0"
if not exist ".venv\python.exe" if not exist ".venv\Scripts\python.exe" call setup_here.bat --quiet
if errorlevel 1 goto fail
if exist ".venv\conda-meta\history" (
 set "PATH=%CD%\.venv;%CD%\.venv\Library\bin;%CD%\.venv\Scripts;%PATH%"
 ".venv\python.exe" -u launch_notebook.py %*
) else (
 ".venv\Scripts\python.exe" -u launch_notebook.py %*
)
if errorlevel 1 goto fail
exit /b 0
:fail
echo Check the error above. If a camera session is already open, press Q there first.
pause
exit /b 1
