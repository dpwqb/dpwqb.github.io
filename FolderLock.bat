@echo off
title �ļ��м��ܳ���
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
echo �ļ����ڴ��������йء�lock�����ļ����ļ��У�������ֹ��
pause
goto end
)
if /i exist ".lock../" (goto lock)
if /i exist "�����ļ���" (
goto :unlock
) else (
if "%f%" equ "1" (
md "�����ļ���"
goto setkey
)
echo.
echo 	�״δ��������ļ��У����Թ���Ա������У�
echo.
pause
goto end
)
:setkey
set key=
set rekey=
cd "%~dp0�����ļ���"
set /p key=�����������룺
cls
set /p rekey=���ٴ��������룺
if "%key%" equ "%rekey%" (
attrib -h -r -s "%~dp0�����ļ���\�����ļ���.key" 1>NUL 2>NUL
echo key:%key%>"%~dp0�����ļ���\�����ļ���.key"
attrib +h +r +s "%~dp0�����ļ���\�����ļ���.key"
echo 	�������óɹ���
pause
goto menu
) else (
cls
echo �������벻ͬ�����䣡
goto setkey
)
:unlock
echo.
echo 	��L��	���������ļ��С�����
echo 	��K��	��������
echo 	��Q��	�˳�����
echo.
set /p which=Ҫ���еĲ�����
if /i "%which%" equ "l" (
ren "%~dp0�����ļ���" ".lock../" 1>NUL 2>NUL && (echo 	���ܳɹ���) || (echo 	����ʧ�ܣ�)
pause
goto menu
)
if /i "%which%" equ "k" goto setkey
if /i "%which%" equ "q" goto end
cls
goto unlock
:lock
echo.
echo 	��L��	����lock�ļ��С�����
echo 	��D��	���١�lock�ļ��С�
echo 	��Q��	�˳�����
echo.
set /p which=Ҫ���еĲ�����
if /i "%which%" equ "l" goto decrypt
if /i "%which%" equ "d" goto delete
if /i "%which%" equ "q" goto end
cls
goto lock
:decrypt
cls
if not exist "%~dp0lock~1\�����ļ���.key" (
:without
echo.
echo 	������
ren "%~dp0lock~1" "�����ļ���" 1>NUL 2>NUL && (echo 	���ܳɹ���) || (echo 	����ʧ�ܣ�)
echo.
pause
goto menu
)
set /p key=<"%~dp0lock~1\�����ļ���.key"
if "%key%" equ "key:" goto without
set rekey=
set /p rekey=���������룺
if "%key%" equ "key:%rekey%" ren "%~dp0lock~1" "�����ļ���" 1>NUL 2>NUL && (echo 	���ܳɹ���) || (echo 	����ʧ�ܣ�) else echo 	���벻ƥ�䣡
pause
goto menu
:delete
mode con cols=40 lines=8&color 46
cls
echo.
echo 		���棡����
echo 	���˲������ɻָ���
echo.
echo 	ȷ��Ҫ���١������ļ��С���
set /p destr=���롰destroy�������� ��
if /i "%destr%" equ "destroy" rd /s /q "%~dp0.lock..\" 1>NUL 2>NUL && (echo 	���ٳɹ���) || (echo 	����ʧ�ܣ�)
pause
goto end
:end
exit
