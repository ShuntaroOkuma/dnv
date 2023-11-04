#!/bin/bash

# 出力ファイルの設定
output_file="network_info.txt"

# ホストマシンのネットワーク情報の取得
echo "1. ホストマシンのネットワーク情報" > $output_file
echo "IPアドレスとサブネットマスク:" >> $output_file
ip addr show >> $output_file
echo "ゲートウェイ:" >> $output_file
ip route show default >> $output_file
echo "DNSサーバー:" >> $output_file
cat /etc/resolv.conf >> $output_file
echo "ネットワークインターフェース:" >> $output_file
ifconfig -a >> $output_file
echo "" >> $output_file

# Docker環境のネットワーク情報の取得
echo "2. Docker環境のネットワーク情報" >> $output_file
echo "DockerコンテナのIPアドレス:" >> $output_file
docker ps --format "{{.Names}}" | while read container; do
  echo "$container: $(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $container)" >> $output_file
done
echo "ブリッジネットワークの情報:" >> $output_file
docker network inspect bridge >> $output_file
echo "オーバーレイネットワークの情報:" >> $output_file
docker network ls --filter "driver=overlay" --format "{{.Name}}" | while read overlay_network; do
  echo "$overlay_network:" >> $output_file
  docker network inspect $overlay_network >> $output_file
done
echo "" >> $output_file

# VXLANの設定情報の取得
echo "3. VXLANの設定情報" >> $output_file
echo "VXLANインターフェースの情報:" >> $output_file
ip -d link show type vxlan >> $output_file

