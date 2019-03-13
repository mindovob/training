<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          DEMO 2
        </h1>
        <p>炎上を未然に予防します</p>
        <p>DEMO２はナイーブな内容の投稿を見つけます</p>
        <p>Powered By
          <a href="https://azure.microsoft.com/ja-jp/services/cognitive-services/text-analytics/">Azure Text Analytics API</a>
        </p>
      </v-flex>
      <v-flex xs12 mb-2>
        <!-- <v-img :src="require('../assets/logo.png')" class="my-3" contain height="200"></v-img> -->
        <v-text-field v-model="message" label="コメントを入力してください">
        </v-text-field>
        <v-btn @click="post" color="error">
          <span>send</span>
        </v-btn>
      </v-flex>
      <v-flex>
        <ul class="msg-box">
          <li v-for="item in items" v-bind:class="{ negative_txt : item.sentiment, danger_txt : item.danger }">
            {{ item.message }}
          </li>
        </ul>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    data: () => ({
      message: '',
      items: [
      ],
    }),
    methods: {
      post() {
        let url = 'https://japanwest.api.cognitive.microsoft.com/text/analytics/v2.0/sentiment';
        let config = {
          headers : {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': '74a23d69dfb7454ea7b604156982695f'
          }
        }
        let data = {
          documents: [
            {
              language : "ja",
              id: "1",
              text : this.message
            },
          ]
        };
        axios.post(url, JSON.stringify(data), config)
        .then(response => {
          let emo_score = response.data.documents[0].score;
          console.log(emo_score);
          let senti_flg = false;
          let danger_flg = false;
          if (emo_score < 0.5){
            senti_flg = true; //しきい値より低ければネガティブコメント
          }
          if (emo_score < 0.3){
            danger_flg = true; //しきい値より低ければ危険なコメント
          }
          let comment = {
            message: this.message,
            sentiment: senti_flg,
            danger: danger_flg
          }
          this.items.unshift(comment) //先頭に追加 末尾追加はpush
          this.message = ''
          });
      }
    }
  }
</script>

<style>
.msg-box {
  padding: 0;
  position: relative;
}

.msg-box li {
  color: black;
  border-left: solid 8px green;
  background: whitesmoke;
  margin-bottom: 5px;
  line-height: 5;
  border-radius: 0 15px 15px 0;
  list-style-type: none! important;
}

.msg-box li.negative_txt {
  border-left: solid 8px #fffaa3;
  background: #fcfbe5;
}

.msg-box li.danger_txt {
  border-left: solid 8px red;
  background: #fce3e3;
}

</style>
