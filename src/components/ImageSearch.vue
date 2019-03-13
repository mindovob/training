<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          DEMO 3
        </h1>
        <p>類似画像を検索します</p>
        <p>DEMO３はクラウドに保存してある自身のアルバムから似たものを見つけます。</p>
      </v-flex>
      <v-flex xs12>
        <!-- upload area -->
        <v-layout class="upload_area">
          <v-img v-if="uploadedImage" :src="uploadedImage" contain height="295"></v-img>
          <span v-else class="font-weight-bold">Please push add button and upload your Image</span>
        </v-layout>

        <!-- upload button -->
        <v-flex mb-2>
          <v-btn @click="upload" fab dark color="teal">
            <v-icon>add</v-icon>
          </v-btn>
          <input id="fileup" type="file" class="no-display" v-on:change="onFileChange">
        </v-flex>

        <!-- album image list -->
          <p>似ている画像を表示します</p>
          <v-flex class="img_list">
            <img :src="src" v-for="(src, id) in bagImages" class="item_img"></v-img>
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
      message: '',
      bagImages: {
        0: require('../demo3data/bag/0001.jpg'),
        1: require('../demo3data/bag/0002.jpg'),
        2: require('../demo3data/bag/0004.jpg'),
        3: require('../demo3data/bag/0005.jpg'),
        4: require('../demo3data/bag/0006.jpg'),
        5: require('../demo3data/bag/0007.jpg'),
        6: require('../demo3data/bag/0008.jpg'),
        7: require('../demo3data/bag/0009.jpg'),
        8: require('../demo3data/bag/0010.jpg'),
        9: require('../demo3data/bag/0011.jpg'),
        10: require('../demo3data/bag/0012.jpg'),
        11: require('../demo3data/bag/0013.jpg'),
        12: require('../demo3data/bag/0014.jpg'),
        13: require('../demo3data/bag/0015.jpg'),
        14: require('../demo3data/bag/0016.jpg'),
        15: require('../demo3data/bag/0017.jpg'),
        16: require('../demo3data/bag/0018.jpg'),
        17: require('../demo3data/bag/0019.jpg'),
        18: require('../demo3data/bag/0020.jpg'),
      },
      items: [
      ],
    }),
    methods: {
      get_imgpath(slug) {
        return require("@/demo3data/bag/" + slug + ".jpg");
      },
      upload() {
        document.getElementById("fileup").click();
      },
      onFileChange(e) {
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

.no-display {
  display: none;
}

.img_list{
  margin: auto;
  width: 600px;
}

.item_img {
  width: calc(20% - 10px);
  margin: 5px;
}
</style>
