@echo off
setlocal
cd /d "%~dp0"
echo Installing. Details are being written to setup_log.txt in this folder.
call :work >setup_log.txt 2>&1
if errorlevel 1 goto failed
echo Ready. Select VTuber Live (local .venv) in Jupyter.
if /i not "%~1"=="--quiet" pause
exit /b 0
:failed
type setup_log.txt
echo Setup failed. Share the final error lines from setup_log.txt.
if /i not "%~1"=="--quiet" pause
exit /b 1
:work
set "VTPY=.venv\Scripts\python.exe"
if exist "%VTPY%" goto install
if exist ".venv\conda-meta\history" goto conda
py -3.12 -c "import struct; assert struct.calcsize('P')==8" >nul 2>&1
if not errorlevel 1 (
 py -3.12 -m venv .venv
 if errorlevel 1 exit /b 1
 goto install
)
python -c "import sys,struct; assert sys.version_info[:2]==(3,12) and struct.calcsize('P')==8" >nul 2>&1
if not errorlevel 1 (
 python -m venv .venv
 if errorlevel 1 exit /b 1
 goto install
)
:conda
set "CONDA_BAT="
for /f "delims=" %%I in ('where conda.bat 2^>nul') do if not defined CONDA_BAT set "CONDA_BAT=%%I"
for %%I in ("%USERPROFILE%\anaconda3" "%USERPROFILE%\miniconda3" "%ProgramData%\anaconda3" "%LOCALAPPDATA%\anaconda3" "%LOCALAPPDATA%\miniconda3" "%ProgramData%\miniconda3") do if not defined CONDA_BAT if exist "%%~I\condabin\conda.bat" set "CONDA_BAT=%%~I\condabin\conda.bat"
if not defined CONDA_BAT (
 echo Cannot locate Python 3.12 x64 or Conda. Run this BAT from Anaconda Prompt, or install Python 3.12 x64 with the launcher.
 exit /b 1
)
if not exist ".venv\conda-meta\history" (
 call "%CONDA_BAT%" create -y -p "%CD%\.venv" python=3.12 pip
 if errorlevel 1 exit /b 1
)
call "%CONDA_BAT%" activate "%CD%\.venv"
if errorlevel 1 exit /b 1
set "VTPY=.venv\python.exe"
:install
"%VTPY%" -c "import sys,struct; assert sys.version_info[:2]==(3,12) and struct.calcsize('P')==8, 'Python 3.12 x64 required'"
if errorlevel 1 exit /b 1
"%VTPY%" -m pip install --disable-pip-version-check mediapipe==1.1.0 numpy==2.5.4 opencv-contrib-python==5.0.0.93 scikit-learn==1.9.0 ipykernel==7.4.0
if errorlevel 1 exit /b 1
if errorlevel 1 exit /b 1
"%VTPY%" -m ipykernel install --user --name vtuber-live-local --display-name "VTuber Live (local .venv)"
if errorlevel 1 exit /b 1
exit /b 0
