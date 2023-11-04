# API(backend)

- Mermaid を生成する API
  - args:
    - scriptResult: string
    - gptRequest: string
  - response:
    - mermaid: string
- スクリプトを実行する API
  - args:
    - none
  - response:
    - scriptResult: string

# Web application(frontend)

- 自分の環境の情報を表示する

  - 画面にアクセスする
  - スクリプトを実行する API を叩く
  - response を表示する

- Mermaid を生成する

  - Mermaid を生成するボタンを押す
  - Mermaid を生成する API を叩く
    - スクリプトの実行結果をリクエストとして渡す
  - response を表示する

- 要望を Mermaid 生成 API に投げる
  - 要望を入力する
    　- 追加/削除/編集できる
  - 要望を Mermaid 生成 API に投げる
    - 要望をリクエストとして渡す
  - response を表示する
