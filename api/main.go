package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"

	pb "dnv/pkg/pb/proto/dnv/v1"
	server "dnv/server"
)

type DnvServer struct {
	pb.UnimplementedDnvServer
}

func (s *DnvServer) RunScript(ctx context.Context, req *pb.GetRunScript) (*pb.ScriptResult, error) {
	return &pb.ScriptResult{
		ScriptResult: server.GetHostAndDockerNetwork(),
	}, nil
}

func (s *DnvServer) GetMermaid(ctx context.Context, req *pb.GetMermaidRequest) (*pb.Mermaid, error) {
	return &pb.Mermaid{
		Mermaid: server.GenerateMermaid(req.GetGptRequest(), req.GetScriptResult()),
	}, nil
}

func NewDnvServer() *DnvServer {
	return &DnvServer{}
}

func main() {
	port := 8888
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		panic(err)
	}

	s := grpc.NewServer()

	pb.RegisterDnvServer(s, NewDnvServer())

	// Register reflection service on gRPC server.
	reflection.Register(s)

	go func() {
		log.Printf("start gRPC server port: %v", port)
		err := s.Serve(listener)
		if err != nil {
			panic(err)
		}
	}()

	// Graceful shutdown when Ctrl+C is entered
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, os.Interrupt)
	<-quit
	log.Println("stopping gRPC server...")
	s.GracefulStop()
}
