package server

import (
	"context"
	"fmt"

	openai "github.com/sashabaranov/go-openai"
)

func GenerateMermaid(gptRequest string, scriptResult string) string {
	GPT_APIKEY := "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"
	// gptRequestとscriptResultを統合し、chatgpt APIに投げる

	requestString := "以下の要望とスクリプトの出力結果を元にMermaid形式のテキストを出力せよ。\n\n"

	requestString += "要望\n"

	// requestString += gptRequest
	requestString += "要望\n\t・好みを選べるよう３パターン出力する。ただし、どのパターンも全ての要望を満たすこと\n\t・bridgeごとに情報を整理し、その後に統合し、mermaid形式に変換する\n\t・インターフェース名、type、IPアドレスを明記する\n\t・loopbackなどできる限り多くの通信経路を表現する\n\t・subgraphを使い、全ての要素がsubgraphの中に入るようにする\n\t・Hostとコンテナは別領域として表現する\n\t・Internetへ出ていくよう表現する\n\t・稼働しているコンテナは全て表現する\n\t・パターン番号とmermaid形式のテキストのみ出力する\n"

	requestString += "\n\n"

	requestString += "スクリプトの出力結果\n"

	requestString += scriptResult

	requestString = "Hello!"

	// Request for openai API
	client := openai.NewClient(GPT_APIKEY)
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
}
