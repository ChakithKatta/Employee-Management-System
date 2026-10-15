@echo off
setlocal
set "MAVEN_BIN=C:\Users\chekith\.m2\wrapper\dists\apache-maven-3.9.10-bin\53h08a94dg6djh6umvruv7q564\apache-maven-3.9.10\bin\mvn.cmd"
if exist "%MAVEN_BIN%" (
    "%MAVEN_BIN%" %*
) else (
    mvn %*
)
