'use strict';

{
  class Panel { // class構文（Panelに関する処理）
    constructor() { // 要素の生成
      // section要素にpanelクラスをつけてその中にimg要素とstopボタンをdiv要素で追加した上でsectionをmainに追加
      const section = document.createElement('section'); // 定数を宣言（constructor内でしか使わない為) section要素を作成
      section.classList.add('panel'); // panelクラスをつける

      this.img = document.createElement('img'); //thisをつけてこのクラスのプロパティにする Panelクラスの他のメソッドでも呼び出したいのでthis
      this.img.src = this.getRandomImage(); // ソース属性の設定 リロードの度にランダムな画像にする

      this.timeoutId = undefined; // timeoutプロパティ初期化 最初は値が定まっていないので明示的にundefined

      this.stop = document.createElement('div'); // div要素
      this.stop.textContent = 'STOP'; // テキストをSTOPに設定
      this.stop.classList.add('stop', 'inactive'); // stop,inactiveクラスをつける(最初SPIN押すまでSTOP押せない)
      this.stop.addEventListener('click', () => { // stopクリックしたら次の処理をする
        if (this.stop.classList.contains('inactive')) { // inactiveクラスがついていたら
          return; // 処理を止める
        }
        this.stop.classList.add('inactive'); // inactiveクラスをつける
        clearTimeout(this.timeoutId); // スロットを止める処理

        panelsLeft--; // stopを押す度にpnalsLeftを-1する

        // panelsLeftが0になった時に結果の判定をする
        if (panelsLeft === 0) {
          spin.classList.remove('inactive'); // inactiveクラスを外してSPINを再び押せるようにする
          panelsLeft = 3; // panelsLeftのリセット
          checkResult(); // 判定の処理の関数
        }
      });

      // sectionの子要素を追加
      section.appendChild(this.img);
      section.appendChild(this.stop);

      // mainに上のsectionを追加
      const main = document.querySelector('main'); // mainの取得 定数を宣言（constructor内でしか使わない為)
      main.appendChild(section); // mainに対してsectionを追加
    }
    // ランダム画像のメソッドの定義
    getRandomImage() {
      const images = [
        'img/seven.png',
        'img/bell.png',
        'img/cherry.png',
      ];
      return images[Math.floor(Math.random() * images.length)]; // imagesの中からランダムな要素を返す
    }
    // spinメソッドの定義
    spin() {
      this.img.src = this.getRandomImage(); //thisのimgのsrcプロパティををランダムな画像のファイル名にする
      this.timeoutId = setTimeout(() => { //spinメソッドの繰り返し
        this.spin(); // spinメソッドの呼び出し
      }, 50); // 50ミリ秒後に次の処理をする
    }

    //このクラスのインスタンスのimgのsrcプロパティが他のimgのsrcプロパティと異なっている場合true,そうでなければfalseを返す
    isUnmatched(p1, p2) {
      // if (this.img.src !== p1.img.src && this.img.src !== p2.img.src) {
      //   return true;
      // } else {
      //   return false;
      // }
     return this.img.src !== p1.img.src && this.img.src !== p2.img.src;
    }
    // このクラスのインスタンスのimgに対してclassListを使ってunmatchクラスをつける
    unmatch() {
      this.img.classList.add('unmatched'); // unmarchedはCSSに記述
    }
    // 連続でスロットを操作するために
    activate() {
      this.img.classList.remove('unmatched'); // imgからunmatchedクラスを外す
      this.stop.classList.remove('inactive'); // stopボタンにinactiveクラスがついてたら外す
    }
  }

  // 結果判定の関数作成 パネルを一つずつ調べて他のパネルとマッチしなかったら色を薄くする。（パネル同士を比較する処理なのでpanelクラスの外で書く）
  function checkResult() {
    if (panels[0].isUnmatched(panels[1], panels[2])) {
      panels[0].unmatch(); //条件trueの場合（他2枚とマッチしない場合）panel[0]に対しunmatch()メソッドを呼び色を薄くする
    }
    if (panels[1].isUnmatched(panels[0], panels[2])) {
      panels[1].unmatch(); //条件trueの場合（他2枚とマッチしない場合）panel[1]に対しunmatch()メソッドを呼び色を薄くする
    }
    if (panels[2].isUnmatched(panels[0], panels[1])) {
      panels[2].unmatch(); //条件trueの場合（他2枚とマッチしない場合）panel[2]に対しunmatch()メソッドを呼び色を薄くする
    }
  }

  // インスタンスの生成
  const panels = [
    new Panel(),
    new Panel(),
    new Panel(),
  ];

  let panelsLeft = 3; //あといくつパネルが残っているかを変数で保持する 初期値3

  // spinボタンにクリックイベントを設定
  const spin = document.getElementById('spin'); // 要素の取得
  spin.addEventListener('click', () => { // クリックしたら次の処理をする
    if (spin.classList.contains('inactive')) { // inactiveクラスがついていた時
      return; // ここで処理を止める
    }
    spin.classList.add('inactive'); // SPINボタン押した後に色を薄くする（CSS記述）
    panels.forEach(panel => { // パネル画像を切り替える(一つ一つの要素をpanelで受け取って次の処理をする)
      panel.activate(); // SPINボタンを押した時に色々外す
      panel.spin(); // panelのspinメソッドを呼び出す
    });
  });
}