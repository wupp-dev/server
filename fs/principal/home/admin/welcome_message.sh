#!/bin/bash

# Cabecera personalizada
echo "WUPP . DEV" | figlet | lolcat

# Última conexión
last_login=$(last -i -F $USER | head -n 2 | tail -n 1)
login_time=$(echo $last_login | awk '{print $5 " " $6 " " $7 " " $8}')
echo -e "\e[1;33mÚltima conexión:\e[0m" $login_time

# Información del uso del sistema
echo -e "\e[1;33mUso de la CPU:\e[0m" $(grep 'cpu ' /proc/stat | awk '{usage=($2+$4)*100/($2+$4+$5)} END {print usage "%"}')
echo -e "\e[1;33mUso de memoria:\e[0m" $(free -m | awk 'NR==2{printf "%.2f%%\t\t", $3*100/$2 }')

# Espacio en disco
echo -e "\e[1;33mEspacio en disco:\e[0m"
df -h | grep -vE '^tmpfs|udev' | awk '{print $1 "\t" $5 "\t" $6}' | column -t | lolcat

echo ""
