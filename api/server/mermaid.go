package server

import (
	"context"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	"github.com/sashabaranov/go-openai"
)

func GenerateMermaid(scriptResult string, gptRequest string) string {
	err := godotenv.Load(".env")
	if err != nil {
		fmt.Println("Error loading .env file")
	}

	openai_apikey := os.Getenv("OPENAI_APIKEY")

	// gptRequestとscriptResultを統合し、chatgpt APIに投げる

	requestString := "以下の要望とスクリプトの出力結果を元にMermaid形式のテキストを出力せよ。\n\n"

	requestString += "要望\n"

	requestString += gptRequest

	requestString += "\n\n"

	requestString += "スクリプトの出力結果\n-----\n"

	requestString += scriptResult

	// Request for openai API
	client := openai.NewClient(openai_apikey)
	fmt.Println("Start Request to openai API")
	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleUser,
					Content: requestString,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v\n", err)
		return err.Error()
	}

	fmt.Println(resp.Choices[0].Message.Content)
	return resp.Choices[0].Message.Content

	// fmt.Println(requestString)
	// fmt.Println(openai_apikey)
	// return "test"
}
