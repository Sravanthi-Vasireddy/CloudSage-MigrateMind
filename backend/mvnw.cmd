@IF "%DEBUG%" == "" @ECHO OFF
@SETLOCAL

set "BASE_DIR=%~dp0"
if "%BASE_DIR:~-1%"=="\" set "BASE_DIR=%BASE_DIR:~0,-1%"

if not "%JAVA_HOME%" == "" goto OkJHome
if exist "C:\Program Files\Java\jdk-21" (
  set "JAVA_HOME=C:\Program Files\Java\jdk-21"
  goto OkJHome
)

:OkJHome

if exist "%BASE_DIR%\.mvn\apache-maven-3.9.9\bin\mvn.cmd" (
  call "%BASE_DIR%\.mvn\apache-maven-3.9.9\bin\mvn.cmd" %*
  exit /b %ERRORLEVEL%
)

for %%i in (mvn.cmd) do set "MVN_CMD=%%~$PATH:i"
if exist "%MVN_CMD%" (
  call "%MVN_CMD%" %*
  exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found. Please install Apache Maven or use the bundled Maven in .mvn/apache-maven-3.9.9.
exit /b 1
