@echo off
title 文件夹加密程序
mode con cols=48 lines=8&color 3F
net.exe session 1>NUL 2>NUL && (goto admin) || (goto menu)
:admin
reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem" /v NtfsDisable8dot3NameCreation /d 0 /t REG_DWORD /f
set f=1
:menu
set which=
cls
cd /d "%~dp0"
if /i exist "lock~2" (
echo 文件夹内存在其他有关“lock”的文件或文件夹，程序终止！
pause
goto end
)
if /i exist ".lock../" (goto lock)
if /i exist "加密文件夹" (
goto :unlock
) else (
if "%f%" equ "1" (
md "加密文件夹"
goto setkey
)
echo.
echo 	首次创建加密文件夹，需以管理员身份运行！
echo.
pause
goto end
)
:setkey
set key=
set rekey=
cd "%~dp0加密文件夹"
set /p key=请输入新密码：
cls
set /p rekey=请再次输入密码：
if "%key%" equ "%rekey%" (
attrib -h -r -s "%~dp0加密文件夹\加密文件夹.key" 1>NUL 2>NUL
echo key:%key%>"%~dp0加密文件夹\加密文件夹.key"
attrib +h +r +s "%~dp0加密文件夹\加密文件夹.key"
echo 	密码设置成功！
pause
goto menu
) else (
cls
echo 两次密码不同，重输！
goto setkey
)
:unlock
echo.
echo 	（L）	将“加密文件夹”加密
echo 	（K）	重设密码
echo 	（Q）	退出程序
echo.
set /p which=要进行的操作：
if /i "%which%" equ "l" (
ren "%~dp0加密文件夹" ".lock../" 1>NUL 2>NUL && (echo 	加密成功！) || (echo 	加密失败！)
pause
goto menu
)
if /i "%which%" equ "k" goto setkey
if /i "%which%" equ "q" goto end
cls
goto unlock
:lock
echo.
echo 	（L）	将“lock文件夹”解密
echo 	（D）	销毁“lock文件夹”
echo 	（Q）	退出程序
echo.
set /p which=要进行的操作：
if /i "%which%" equ "l" goto decrypt
if /i "%which%" equ "d" goto delete
if /i "%which%" equ "q" goto end
cls
goto lock
:decrypt
cls
if not exist "%~dp0lock~1\加密文件夹.key" (
:without
echo.
echo 	无密码
ren "%~dp0lock~1" "加密文件夹" 1>NUL 2>NUL && (echo 	解密成功！) || (echo 	解密失败！)
echo.
pause
goto menu
)
set /p key=<"%~dp0lock~1\加密文件夹.key"
if "%key%" equ "key:" goto without
set rekey=
set /p rekey=请输入密码：
if "%key%" equ "key:%rekey%" ren "%~dp0lock~1" "加密文件夹" 1>NUL 2>NUL && (echo 	解密成功！) || (echo 	解密失败！) else echo 	密码不匹配！
pause
goto menu
:delete
mode con cols=40 lines=8&color 46
cls
echo.
echo 		警告！！！
echo 	》此操作不可恢复《
echo.
echo 	确定要销毁“加密文件夹”？
set /p destr=键入“destroy”以销毁 ：
if /i "%destr%" equ "destroy" rd /s /q "%~dp0.lock..\" 1>NUL 2>NUL && (echo 	销毁成功！) || (echo 	销毁失败！)
pause
goto end
:end
exit
