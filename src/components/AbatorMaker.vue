<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          DEMO 4
        </h1>
        <p>アバター作るよ！</p>
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
        let url = 'https://japanwest.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceLandmarks=true&returnFaceAttributes=gender';
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
              canvas.width = img.naturalWidth;
              canvas.height = img.naturalHeight;
              ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight);
            }
          }
          img.src = this.uploadedImage; //画像読込
          let emoji = new Image();
          console.log(response.data);
          emoji.onload = function() {
              response.data.forEach(function(person){
                let parts = person.faceLandmarks;
                let scale_h = canvas.height / img.height;
                let scale_w = canvas.width / img.width;

                //左目
                let eye_l_x1 = parts.eyeLeftBottom.x * scale_w;
                let eye_l_y1 = parts.eyeLeftBottom.y * scale_h;
                let eye_l_x2 = parts.eyeLeftInner.x * scale_w;
                let eye_l_y2 = parts.eyeLeftInner.y * scale_h;
                let eye_l_x3 = parts.eyeLeftOuter.x * scale_w;
                let eye_l_y3 = parts.eyeLeftOuter.y * scale_h;
                let eye_l_x4 = parts.eyeLeftTop.x * scale_w;
                let eye_l_y4 = parts.eyeLeftTop.y * scale_h;
                ctx.fillRect(eye_l_x1, eye_l_y1, 1, 1);
                ctx.fillRect(eye_l_x2, eye_l_y2, 1, 1);
                ctx.fillRect(eye_l_x4, eye_l_y4, 1, 1);
                ctx.fillRect(eye_l_x3, eye_l_y3, 1, 1);
                console.log(Math.abs(eye_l_x1-eye_l_x4));

                //右目
                let eye_r_x1 = parts.eyeRightBottom.x * scale_w;
                let eye_r_y1 = parts.eyeRightBottom.y * scale_h;
                let eye_r_x2 = parts.eyeRightInner.x * scale_w;
                let eye_r_y2 = parts.eyeRightInner.y * scale_h;
                let eye_r_x3 = parts.eyeRightOuter.x * scale_w;
                let eye_r_y3 = parts.eyeRightOuter.y * scale_h;
                let eye_r_x4 = parts.eyeRightTop.x * scale_w;
                let eye_r_y4 = parts.eyeRightTop.y * scale_h;
                ctx.fillRect(eye_r_x1, eye_r_y1, 1, 1);
                ctx.fillRect(eye_r_x2, eye_r_y2, 1, 1);
                ctx.fillRect(eye_r_x3, eye_r_y3, 1, 1);
                ctx.fillRect(eye_r_x4, eye_r_y4, 1, 1);

                //左眉
                let eyebrow_l_x1 = parts.eyebrowLeftInner.x * scale_w;
                let eyebrow_l_y1 = parts.eyebrowLeftInner.y * scale_h;
                let eyebrow_l_x2 = parts.eyebrowLeftOuter.x * scale_w;
                let eyebrow_l_y2 = parts.eyebrowLeftOuter.y * scale_h;
                ctx.fillRect(eyebrow_l_x1, eyebrow_l_y1, Math.abs(eyebrow_l_x2-eyebrow_l_x1), Math.abs(eyebrow_l_y2-eyebrow_l_y1));

                //右眉
                let eyebrow_r_x1 = parts.eyebrowRightInner.x * scale_w;
                let eyebrow_r_y1 = parts.eyebrowRightInner.y * scale_h;
                let eyebrow_r_x2 = parts.eyebrowRightOuter.x * scale_w;
                let eyebrow_r_y2 = parts.eyebrowRightOuter.y * scale_h;
                ctx.fillRect(eyebrow_r_x1, eyebrow_r_y1, Math.abs(eyebrow_r_x2-eyebrow_r_x1), Math.abs(eyebrow_r_y2-eyebrow_r_y1));

                //鼻
                let noseAlarOut_l_x = parts.noseLeftAlarOutTip.x * scale_w;
                let noseAlarOut_l_y = parts.noseLeftAlarOutTip.y * scale_h;
                let noseAlar_l_x = parts.noseLeftAlarTop.x * scale_w;
                let noseAlar_l_y = parts.noseLeftAlarTop.y * scale_h;
                let noseAlarOut_r_x = parts.noseRightAlarOutTip.x * scale_w;
                let noseAlarOut_r_y = parts.noseRightAlarOutTip.y * scale_h;
                let noseAlar_r_x = parts.noseRightAlarTop.x * scale_w;
                let noseAlar_r_y = parts.noseRightAlarTop.y * scale_h;
                let noseRoot_l_x = parts.noseRootLeft.x * scale_w;
                let noseRoot_l_y = parts.noseRootLeft.y * scale_h;
                let noseRoot_r_x = parts.noseRootRight.x * scale_w;
                let noseRoot_r_y = parts.noseRootRight.y * scale_h;
                let noseTip_x = parts.noseTip.x * scale_w;
                let noseTip_y = parts.noseTip.y * scale_h;
                ctx.fillRect(noseAlarOut_l_x, noseAlarOut_l_y, 3, 3);
                ctx.fillRect(noseAlar_l_x, noseAlar_l_y, 3, 3);
                ctx.fillRect(noseRoot_l_x, noseRoot_l_y, 3, 3);
                ctx.fillRect(noseAlarOut_r_x, noseAlarOut_r_y, 3, 3);
                ctx.fillRect(noseAlar_r_x, noseAlar_r_y, 3, 3);
                ctx.fillRect(noseRoot_r_x, noseRoot_r_y, 3, 3);
                ctx.fillRect(noseTip_x, noseTip_y, 3, 3);

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
