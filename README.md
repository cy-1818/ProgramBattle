# ProgramBattle
簡単に言うと、Javascriptで作られたBot同士を戦わせることのできるプロフラムです。

## 関数一覧
| 関数名 | 動作 |
| ---- | ---- |
| scan(向き,距離) | 指定された向き、指定された距離までにいるオブジェクトを検索します。<br>返り値は\[\[見つけたオブジェクト1の名前,見つけたオブジェクト1のx座標,見つけたオブジェクト1のy座標],\[見つけたオブジェクト2の名前...],...]と言う形式です。<br>敵だけでなく、味方、shotで撃たれた球、アイテムなどあらゆるオブジェクトを探すことができます。<br>消費mpは距離-100です。マイナスにはなりません。 |
| search(名前) | オブジェクトの名前を指定すると、そのオブジェクトの座標を\[x座標,y座標]の形式で返します。<br>消費mpは一律に100000です。 |
| move(向き,速さ) | 指定された向きに指定された速さで動きます。速さの上限は1000で、1000より大きい値を与えられると速さ1000で動きます。また、1ターンに一度しか使えません。<br>消費mpは速さ-20です。マイナスにはなりません。 |
| warp(x座標,y座標) |指定された座標にワープします。<br>消費mpは一律に100000000です。
| heal(量) | hpを指定された量回復します。<br>消費mpは、回復したい量×現在のhp÷100です。hpが多いほど回復しづらくなります。 |
| shot(向き,速さ) | 指定された向きに、指定された速さの球を撃ちます。他の、味方でないオブジェクトにあたると速さ×2のダメージを与えます。相手のhpが速さ×2より少なかった場合、遅くなって球は進み続けます。また、相手が撃った球にも当たります。1ターンに10発しか撃てません。<br>消費mpは速さの値と同じです。 |
| bomb(力,時間) | 指定された力で、指定された時間後に爆発するボムをその場に設置することができます。範囲攻撃で、自分の味方でもダメージが入ります。<br>消費mpは力の4乗÷{(時間+1)×10}です。 |
| mpGainUp() | mpGain(1ターンごとに貰えるmpの量)を10倍します。<br>消費mpは現在のmpGainの2乗÷100です。 |
| makeSub(プログラム,hp,mp,名前,色,縁取りの色) | 味方を作ります。作られた味方は指定されたhp、mpを持っており、色も指定することが出来ます。プロフラムは本体と同じように作ることができ、本体で使える関数も全て使えます。なお、プロフラムは文字列で与えてください。<br>消費mpは、指定したmp+指定したhp×10+1000000です。 |
| sendMP(名前,量) | オブジェクトの名前を与えると、そのオブジェクトに指定した量のmpを送ります。一応敵にも送れます。<br>消費mpは送る量×1.1です。 |
| getX() | 自身のx座標を取得します。 |
| getY() | 自身のy座標を取得します。 |
| getHP() | 自身のhpを取得します。 |
| getMP() | 自身のmpを取得します。 |
| getMpGain() | 自身のmpGainを取得します。 |
| first() | 1ターン目ならtrue、でなければfalseを返します。変数の初期化に使えます。 |

## 変数名・関数名に使ってはいけない名前一覧
内部で使われている物です。
* screen
* c
* redHP
* blueHP
* jsid
* shotTime
* moveLogi
* itemKind
* itemLogi
* HPE
* HPT
* isThere
* whatThere
* getObjectByName
* makeObject
* die
* outCheck
* addDrow
* hpCheck
* funcs
* setFunc
* makeItem
* giveMP
* run
* draw
* hpShow
* js
* start

## その他注意点
* 毎ターン入力されたプロフラムを実行するシステムです。無限ループは使わないでください。
* 一行ごとにセミコロンをつけてください。
* 変数宣言の際、varやlet、constを使うと次ターンに保持されません。
* ソースコードはパブリック・ドメイン状態に置きます。営利目的でも改変、再配布等していただいて結構です。

[では、頑張ってください！](https://cy-1818.github.io/ProgramBattle/)
