package server

import (
	"context"
	"fmt"
	"os/exec"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

// Get host machine and docker network information
func GetHostAndDockerNetwork() string {
	commands := []struct {
		title string
		cmd   string
	}{
		{"IPアドレスとサブネットマスク:", "ip addr show"},
		{"ゲートウェイ:", "ip route show default"},
		{"DNSサーバー:", "cat /etc/resolv.conf"},
		{"ネットワークインターフェース:", "ifconfig -a"},
	}

	output := "1. ホストマシンのネットワーク情報\n"
	for _, c := range commands {
		out, err := exec.Command("bash", "-c", c.cmd).Output()
		if err != nil {
			fmt.Printf("Failed to execute command: %s\n", err)
			output += c.title + "\nFailed to execute command\n"
		} else {
			output += c.title + "\n" + string(out) + "\n"
		}
	}

	cli, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		panic(err)
	}

	containers, err := cli.ContainerList(context.Background(), types.ContainerListOptions{})
	if err != nil {
		panic(err)
	}

	output += "\n2. Docker環境のネットワーク情報\n"
	output += "\nDockerコンテナのIPアドレス:\n"
	for _, container := range containers {
		for _, network := range container.NetworkSettings.Networks {
			output += fmt.Sprintf("%s: %s\n", container.Names[0], network.IPAddress)
		}
	}

	networks, err := cli.NetworkList(context.Background(), types.NetworkListOptions{})
	if err != nil {
		panic(err)
	}

	output += "\nブリッジネットワークの情報:\n"
	for _, network := range networks {
		if network.Driver == "bridge" {
			details, err := cli.NetworkInspect(context.Background(), network.ID, types.NetworkInspectOptions{})
			if err != nil {
				panic(err)
			}
			output += fmt.Sprintf("%s\n", details)
		}
	}

	output += "\nオーバーレイネットワークの情報:\n"
	for _, network := range networks {
		if network.Driver == "overlay" {
			details, err := cli.NetworkInspect(context.Background(), network.ID, types.NetworkInspectOptions{})
			if err != nil {
				panic(err)
			}
			output += fmt.Sprintf("%s\n", details)
		}
	}

	output += "\n3. VXLANの設定情報\n"
	out, err := exec.Command("bash", "-c", "ip -d link show type vxlan").Output()
	if err != nil {
		fmt.Printf("Failed to execute command: %s\n", err)
		output += "\nVXLANインターフェースの情報:\nFailed to execute command\n"
	} else {
		output += "\nVXLANインターフェースの情報:\n" + string(out) + "\n"
	}

	return output

}
