<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          DEMO 1
        </h1>
        <p>あなたのプライバシーを保護します</p>
        <p>DEMO１は写真の中の人物の顔をアイコンで隠します</p>
        <p>Powered By
          <a href="https://azure.microsoft.com/ja-jp/services/cognitive-services/face/">Azure Face API</a>
        </p>
      </v-flex>
      <v-flex xs12>
        <!-- <v-img :src="require('../assets/logo.png')" class="my-3" contain height="200"></v-img> -->
        <v-layout class="upload_area">
          <v-img v-if="uploadedImage" :src="uploadedImage" contain height="295"></v-img>
          <span v-else class="font-weight-bold">Please push add button and upload your Image</span>
        </v-layout>

        <!-- 1st -->

        <v-btn @click="upload" fab dark color="teal" v-if="upload_flg == false && complete_flg == false">
          <v-icon>add</v-icon>
        </v-btn>

        <!-- 2nd -->

        <input id="fileup" type="file" class="no-display" v-on:change="onFileChange">
        <v-layout justify-center v-if="upload_flg">
          <p class="font-weight-bold guide-txt">Please Select Emoticon</p>
        </v-layout>
        <v-flex mb-5 class="emo-list" v-if="upload_flg">
          <v-flex v-for="(emo, id) in emo_list">
            <label>
              <input type="radio" name="emoticon" :value="id" v-model="emoId">
              <v-img :src="emo" contain height="70" class="emo"></v-img>
            </label>
          </v-flex>
        </v-flex>
        <v-flex v-show="upload_flg">
          <v-layout justify-center>
            <v-btn @click="back" color="teal lighten-5">Back</v-btn>
            <v-btn @click="post" color="teal lighten-3">OK</v-btn>
          </v-layout>
        </v-flex>

        <!-- 3rd -->
        <v-flex v-if="complete_flg">
          <v-flex xs12 mb-2 class="font-weight-bold guide-txt">Completed!</v-flex>
          <v-flex xs12 mb-2>
            <canvas id="canvas" width="600" height="400" contain></canvas>
          </v-flex>
          <v-flex xs12 mb-2 class="font-weight-bold">右クリックで画像を保存</v-flex>
          <v-flex xs12>
            <v-btn @click="top" color="teal lighten-5">TOP</v-btn>
          </v-flex>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      uploadedImage: '',
      mergedImage: '',
      binaryImage: '',
      upload_flg: false,
      complete_flg: false,
      emo_list: {
        1: require('../assets/angel.png'),
        2: require('../assets/toutoi.png'),
        3: require('../assets/kawa.png'),
        4: require('../assets/yaba.png'),
        5: require('../assets/think.png'),
      },
      emoId : ''
    }),
    methods: {
      upload() {
        document.getElementById("fileup").click();
      },
      back() {
        this.uploadedImage = '';
        this.upload_flg = false;
      },
      top() {
        this.uploadedImage = '';
        this.mergedImage = '';
        this.binaryImage = '';
        this.upload_flg = false;
        this.complete_flg = false;
      },
      onFileChange(e) {
        //ファイルアップ後　写真表示、絵文字選択
        let files = e.target.files || e.dataTransfer.files;
        this.binaryImage = files[0];
        this.createImage(files[0]);
        this.upload_flg = true;
      },
      createImage(file) {
        let reader = new FileReader();
        reader.onload = (e) => {
          this.uploadedImage = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      post() {
        //絵文字選択後、API叩く
        this.upload_flg = false;
        this.complete_flg = true;
        let url = 'https://japanwest.api.cognitive.microsoft.com/face/v1.0/detect';
        let config = {
          headers : {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': 'ba453471f1b6451697e6c1f2a287de8d'
          }
        }
        axios.post(url, this.binaryImage, config)
        .then(response => {
          //画像合成して出力
          let canvas = document.getElementById('canvas');
          let ctx = canvas.getContext('2d');
          let img = new Image();
          img.onload = function(){ //画像読み終わったら実行される処理
            if (img.naturalWidth > 600) {
              let sh_height = img.naturalHeight * 600 / img.naturalWidth;
              canvas.setAttribute("width", "600");
              canvas.setAttribute("height", sh_height.toString());
              ctx.drawImage(img, 0, 0, 600, sh_height);
            } else if (img.naturalHeight > 400) {
              let sh_width = img.naturalWidth * 400 / img.naturalHeight;
              canvas.setAttribute("width", sh_width.toString());
              canvas.setAttribute("height", "800");
              ctx.drawImage(img, 0, 0, sh_width, 400);
            } else {
              ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            }
          }
          img.src = this.uploadedImage; //画像読込
          let emoji = new Image();
          console.log(response.data);
          emoji.onload = function() {
              response.data.forEach(function(person){
                let x = person.faceRectangle.left * canvas.width / img.width;
                let y = person.faceRectangle.top * canvas.height / img.height;
                let w = person.faceRectangle.width * canvas.width / img.width;
                let h = person.faceRectangle.height * canvas.height / img.height;
                ctx.drawImage(emoji, x, y, w, h);
              })
          }
          emoji.src = this.emo_list[this.emoId];
        })
      }
    }
  }
</script>

<style>
.upload_area {
  margin: auto;
  margin-bottom: 10px;
  height: 300px;
  max-width: 500px;
  background: #fefefe;
  border: dashed 2px #1EA296;
}

.upload_area span {
  font-size: 18px;
  color: #1EA296;
  margin: auto;
}

input[type="radio"] {
  display: none;
}

input[type="radio"]:checked + .emo {
  background-color: #eee;
}

.no-display {
  display: none;
}

.emo {
  border-radius: 10px;
}

.emo:hover {
  background-color: #eee;
}

.emo-list {
  padding-top: 10px;
  display: flex;
}

.guide-txt {
  padding-top: 10px;
  font-size: 30px;
  color: #fff;
  -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #1EA296;
}
</style>
