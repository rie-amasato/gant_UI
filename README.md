# gant_UI

クリックしたらガントチャートっぽくセル色が変わるようなUIを作ってみた 
- ガントのバーの開始日より左のセルをクリックすると、開始日がその日付になる  
- ガントのバーの開始日セルをクリックすると、完了色になる。すでに完了色だった場合、開始日を消去する
- ガントのバーの終了日セルをクリックすると、未完了色になる。すでに未完了色だったら、終了日を消去する
- それ以外のセルをクックすると終了日がそのセルになる
  
- タスク名をクリックするとタスク名の変更ができる。ここでタスク名を消して（空白で）確定するとタスクを消せる  
- タスク名は後ろに#色コードを入力するとバーの色を変えられる  
  
**各操作を行うたびにデータがCookieに保存される**  

タスクはバーみたいに、離れたところをクリックすると間を全部塗る  
今日以前で完了してなかったら炎上レッドに色が変わる  


ちょっといろいろに流用できるようにコード整理もしていきたいかも

https://rie-amasato.github.io/gant_UI/
