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
		{"IP Address and Subnet mask:", "ip addr show"},
		{"Gateway:", "ip route show default"},
		{"DNS server:", "cat /etc/resolv.conf"},
		{"Network Interfaces:", "ifconfig -a"},
	}

	output := "1. Host Environment\n"
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

	output += "\n2. Docker Environment\n"
	output += "\nDocker Container's IP Addresses:\n"
	for _, container := range containers {
		for _, network := range container.NetworkSettings.Networks {
			output += fmt.Sprintf("%s: %s\n", container.Names[0], network.IPAddress)
		}
	}

	networks, err := cli.NetworkList(context.Background(), types.NetworkListOptions{})
	if err != nil {
		panic(err)
	}

	output += "\nBridge network:\n"
	for _, network := range networks {
		if network.Driver == "bridge" {
			details, err := cli.NetworkInspect(context.Background(), network.ID, types.NetworkInspectOptions{})
			if err != nil {
				panic(err)
			}
			output += fmt.Sprintf("%s\n", details)
		}
	}

	output += "\nOverlay Network:\n"
	for _, network := range networks {
		if network.Driver == "overlay" {
			details, err := cli.NetworkInspect(context.Background(), network.ID, types.NetworkInspectOptions{})
			if err != nil {
				panic(err)
			}
			output += fmt.Sprintf("%s\n", details)
		}
	}

	output += "\n3. VXLAN config\n"
	out, err := exec.Command("bash", "-c", "ip -d link show type vxlan").Output()
	if err != nil {
		fmt.Printf("Failed to execute command: %s\n", err)
		output += "\nVXLAN Interfaces:\nFailed to execute command\n"
	} else {
		output += "\nVXLAN Interfaces:\n" + string(out) + "\n"
	}

	return output

}
